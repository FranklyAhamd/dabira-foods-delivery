const express = require('express');
const { body } = require('express-validator');
const {
  getDeliveryLocations,
  getAllDeliveryLocations,
  getDeliveryLocation,
  createDeliveryLocation,
  updateDeliveryLocation,
  deleteDeliveryLocation
} = require('../controllers/deliveryLocation.controller');
const { verifyToken, verifyAdmin, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const createLocationValidation = [
  body('name').trim().notEmpty().withMessage('Location name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a valid number >= 0')
];

const updateLocationValidation = [
  body('name').optional().trim().notEmpty().withMessage('Location name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a valid number >= 0')
];

// Routes
// Public route - for customers to fetch active locations
router.get('/public', optionalAuth, getDeliveryLocations);

// Admin routes
router.get('/', verifyToken, verifyAdmin, getAllDeliveryLocations);
router.get('/:id', verifyToken, verifyAdmin, getDeliveryLocation);
router.post('/', verifyToken, verifyAdmin, createLocationValidation, createDeliveryLocation);
router.put('/:id', verifyToken, verifyAdmin, updateLocationValidation, updateDeliveryLocation);
router.delete('/:id', verifyToken, verifyAdmin, deleteDeliveryLocation);

module.exports = router;

