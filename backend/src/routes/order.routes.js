const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/order.controller');
const { verifyToken, verifyAdmin, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.menuItemId').notEmpty().withMessage('Menu item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerPhone').notEmpty().withMessage('Customer phone is required')
];

// Routes
router.post('/', optionalAuth, createOrderValidation, createOrder); // Allow guest checkout
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/stats', verifyToken, verifyAdmin, getOrderStats);
router.get('/all', verifyToken, verifyAdmin, getAllOrders);
router.get('/:id', verifyToken, getOrder);
router.patch('/:id/status', verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;














