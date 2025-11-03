const express = require('express');
const { getSettings, updateSettings, setDeliveryOpen } = require('../controllers/settings.controller');
const { verifyToken, verifyAdmin, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Routes
router.get('/', optionalAuth, getSettings);
router.put('/', verifyToken, verifyAdmin, updateSettings);
router.post('/delivery', verifyToken, verifyAdmin, setDeliveryOpen);

module.exports = router;











