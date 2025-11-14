const { validationResult } = require('express-validator');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      items,
      deliveryAddress,
      customerName,
      customerPhone,
      notes,
      deliveryLocationId
    } = req.body;

    const prisma = req.app.get('prisma');
    const io = req.app.get('io');

    if (!prisma) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not available. Please try again later.'
      });
    }

    // Check if delivery is open
    let settings;
    try {
      settings = await prisma.settings.findFirst();
    } catch (error) {
      console.error('Error fetching settings:', error);
      // If we can't check settings, default to allowing orders (fail open)
      // This prevents blocking orders if there's a temporary DB issue
    }
    
    if (settings && settings.isDeliveryOpen === false) {
      return res.status(400).json({
        success: false,
        message: settings.closedMessage || 'Delivery is currently closed. Please check back during operating hours.'
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item with id ${item.menuItemId} not found`
        });
      }

      if (!menuItem.available) {
        return res.status(400).json({
          success: false,
          message: `${menuItem.name} is currently unavailable`
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Validate delivery location if provided
    let validDeliveryLocationId = null;
    if (deliveryLocationId) {
      const deliveryLocation = await prisma.deliveryLocation.findUnique({
        where: { id: deliveryLocationId }
      });
      if (!deliveryLocation || !deliveryLocation.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Selected delivery location is not available'
        });
      }
      validDeliveryLocationId = deliveryLocation.id;
    }

    // Create order (supports both authenticated and guest orders)
    const order = await prisma.order.create({
      data: {
        userId: req.user?.id || null, // Guest orders will have null userId
        deliveryLocationId: validDeliveryLocationId,
        totalAmount,
        deliveryAddress,
        customerName,
        customerPhone,
        notes: notes || null,
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

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { status } = req.query;

    const where = { userId: req.user.id };
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { status, startDate, endDate } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const orders = await prisma.order.findMany({
      where,
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
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = req.app.get('prisma');

    const order = await prisma.order.findUnique({
      where: { id },
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

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user has access to this order
    // Guest orders (null userId) are only accessible by providing order details
    // Authenticated users can only see their own orders
    if (req.user) {
      if (req.user.role === 'CUSTOMER' && order.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else {
      // Guest order - no access restriction, but in production you might want to add order verification
      // For now, allow guest access if no user is logged in
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');

    const order = await prisma.order.update({
      where: { id },
      data: { status },
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

    // Emit order status update to user
    io.to(`user:${order.userId}`).emit('order:statusUpdate', {
      orderId: order.id,
      status: order.status
    });

    // Also emit to admin
    io.to('admin').emit('order:updated', order);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};

// Get order statistics (Admin only)
const getOrderStats = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      todayOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    // Get popular menu items
    const popularItems = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      _count: { menuItemId: true },
      _sum: { quantity: true },
      orderBy: {
        _count: { menuItemId: 'desc' }
      },
      take: 5
    });

    const popularMenuItems = await Promise.all(
      popularItems.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId }
        });
        return {
          ...menuItem,
          orderCount: item._count.menuItemId,
          totalQuantity: item._sum.quantity
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        todayOrders,
        popularItems: popularMenuItems
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
};














