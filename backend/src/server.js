require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./routes/auth.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const settingsRoutes = require('./routes/settings.routes');
const deliveryLocationRoutes = require('./routes/deliveryLocation.routes');

// Initialize Express app
const app = express();
const server = http.createServer(app);
// Configure CORS origins for Socket.io
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      process.env.MOBILE_APP_URL,
      process.env.ADMIN_APP_URL
    ].filter(Boolean) // Remove undefined values
  : [
      process.env.MOBILE_APP_URL || 'http://localhost:8081',
      process.env.ADMIN_APP_URL || 'http://localhost:3000',
      'http://192.168.0.112:3001',
      'http://192.168.0.112:3000',
      'http://192.168.41.12:3001',
      'http://192.168.41.12:5000',
      'http://localhost:3001'
    ];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  }
});

// Initialize Prisma Client with better timeout for Nigerian networks
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Handle Prisma connection errors gracefully with retry
async function connectDatabase() {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      break;
    } catch (error) {
      retries++;
      console.error(`❌ Database connection attempt ${retries}/${maxRetries} failed:`, error.message);
      
      if (retries < maxRetries) {
        const delay = 2000 * retries; // 2s, 4s, 6s
        console.log(`🔄 Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('💡 Tips: Check your DATABASE_URL and network connection (Airtel, MTN, Glo, etc.)');
        console.error('💡 Make sure you\'re using the correct connection string with ?sslmode=require');
      }
    }
  }
}

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io and prisma available to routes
app.set('io', io);
app.set('prisma', prisma);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/delivery-locations', deliveryLocationRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'OK', 
      message: 'Dabira Foods API is running',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'API is running but database connection failed',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join admin room
  socket.on('join:admin', () => {
    socket.join('admin');
    console.log('Admin joined:', socket.id);
  });

  // Join user-specific room
  socket.on('join:user', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined:`, socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server after database connection
const PORT = process.env.PORT || 5000;
connectDatabase().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Mobile app: ${process.env.MOBILE_APP_URL || 'http://localhost:8081'}`);
    console.log(`💼 Admin app: ${process.env.ADMIN_APP_URL || 'http://localhost:3000'}`);
    console.log(`🌐 Network: http://192.168.1.176:${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to start server due to database connection error:', error);
  console.error('💡 Please check your DATABASE_URL and ensure the database is accessible');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { app, io, prisma };

