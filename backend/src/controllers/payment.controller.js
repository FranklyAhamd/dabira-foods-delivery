const axios = require('axios');
const crypto = require('crypto');

// Get Monnify credentials from settings
const getMonnifyCredentials = async (prisma) => {
  const settings = await prisma.settings.findFirst();
  if (!settings || !settings.monnifyApiKey || !settings.monnifySecretKey || !settings.monnifyContractCode) {
    throw new Error('Monnify credentials not configured. Please configure Monnify in settings.');
  }
  return {
    apiKey: settings.monnifyApiKey,
    secretKey: settings.monnifySecretKey,
    contractCode: settings.monnifyContractCode
  };
};

// Generate Monnify authorization header
const generateMonnifyAuth = (apiKey, secretKey) => {
  const credentials = `${apiKey}:${secretKey}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
};

// Initialize Monnify payment
// Note: verifyToken middleware makes req.user optional for guests
const initializePayment = async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone, items, deliveryAddress, notes } = req.body;
    const prisma = req.app.get('prisma');
    
    // Allow both authenticated users and guests (req.user may be undefined for guests)

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Get Monnify credentials
    const credentials = await getMonnifyCredentials(prisma);

    // Generate unique transaction reference
    const transactionReference = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Prepare payment description
    const paymentDescription = items && items.length > 0
      ? `Payment for ${items.length} item(s)`
      : 'Payment for order';

    // Initialize Monnify transaction
    const response = await axios.post(
      'https://api.monnify.com/api/v1/merchant/transactions/init-transaction',
      {
        amount: amount,
        customerName: customerName || 'Customer',
        customerEmail: customerEmail,
        customerPhoneNumber: customerPhone,
        paymentDescription: paymentDescription,
        currencyCode: 'NGN',
        contractCode: credentials.contractCode,
        redirectUrl: `${process.env.MOBILE_APP_URL || process.env.ADMIN_APP_URL || 'http://localhost:3000'}/payment/callback`,
        paymentReference: transactionReference,
        metadata: {
          orderData: JSON.stringify({
            items,
            deliveryAddress,
            customerName,
            customerPhone,
            notes,
            userId: req.user?.id || null
          })
        }
      },
      {
        headers: {
          Authorization: generateMonnifyAuth(credentials.apiKey, credentials.secretKey),
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.requestSuccessful && response.data.responseBody) {
      res.json({
        success: true,
        message: 'Payment initialized',
        data: {
          checkoutUrl: response.data.responseBody.checkoutUrl,
          transactionReference: response.data.responseBody.transactionReference,
          paymentReference: transactionReference
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.responseMessage || 'Failed to initialize payment'
      });
    }
  } catch (error) {
    console.error('Initialize payment error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.responseMessage || 'Error initializing payment'
    });
  }
};

// Create order from payment metadata
const createOrderFromPayment = async (prisma, io, orderData, paymentReference, totalAmount) => {
  try {
    // Check if delivery is open
    const settings = await prisma.settings.findFirst();
    if (settings && settings.isDeliveryOpen === false) {
      throw new Error('Delivery is currently closed');
    }

    // Calculate total amount and validate items
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of orderData.items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });

      if (!menuItem) {
        throw new Error(`Menu item with id ${item.menuItemId} not found`);
      }

      if (!menuItem.available) {
        throw new Error(`${menuItem.name} is currently unavailable`);
      }

      const itemTotal = menuItem.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Verify total amount matches
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      throw new Error('Amount mismatch');
    }

    // Create order with payment reference
    const order = await prisma.order.create({
      data: {
        userId: orderData.userId || null,
        totalAmount: calculatedTotal,
        deliveryAddress: orderData.deliveryAddress,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        notes: orderData.notes || null,
        paymentStatus: 'PAID',
        paymentReference: paymentReference,
        status: 'CONFIRMED',
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    // Emit new order event to admin
    io.to('admin').emit('order:new', order);
    io.to('admin').emit('order:paid', order);

    // Emit payment success event to user
    if (order.userId) {
      io.to(`user:${order.userId}`).emit('payment:success', {
        orderId: order.id,
        reference: paymentReference
      });
    }

    return order;
  } catch (error) {
    console.error('Create order from payment error:', error);
    throw error;
  }
};

// Verify Monnify payment and create order
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');

    // Get Monnify credentials
    const credentials = await getMonnifyCredentials(prisma);

    // Verify payment with Monnify
    const response = await axios.get(
      `https://api.monnify.com/api/v2/transactions/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: generateMonnifyAuth(credentials.apiKey, credentials.secretKey)
        }
      }
    );

    if (response.data.requestSuccessful && response.data.responseBody) {
      const transaction = response.data.responseBody;
      
      if (transaction.paymentStatus === 'PAID') {
        // Check if order already exists
        let order = await prisma.order.findFirst({
          where: { paymentReference: reference },
          include: {
            items: {
              include: {
                menuItem: true
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        });

        // If order doesn't exist, create it from payment metadata
        if (!order && transaction.metadata && transaction.metadata.orderData) {
          try {
            const orderData = JSON.parse(transaction.metadata.orderData);
            order = await createOrderFromPayment(
              prisma,
              io,
              orderData,
              reference,
              parseFloat(transaction.amountPaid)
            );
          } catch (error) {
            console.error('Error creating order from payment:', error);
            return res.status(500).json({
              success: false,
              message: 'Payment verified but failed to create order: ' + error.message
            });
          }
        } else if (order && order.paymentStatus !== 'PAID') {
          // Update existing order payment status
          order = await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'PAID',
              status: 'CONFIRMED'
            },
            include: {
              items: {
                include: {
                  menuItem: true
                }
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          });

          // Emit payment success event
          if (order.userId) {
            io.to(`user:${order.userId}`).emit('payment:success', {
              orderId: order.id,
              reference
            });
          }

          io.to('admin').emit('order:paid', order);
        }

        res.json({
          success: true,
          message: 'Payment verified successfully',
          data: {
            order,
            transaction
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: `Payment status: ${transaction.paymentStatus}`
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: response.data.responseMessage || 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.responseMessage || 'Error verifying payment'
    });
  }
};

// Monnify webhook handler
const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');

    // Verify webhook signature
    const credentials = await getMonnifyCredentials(prisma);
    const computedHash = crypto
      .createHmac('sha512', credentials.secretKey)
      .update(JSON.stringify(event))
      .digest('hex');
    
    const providedHash = req.headers['monnify-signature'];
    
    if (computedHash !== providedHash) {
      console.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    // Handle successful payment
    if (event.eventType === 'SUCCESSFUL_TRANSACTION') {
      const transactionReference = event.eventData.transactionReference;
      const paymentReference = event.eventData.paymentReference || transactionReference;
      const amountPaid = parseFloat(event.eventData.amountPaid);

      // Check if order already exists
      let order = await prisma.order.findFirst({
        where: { paymentReference: paymentReference },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });

      // If order doesn't exist, create it from payment metadata
      if (!order && event.eventData.metadata && event.eventData.metadata.orderData) {
        try {
          const orderData = JSON.parse(event.eventData.metadata.orderData);
          order = await createOrderFromPayment(
            prisma,
            io,
            orderData,
            paymentReference,
            amountPaid
          );
        } catch (error) {
          console.error('Error creating order from webhook:', error);
          // Still return OK to prevent webhook retries
          return res.status(200).send('OK');
        }
      } else if (order && order.paymentStatus !== 'PAID') {
        // Update existing order
        order = await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED'
          },
          include: {
            items: {
              include: {
                menuItem: true
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        });

        // Emit events
        if (order.userId) {
          io.to(`user:${order.userId}`).emit('payment:success', {
            orderId: order.id,
            reference: paymentReference
          });
        }

        io.to('admin').emit('order:paid', order);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook
};

















