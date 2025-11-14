const express = require('express');
const { body } = require('express-validator');
const {
  getAreasByLocation,
  getAreasByLocationAdmin,
  getArea,
  createArea,
  updateArea,
  deleteArea
} = require('../controllers/deliveryArea.controller');
const { verifyToken, verifyAdmin, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const createAreaValidation = [
  body('name').trim().notEmpty().withMessage('Area name is required'),
  body('deliveryLocationId').notEmpty().withMessage('Delivery location ID is required')
];

const updateAreaValidation = [
  body('name').optional().trim().notEmpty().withMessage('Area name cannot be empty')
];

// Public route - get active areas for a location
router.get('/location/:locationId/public', optionalAuth, getAreasByLocation);

// Admin routes
router.get('/location/:locationId', verifyToken, verifyAdmin, getAreasByLocationAdmin);
router.get('/:id', verifyToken, verifyAdmin, getArea);
router.post('/', verifyToken, verifyAdmin, createAreaValidation, createArea);
router.put('/:id', verifyToken, verifyAdmin, updateAreaValidation, updateArea);
router.delete('/:id', verifyToken, verifyAdmin, deleteArea);

module.exports = router;

