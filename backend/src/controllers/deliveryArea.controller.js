const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

// Get all areas for a location (public - for customers)
exports.getAreasByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    const areas = await prisma.deliveryArea.findMany({
      where: {
        deliveryLocationId: locationId,
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      data: { areas }
    });
  } catch (error) {
    console.error('Error fetching areas:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery areas'
    });
  }
};

// Get all areas for a location (admin)
exports.getAreasByLocationAdmin = async (req, res) => {
  try {
    const { locationId } = req.params;

    const areas = await prisma.deliveryArea.findMany({
      where: {
        deliveryLocationId: locationId
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      data: { areas }
    });
  } catch (error) {
    console.error('Error fetching areas:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery areas'
    });
  }
};

// Get single area
exports.getArea = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await prisma.deliveryArea.findUnique({
      where: { id },
      include: {
        deliveryLocation: true
      }
    });

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Delivery area not found'
      });
    }

    res.json({
      success: true,
      data: { area }
    });
  } catch (error) {
    console.error('Error fetching area:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery area'
    });
  }
};

// Create area
exports.createArea = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, deliveryLocationId, isActive } = req.body;

    // Verify location exists
    const location = await prisma.deliveryLocation.findUnique({
      where: { id: deliveryLocationId }
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Delivery location not found'
      });
    }

    const area = await prisma.deliveryArea.create({
      data: {
        name: name.trim(),
        deliveryLocationId,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Delivery area created successfully',
      data: { area }
    });
  } catch (error) {
    console.error('Error creating area:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating delivery area'
    });
  }
};

// Update area
exports.updateArea = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, isActive } = req.body;

    const area = await prisma.deliveryArea.findUnique({
      where: { id }
    });

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Delivery area not found'
      });
    }

    const updatedArea = await prisma.deliveryArea.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({
      success: true,
      message: 'Delivery area updated successfully',
      data: { area: updatedArea }
    });
  } catch (error) {
    console.error('Error updating area:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating delivery area'
    });
  }
};

// Delete area
exports.deleteArea = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await prisma.deliveryArea.findUnique({
      where: { id }
    });

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Delivery area not found'
      });
    }

    await prisma.deliveryArea.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Delivery area deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting area:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery area'
    });
  }
};

