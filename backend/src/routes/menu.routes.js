const express = require('express');
const { body } = require('express-validator');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories
} = require('../controllers/menu.controller');
const { verifyToken, verifyAdmin, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const menuItemValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required')
];

// Routes
router.get('/', optionalAuth, getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', optionalAuth, getMenuItem);
router.post('/', verifyToken, verifyAdmin, menuItemValidation, createMenuItem);
router.put('/:id', verifyToken, verifyAdmin, updateMenuItem);
router.delete('/:id', verifyToken, verifyAdmin, deleteMenuItem);

module.exports = router;

















