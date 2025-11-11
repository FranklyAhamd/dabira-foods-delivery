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

    const { name, description, price, category, image, available, maxPortionsPerTakeaway } = req.body;
    const prisma = req.app.get('prisma');

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        category,
        image: image || null,
        available: available !== undefined ? available : true,
        maxPortionsPerTakeaway: maxPortionsPerTakeaway ? parseInt(maxPortionsPerTakeaway) : null
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
    const { name, description, price, category, image, available, maxPortionsPerTakeaway } = req.body;
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');

    // Get the old menu item to check if availability changed
    const oldMenuItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    const updateData = {
      name: name || undefined,
      description: description !== undefined ? description : undefined,
      price: price ? parseFloat(price) : undefined,
      category: category || undefined,
      image: image !== undefined ? image : undefined,
      available: available !== undefined ? available : undefined
    };

    // Handle maxPortionsPerTakeaway - can be null to clear it
    if (maxPortionsPerTakeaway !== undefined) {
      updateData.maxPortionsPerTakeaway = maxPortionsPerTakeaway ? parseInt(maxPortionsPerTakeaway) : null;
    }

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData
    });

    // Emit socket event if availability changed
    if (io && oldMenuItem && available !== undefined && oldMenuItem.available !== menuItem.available) {
      io.emit('menu:availabilityChanged', {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        available: menuItem.available
      });
      console.log(`📢 Menu availability changed: ${menuItem.name} is now ${menuItem.available ? 'available' : 'unavailable'}`);
    }

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

    // Get all categories from Category model
    const categoryModels = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    // Also get unique categories from menu items (for backward compatibility)
    const menuItemCategories = await prisma.menuItem.findMany({
      select: { category: true },
      distinct: ['category']
    });

    const menuItemCategoryNames = menuItemCategories.map(item => item.category);

    // Merge: use Category model if exists, otherwise use menu item category as string
    const categoryMap = new Map();
    
    // Add categories from Category model
    categoryModels.forEach(cat => {
      categoryMap.set(cat.name, {
        name: cat.name,
        isTakeaway: cat.isTakeaway
      });
    });

    // Add categories from menu items that don't exist in Category model
    menuItemCategoryNames.forEach(catName => {
      if (!categoryMap.has(catName)) {
        categoryMap.set(catName, {
          name: catName,
          isTakeaway: false
        });
      }
    });

    const categoryList = Array.from(categoryMap.values());

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
    const { oldCategory, newCategory, isTakeaway } = req.body;
    const prisma = req.app.get('prisma');

    if (!oldCategory || !newCategory) {
      return res.status(400).json({
        success: false,
        message: 'Old category and new category are required'
      });
    }

    if (oldCategory === newCategory) {
      // Just update isTakeaway flag if name is the same
      if (isTakeaway !== undefined) {
        await prisma.category.upsert({
          where: { name: oldCategory },
          update: { isTakeaway },
          create: { name: oldCategory, isTakeaway }
        });
        return res.json({
          success: true,
          message: 'Category updated successfully',
          data: { count: 0 }
        });
      }
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

    // Update or create Category model entry
    if (isTakeaway !== undefined) {
      // Delete old category entry if exists
      await prisma.category.deleteMany({
        where: { name: oldCategory }
      });
      // Create/update new category entry
      await prisma.category.upsert({
        where: { name: newCategory },
        update: { isTakeaway },
        create: { name: newCategory, isTakeaway }
      });
    } else {
      // Check if old category exists and copy its isTakeaway value
      const oldCat = await prisma.category.findUnique({
        where: { name: oldCategory }
      });
      if (oldCat) {
        await prisma.category.deleteMany({
          where: { name: oldCategory }
        });
        await prisma.category.upsert({
          where: { name: newCategory },
          update: { isTakeaway: oldCat.isTakeaway },
          create: { name: newCategory, isTakeaway: oldCat.isTakeaway }
        });
      }
    }

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

// Create or update category
const upsertCategory = async (req, res) => {
  try {
    const { name, isTakeaway } = req.body;
    const prisma = req.app.get('prisma');

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const category = await prisma.category.upsert({
      where: { name },
      update: { isTakeaway: isTakeaway !== undefined ? isTakeaway : false },
      create: { name, isTakeaway: isTakeaway !== undefined ? isTakeaway : false }
    });

    res.json({
      success: true,
      message: 'Category saved successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Upsert category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving category'
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const prisma = req.app.get('prisma');

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category is in use
    const itemsUsingCategory = await prisma.menuItem.count({
      where: { category: name }
    });

    if (itemsUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${itemsUsingCategory} menu item(s) are using this category.`
      });
    }

    await prisma.category.deleteMany({
      where: { name }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category'
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
  updateCategory,
  upsertCategory,
  deleteCategory
};




