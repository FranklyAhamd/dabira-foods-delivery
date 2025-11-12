// Get settings
const getSettings = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    if (!prisma) {
      console.error('❌ Prisma client not available');
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection not available. Please restart the backend server.' 
      });
    }

    let settings = await prisma.settings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          restaurantName: 'Dabira Foods',
          restaurantAddress: '',
          restaurantPhone: '',
          restaurantEmail: '',
          deliveryFee: 0,
          minimumOrder: 0,
          isDeliveryOpen: true
        }
      });
    }

    // Hide sensitive keys from non-admin users
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'MANAGER') {
      delete settings.monnifySecretKey;
    }

    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('❌ Get settings error:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack
    });
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
};

// Update settings (Admin only)
const updateSettings = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    
    if (!prisma) {
      console.error('❌ Prisma client not available');
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection not available. Please restart the backend server.' 
      });
    }
    
    const {
      restaurantName,
      restaurantAddress,
      restaurantPhone,
      restaurantEmail,
      monnifyApiKey,
      monnifySecretKey,
      monnifyContractCode,
      deliveryFee,
      minimumOrder,
      openingTime,
      closingTime,
      closedMessage
    } = req.body;

    let settings = await prisma.settings.findFirst();

    // Helper function to safely parse float and avoid NaN
    const safeParseFloat = (value, defaultValue = 0) => {
      if (value === undefined || value === null || value === '') {
        return defaultValue;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    };

    if (!settings) {
      // Create new settings
      settings = await prisma.settings.create({
        data: {
          restaurantName: restaurantName || 'Dabira Foods',
          restaurantAddress: restaurantAddress || null,
          restaurantPhone: restaurantPhone || null,
          restaurantEmail: restaurantEmail || null,
          monnifyApiKey: monnifyApiKey || null,
          monnifySecretKey: monnifySecretKey || null,
          monnifyContractCode: monnifyContractCode || null,
          deliveryFee: safeParseFloat(deliveryFee, 0),
          minimumOrder: safeParseFloat(minimumOrder, 0),
          openingTime: openingTime || null,
          closingTime: closingTime || null
        }
      });
    } else {
      // Build update data object, only including fields that are provided
      const updateData = {};
      
      if (restaurantName !== undefined) updateData.restaurantName = restaurantName;
      if (restaurantAddress !== undefined) updateData.restaurantAddress = restaurantAddress || null;
      if (restaurantPhone !== undefined) updateData.restaurantPhone = restaurantPhone || null;
      if (restaurantEmail !== undefined) updateData.restaurantEmail = restaurantEmail || null;
      if (monnifyApiKey !== undefined) updateData.monnifyApiKey = monnifyApiKey || null;
      if (monnifySecretKey !== undefined) updateData.monnifySecretKey = monnifySecretKey || null;
      if (monnifyContractCode !== undefined) updateData.monnifyContractCode = monnifyContractCode || null;
      if (deliveryFee !== undefined) updateData.deliveryFee = safeParseFloat(deliveryFee, settings.deliveryFee);
      if (minimumOrder !== undefined) updateData.minimumOrder = safeParseFloat(minimumOrder, settings.minimumOrder);
      if (openingTime !== undefined) updateData.openingTime = openingTime || null;
      if (closingTime !== undefined) updateData.closingTime = closingTime || null;
      if (closedMessage !== undefined) updateData.closedMessage = closedMessage || null;

      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: updateData
      });
      
      // If closedMessage was updated, emit to all clients
      if (closedMessage !== undefined) {
        const io = req.app.get('io');
        if (io) {
          io.emit('delivery:statusChanged', {
            isDeliveryOpen: settings.isDeliveryOpen,
            closedMessage: settings.closedMessage
          });
          console.log('📢 Broadcasted closed message update to all clients');
        }
      }
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('❌ Update settings error:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack
    });
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
};

// Toggle delivery (Admin only)
const setDeliveryOpen = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    if (!prisma) {
      console.error('❌ Prisma client not available');
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection not available. Please restart the backend server.' 
      });
    }

    const { open, message } = req.body; // open can be boolean/string/number
    console.log('📦 Toggle delivery request:', { open, message, openType: typeof open });

    // Coerce to proper boolean
    const isOpen = open === true || open === 'true' || open === 1 || open === '1';
    console.log('✅ Processed isOpen:', isOpen);

    let settings = await prisma.settings.findFirst();
    console.log('📋 Current settings:', settings ? `Found settings ID: ${settings.id}` : 'No settings found');

    if (!settings) {
      console.log('🆕 Creating new settings...');
      settings = await prisma.settings.create({
        data: { 
          restaurantName: 'Dabira Foods', 
          isDeliveryOpen: isOpen,
          closedMessage: message || null
        }
      });
      console.log('✅ Created new settings');
    } else {
      console.log('🔄 Updating existing settings...');
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          isDeliveryOpen: isOpen,
          closedMessage: message !== undefined ? (message || null) : undefined
        }
      });
      console.log('✅ Updated settings');
    }

    console.log('✅ Delivery status updated successfully');
    
    // Emit delivery status update to all connected clients (mobile app)
    const io = req.app.get('io');
    if (io) {
      io.emit('delivery:statusChanged', {
        isDeliveryOpen: isOpen,
        closedMessage: settings.closedMessage
      });
      console.log('📢 Broadcasted delivery status change to all clients');
    }
    
    res.json({
      success: true,
      message: `Delivery is now ${isOpen ? 'open' : 'closed'}.`,
      data: { settings }
    });
  } catch (error) {
    console.error('❌ Set delivery open error:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack
    });
    res.status(500).json({ 
      success: false, 
      message: 'Error updating delivery status', 
      error: error?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  setDeliveryOpen
};

