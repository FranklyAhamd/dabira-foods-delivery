const axios = require('axios');
const crypto = require('crypto');

// Get Monnify credentials from settings
const getMonnifyCredentials = async (prisma) => {
  const settings = await prisma.settings.findFirst();
  if (!settings || !settings.monnifyApiKey || !settings.monnifySecretKey || !settings.monnifyContractCode) {
    throw new Error('Monnify credentials not configured. Please configure Monnify in settings.');
  }
  
  // Trim whitespace from credentials
  const apiKey = settings.monnifyApiKey.trim();
  const secretKey = settings.monnifySecretKey.trim();
  const contractCode = settings.monnifyContractCode.trim();
  
  return {
    apiKey,
    secretKey,
    contractCode
  };
};

// Get Monnify base URL based on API key (test vs production)
const getMonnifyBaseUrl = (apiKey) => {
  // Test credentials start with MK_TEST_, use sandbox
  // Production credentials start with MK_PROD_, use production API
  if (apiKey && apiKey.trim().startsWith('MK_TEST_')) {
    return 'https://sandbox.monnify.com';
  }
  return 'https://api.monnify.com';
};

// Get Monnify access token (OAuth 2.0)
const getMonnifyAccessToken = async (apiKey, secretKey) => {
  try {
    // Ensure no extra whitespace
    const cleanApiKey = apiKey.trim();
    const cleanSecretKey = secretKey.trim();
    
    // Determine base URL based on API key
    const baseUrl = getMonnifyBaseUrl(cleanApiKey);
    const authUrl = `${baseUrl}/api/v1/auth/login`;
    
    console.log('🔐 Authenticating with Monnify:', {
      environment: cleanApiKey.startsWith('MK_TEST_') ? 'SANDBOX (Test)' : 'PRODUCTION',
      baseUrl: baseUrl
    });
    
    // Get access token from Monnify
    const response = await axios.post(
      authUrl,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${cleanApiKey}:${cleanSecretKey}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.requestSuccessful && response.data.responseBody) {
      const accessToken = response.data.responseBody.accessToken;
      if (!accessToken) {
        throw new Error('Access token not received from Monnify');
      }
      console.log('✅ Monnify access token obtained successfully');
      return accessToken;
    } else {
      const errorMsg = response.data.responseMessage || 'Failed to get access token';
      console.error('❌ Monnify auth failed:', {
        responseCode: response.data.responseCode,
        responseMessage: errorMsg,
        fullResponse: response.data
      });
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('❌ Get Monnify access token error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.responseMessage || error.message || 'Failed to authenticate with Monnify');
  }
};

// Initialize Monnify payment
// Note: verifyToken middleware makes req.user optional for guests
const initializePayment = async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone, items, deliveryAddress, notes, deliveryLocationId } = req.body;
    const prisma = req.app.get('prisma');
    
    // Allow both authenticated users and guests (req.user may be undefined for guests)

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Get Monnify credentials
    let credentials;
    try {
      credentials = await getMonnifyCredentials(prisma);
    } catch (error) {
      console.error('Monnify credentials error:', error.message);
      return res.status(400).json({
        success: false,
        message: error.message || 'Monnify credentials not configured. Please configure Monnify in admin settings.'
      });
    }

    // Generate unique transaction reference
    const transactionReference = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Prepare payment description
    const paymentDescription = items && items.length > 0
      ? `Payment for ${items.length} item(s)`
      : 'Payment for order';

    // Build redirect URL - ensure it's a valid URL
    const appBaseUrl = process.env.MOBILE_APP_URL || process.env.ADMIN_APP_URL || 'http://localhost:3001';
    const redirectUrl = `${appBaseUrl.replace(/\/$/, '')}/payment/callback`;
    
    // Get Monnify access token
    console.log('🔐 Getting Monnify access token...');
    let accessToken;
    try {
      accessToken = await getMonnifyAccessToken(credentials.apiKey, credentials.secretKey);
    } catch (error) {
      console.error('❌ Failed to get Monnify access token:', error.message);
      // Use 502 Bad Gateway for Monnify API failures (not 401, which is for user auth)
      return res.status(502).json({
        success: false,
        message: error.message || 'Failed to authenticate with Monnify. Please check your credentials in Admin Settings.'
      });
    }
    
    console.log('💳 Initializing Monnify payment:', {
      amount,
      customerName,
      customerEmail,
      contractCode: credentials.contractCode,
      redirectUrl,
      hasAccessToken: !!accessToken
    });

    // Determine Monnify base URL
    const monnifyBaseUrl = getMonnifyBaseUrl(credentials.apiKey);
    const initTransactionUrl = `${monnifyBaseUrl}/api/v1/merchant/transactions/init-transaction`;
    
    console.log('💳 Using Monnify base URL:', monnifyBaseUrl);
    
    // Initialize Monnify transaction
    let response;
    try {
      response = await axios.post(
        initTransactionUrl,
        {
          amount: amount,
          customerName: customerName || 'Customer',
          customerEmail: customerEmail,
          customerPhoneNumber: customerPhone,
          paymentDescription: paymentDescription,
          currencyCode: 'NGN',
          contractCode: credentials.contractCode,
          redirectUrl: redirectUrl,
          paymentReference: transactionReference,
          metadata: {
            orderData: JSON.stringify({
              items,
              deliveryAddress,
              customerName,
              customerPhone,
              notes,
              userId: req.user?.id || null,
              deliveryLocationId: deliveryLocationId || null
            })
          }
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (monnifyError) {
      // Handle Monnify API errors specifically
      console.error('❌ Monnify API error:', {
        message: monnifyError.message,
        response: monnifyError.response?.data,
        status: monnifyError.response?.status
      });
      
      const errorMessage = monnifyError.response?.data?.responseMessage 
        || monnifyError.message 
        || 'Failed to initialize payment with Monnify';
      
      // Return 502 Bad Gateway for Monnify API failures
      return res.status(502).json({
        success: false,
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && {
          details: monnifyError.response?.data
        })
      });
    }

    if (response.data.requestSuccessful && response.data.responseBody) {
      console.log('✅ Payment initialized successfully:', {
        transactionReference: response.data.responseBody.transactionReference,
        checkoutUrl: response.data.responseBody.checkoutUrl ? 'URL received' : 'No URL'
      });
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
      console.error('❌ Monnify payment initialization failed:', {
        responseCode: response.data.responseCode,
        responseMessage: response.data.responseMessage,
        fullResponse: response.data
      });
      res.status(400).json({
        success: false,
        message: response.data.responseMessage || 'Failed to initialize payment'
      });
    }
  } catch (error) {
    console.error('Initialize payment error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    
    // Provide more detailed error message
    let errorMessage = 'Error initializing payment';
    let errorDetails = null;
    
    if (error.response?.data) {
      // Monnify API error response
      if (error.response.data.responseMessage) {
        errorMessage = error.response.data.responseMessage;
      }
      errorDetails = error.response.data;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Return error with details in development
    // Use 502 for external API errors, 500 for internal errors
    const statusCode = error.response?.status >= 400 && error.response?.status < 500 
      ? error.response.status 
      : 500;
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && {
        details: errorDetails,
        error: error.message,
        stack: error.stack
      })
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

    // Validate delivery location if provided
    let deliveryLocationId = null;
    if (orderData.deliveryLocationId) {
      const deliveryLocation = await prisma.deliveryLocation.findUnique({
        where: { id: orderData.deliveryLocationId }
      });
      if (!deliveryLocation || !deliveryLocation.isActive) {
        throw new Error('Selected delivery location is not available');
      }
      deliveryLocationId = deliveryLocation.id;
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

    // Verify total amount matches (allow small rounding differences)
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      throw new Error('Amount mismatch');
    }

    // Create order with payment reference
    const order = await prisma.order.create({
      data: {
        userId: orderData.userId || null,
        deliveryLocationId: deliveryLocationId,
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
    
    // Get Monnify access token
    const accessToken = await getMonnifyAccessToken(credentials.apiKey, credentials.secretKey);
    
    // Determine Monnify base URL
    const monnifyBaseUrl = getMonnifyBaseUrl(credentials.apiKey);
    const verifyUrl = `${monnifyBaseUrl}/api/v2/transactions/${encodeURIComponent(reference)}`;

    // Verify payment with Monnify
    const response = await axios.get(
      verifyUrl,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
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
      .createHmac('sha512', credentials.secretKey.trim())
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

















