const { validationResult } = require('express-validator');

// Get all delivery locations (public - for customers to select)
const getDeliveryLocations = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    if (!prisma) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not available'
      });
    }

    const locations = await prisma.deliveryLocation.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: { locations }
    });
  } catch (error) {
    console.error('Get delivery locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery locations'
    });
  }
};

// Get all delivery locations (admin - includes inactive)
const getAllDeliveryLocations = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    if (!prisma) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not available'
      });
    }

    const locations = await prisma.deliveryLocation.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { locations }
    });
  } catch (error) {
    console.error('Get all delivery locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery locations'
    });
  }
};

// Get single delivery location
const getDeliveryLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = req.app.get('prisma');

    const location = await prisma.deliveryLocation.findUnique({
      where: { id }
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Delivery location not found'
      });
    }

    res.json({
      success: true,
      data: { location }
    });
  } catch (error) {
    console.error('Get delivery location error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery location'
    });
  }
};

// Create delivery location (Admin only)
const createDeliveryLocation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, price, isActive } = req.body;
    const prisma = req.app.get('prisma');

    const location = await prisma.deliveryLocation.create({
      data: {
        name: name.trim(),
        price: parseFloat(price),
        isActive: isActive !== undefined ? Boolean(isActive) : true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Delivery location created successfully',
      data: { location }
    });
  } catch (error) {
    console.error('Create delivery location error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'A location with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating delivery location'
    });
  }
};

// Update delivery location (Admin only)
const updateDeliveryLocation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, price, isActive } = req.body;
    const prisma = req.app.get('prisma');

    const existingLocation = await prisma.deliveryLocation.findUnique({
      where: { id }
    });

    if (!existingLocation) {
      return res.status(404).json({
        success: false,
        message: 'Delivery location not found'
      });
    }

    const updateData = {};
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (price !== undefined) {
      updateData.price = parseFloat(price);
    }
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const location = await prisma.deliveryLocation.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Delivery location updated successfully',
      data: { location }
    });
  } catch (error) {
    console.error('Update delivery location error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'A location with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating delivery location'
    });
  }
};

// Delete delivery location (Admin only)
const deleteDeliveryLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = req.app.get('prisma');

    const location = await prisma.deliveryLocation.findUnique({
      where: { id },
      include: {
        orders: {
          take: 1
        }
      }
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Delivery location not found'
      });
    }

    // Check if location has orders
    if (location.orders.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete location that has associated orders. Deactivate it instead.'
      });
    }

    await prisma.deliveryLocation.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Delivery location deleted successfully'
    });
  } catch (error) {
    console.error('Delete delivery location error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery location'
    });
  }
};

module.exports = {
  getDeliveryLocations,
  getAllDeliveryLocations,
  getDeliveryLocation,
  createDeliveryLocation,
  updateDeliveryLocation,
  deleteDeliveryLocation
};

