const { validationResult } = require('express-validator');

// Get all menu items
const getMenuItems = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { available, category } = req.query;

    const where = {};
    if (available !== undefined) {
      where.available = available === 'true';
    }
    if (category) {
      where.category = category;
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { menuItems }
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single menu item
const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = req.app.get('prisma');

    const menuItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: { menuItem }
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item'
    });
  }
};

// Create menu item (Admin only)
const createMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, price, category, image, available } = req.body;
    const prisma = req.app.get('prisma');

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        category,
        image: image || null,
        available: available !== undefined ? available : true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: { menuItem }
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating menu item'
    });
  }
};

// Update menu item (Admin only)
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, available } = req.body;
    const prisma = req.app.get('prisma');

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        price: price ? parseFloat(price) : undefined,
        category: category || undefined,
        image: image !== undefined ? image : undefined,
        available: available !== undefined ? available : undefined
      }
    });

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: { menuItem }
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu item'
    });
  }
};

// Delete menu item (Admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = req.app.get('prisma');

    await prisma.menuItem.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item'
    });
  }
};

// Get menu categories
const getCategories = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');

    // Get all unique categories (both available and unavailable) for admin panel
    const categories = await prisma.menuItem.findMany({
      select: { category: true },
      distinct: ['category']
    });

    const categoryList = categories.map(item => item.category);

    res.json({
      success: true,
      data: { categories: categoryList }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};

// Update category name (updates all menu items with old category to new category)
const updateCategory = async (req, res) => {
  try {
    const { oldCategory, newCategory } = req.body;
    const prisma = req.app.get('prisma');

    if (!oldCategory || !newCategory) {
      return res.status(400).json({
        success: false,
        message: 'Old category and new category are required'
      });
    }

    if (oldCategory === newCategory) {
      return res.status(400).json({
        success: false,
        message: 'Old and new category names cannot be the same'
      });
    }

    // Update all menu items with the old category to the new category
    const result = await prisma.menuItem.updateMany({
      where: { category: oldCategory },
      data: { category: newCategory }
    });

    res.json({
      success: true,
      message: `Category updated successfully. ${result.count} menu item(s) updated.`,
      data: { count: result.count }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category'
    });
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  updateCategory
};




