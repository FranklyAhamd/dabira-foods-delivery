const express = require('express');
const { body } = require('express-validator');
const {
  initializePayment,
  verifyPayment,
  handleWebhook
} = require('../controllers/payment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const initializePaymentValidation = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number')
];

// Routes
router.post('/initialize', verifyToken, initializePaymentValidation, initializePayment);
router.get('/verify/:reference', verifyToken, verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;

















