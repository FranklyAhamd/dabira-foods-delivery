const axios = require('axios');

// Initialize Paystack payment
const initializePayment = async (req, res) => {
  try {
    const { orderId, email, amount } = req.body;
    const prisma = req.app.get('prisma');

    // Verify order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.userId !== req.user.id && req.user.role === 'CUSTOMER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Order already paid'
      });
    }

    // Initialize Paystack payment
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: Math.round(amount * 100), // Convert to kobo/cents
        metadata: {
          orderId,
          userId: req.user.id
        },
        callback_url: `${process.env.MOBILE_APP_URL}/payment/callback`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status) {
      res.json({
        success: true,
        message: 'Payment initialized',
        data: {
          authorizationUrl: response.data.data.authorization_url,
          accessCode: response.data.data.access_code,
          reference: response.data.data.reference
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to initialize payment'
      });
    }
  } catch (error) {
    console.error('Initialize payment error:', error.response?.data || error);
    res.status(500).json({
      success: false,
      message: 'Error initializing payment'
    });
  }
};

// Verify Paystack payment
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');

    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    if (response.data.status && response.data.data.status === 'success') {
      const { orderId } = response.data.data.metadata;

      // Update order payment status
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          paymentReference: reference,
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
      io.to(`user:${order.userId}`).emit('payment:success', {
        orderId: order.id,
        reference
      });

      io.to('admin').emit('order:paid', order);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          order,
          transaction: response.data.data
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error.response?.data || error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
};

// Paystack webhook handler
const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');

    // Verify webhook signature (optional but recommended)
    // const hash = crypto
    //   .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    //   .update(JSON.stringify(req.body))
    //   .digest('hex');
    
    // if (hash !== req.headers['x-paystack-signature']) {
    //   return res.status(400).send('Invalid signature');
    // }

    if (event.event === 'charge.success') {
      const { orderId } = event.data.metadata;
      const reference = event.data.reference;

      // Update order
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          paymentReference: reference,
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
      io.to(`user:${order.userId}`).emit('payment:success', {
        orderId: order.id,
        reference
      });

      io.to('admin').emit('order:paid', order);
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














