const express = require('express');
const { body } = require('express-validator');
const {
  initializePayment,
  verifyPayment,
  handleWebhook
} = require('../controllers/payment.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const initializePaymentValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').notEmpty().withMessage('Customer phone is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required')
];

// Routes
// Initialize payment - allows both authenticated users and guests
router.post('/initialize', optionalAuth, initializePaymentValidation, initializePayment);
// Verify payment can be accessed without auth (payment reference is in URL)
router.get('/verify/:reference', verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;

















