# Dabira Foods - Complete Setup Guide

This guide will walk you through setting up the entire Dabira Foods food delivery system from scratch.

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Neon PostgreSQL account** (free tier available)
- **Monnify account** (for payment processing)
- **Expo CLI** (for mobile app development)

## Quick Start

```bash
# Install all dependencies
npm run install-all

# Start backend (Terminal 1)
npm run backend

# Start mobile app (Terminal 2)
npm run mobile

# Start admin dashboard (Terminal 3)
npm run admin
```

## Detailed Setup

### Step 1: Clone and Install

```bash
cd "Delivery App"
npm install
```

### Step 2: Backend Setup

#### 2.1 Your Neon PostgreSQL Database

Your Neon database is already set up with this connection string:
```
postgresql://neondb_owner:npg_HNgbsTdcGx53@ep-jolly-firefly-adyxju65-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

✅ Already configured in `backend/.env`

#### 2.2 Configure Backend Environment

The `backend/.env` file is already created with your Neon database:

```env
# Database - Your actual Neon PostgreSQL Connection
DATABASE_URL="postgresql://neondb_owner:npg_HNgbsTdcGx53@ep-jolly-firefly-adyxju65-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# JWT Secret
JWT_SECRET="dabira-foods-super-secret-jwt-key-2024"

# Monnify credentials are configured in Admin Settings
# Go to Admin Dashboard > Settings > Monnify Configuration
# Add your Monnify API Key, Secret Key, and Contract Code

# Server
PORT=5000
NODE_ENV=development

# Frontend URLs
MOBILE_APP_URL="http://localhost:8081"
ADMIN_APP_URL="http://localhost:3000"
```

#### 2.3 Setup Database

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

#### 2.4 Create Admin User

After the backend is running, create an admin user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dabirafoods.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

#### 2.5 Start Backend

```bash
npm run dev
```

Backend will be running at `http://localhost:5000`

### Step 3: Mobile App Setup

#### 3.1 Install Expo CLI

```bash
npm install -g expo-cli
```

#### 3.2 Configure Mobile App

Update `mobile/src/config/api.js`:

```javascript
// For testing on physical device, use your computer's IP
const API_URL = 'http://192.168.1.100:5000/api'; // Replace with your IP

// For emulator/simulator
const API_URL = 'http://localhost:5000/api';
```

To find your IP:
- **Windows**: `ipconfig`
- **Mac/Linux**: `ifconfig` or `ip addr`

#### 3.3 Install Dependencies and Start

```bash
cd mobile
npm install
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app for physical device

### Step 4: Admin Dashboard Setup

#### 4.1 Configure Admin App

Update `admin/src/config/api.js` if needed:

```javascript
const API_URL = 'http://localhost:5000/api';
```

#### 4.2 Install Dependencies and Start

```bash
cd admin
npm install
npm start
```

Admin dashboard will open at `http://localhost:3000`

Login with the admin credentials you created earlier.

## Testing the System

### 1. Admin Dashboard Testing

1. Login at `http://localhost:3000` with admin credentials
2. Add some menu items:
   - Click "Menu" → "Add New Item"
   - Fill in details (name, description, price, category)
   - Save

### 2. Mobile App Testing

1. Open mobile app
2. Register a new customer account
3. Browse menu items
4. Add items to cart
5. Proceed to checkout
6. Fill in delivery information

### 3. Payment Testing

Use Monnify test credentials (configured in Admin Settings):
- **Card Number**: 4084 0840 8408 4081
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **PIN**: 0000
- **OTP**: 123456

### 4. Order Management Testing

1. After payment, check admin dashboard
2. New order should appear in "Orders"
3. Update order status (Pending → Confirmed → In Progress → etc.)
4. Customer should see real-time status updates in mobile app

## Common Issues and Solutions

### Issue: Cannot connect to backend from mobile

**Solution**: Make sure you're using the correct IP address in `mobile/src/config/api.js`

```javascript
// Use your computer's IP, not localhost
const API_URL = 'http://192.168.1.100:5000/api';
```

### Issue: Database connection failed

**Solution**: 
- Check that `DATABASE_URL` in backend `.env` is correct
- Ensure `?sslmode=require` is at the end of the URL
- Verify your Neon database is active

### Issue: Monnify payment not working

**Solution**:
- Check that Monnify credentials are configured in Admin Settings
- Verify API Key, Secret Key, and Contract Code are correct
- Use test credentials (MK_TEST_ prefix) for development
- Make sure backend is running when initiating payment
- Check backend console for detailed error messages

### Issue: Socket.io not connecting

**Solution**:
- Check that backend server is running
- Verify CORS settings allow your frontend URLs
- Check browser/app console for connection errors

### Issue: Admin cannot login

**Solution**:
- Make sure user was created with role "ADMIN" or "MANAGER"
- Check that backend `/auth/login` endpoint is working
- Verify JWT_SECRET is set in backend `.env`

## Development Tips

### Using ngrok for Mobile Testing

If you can't access backend from mobile device:

```bash
# Install ngrok
npm install -g ngrok

# Expose backend
ngrok http 5000

# Use the ngrok URL in mobile app
const API_URL = 'https://abc123.ngrok.io/api';
```

### Hot Reload

- **Backend**: Uses nodemon, auto-restarts on file changes
- **Mobile**: Expo hot reloads automatically
- **Admin**: React hot reloads automatically

### Debugging

**Backend**:
```bash
# View logs
npm run dev
```

**Mobile**:
- Shake device for developer menu
- Press `j` in Expo terminal for debugger

**Admin**:
- Open browser DevTools (F12)
- Check Console and Network tabs

## Database Management

### View Database

```bash
cd backend
npm run prisma:studio
```

This opens Prisma Studio at `http://localhost:5555`

### Reset Database

```bash
cd backend
npm run prisma:push
```

### Create Migration (Production)

```bash
cd backend
npm run prisma:migrate
```

## Production Deployment

### Backend (Node.js)

Deploy to:
- **Heroku**
- **Railway**
- **DigitalOcean**
- **AWS EC2**

Don't forget to:
- Set production environment variables
- Use production database
- Switch to Monnify live credentials in Admin Settings
- Enable HTTPS

### Mobile App

Build for production:

```bash
cd mobile
expo build:android
expo build:ios
```

Or use EAS Build:
```bash
eas build --platform android
eas build --platform ios
```

Submit to:
- **Google Play Store** (Android)
- **Apple App Store** (iOS)

### Admin Dashboard

Deploy to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `build` folder
- **AWS S3 + CloudFront**

Build for production:
```bash
cd admin
npm run build
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single item
- `POST /api/menu` - Create item (admin)
- `PUT /api/menu/:id` - Update item (admin)
- `DELETE /api/menu/:id` - Delete item (admin)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - Get user orders (protected)
- `GET /api/orders/all` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order (protected)
- `PATCH /api/orders/:id/status` - Update status (admin)
- `GET /api/orders/stats` - Get statistics (admin)

### Payment
- `POST /api/payment/initialize` - Initialize payment (protected)
- `GET /api/payment/verify/:reference` - Verify payment (protected)
- `POST /api/payment/webhook` - Paystack webhook

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings (admin)

## Tech Stack Summary

### Backend
- Node.js + Express
- Prisma ORM
- Neon PostgreSQL
- JWT Authentication
- Paystack Integration
- Socket.io

### Mobile
- React Native (Expo)
- React Navigation
- Styled Components
- Context API
- Socket.io Client

### Admin
- React
- React Router
- Styled Components
- Context API
- Socket.io Client

## Support

For issues or questions:
1. Check this guide
2. Review individual README files in each directory
3. Check the API documentation
4. Review error logs

## Project Structure

```
smoky-bites-delivery/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth middleware
│   │   └── server.js     # Main server file
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
│
├── mobile/               # React Native app
│   ├── src/
│   │   ├── screens/      # App screens
│   │   ├── context/      # Context providers
│   │   ├── navigation/   # Navigation setup
│   │   └── config/       # Configuration
│   ├── App.js
│   └── package.json
│
├── admin/                # React admin dashboard
│   ├── src/
│   │   ├── pages/        # Dashboard pages
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Context providers
│   │   └── config/       # Configuration
│   └── package.json
│
└── package.json          # Root package.json
```

## Next Steps

1. **Customize the UI**: Update colors, fonts, and styling to match your brand
2. **Add Features**: 
   - Customer reviews and ratings
   - Push notifications
   - Loyalty program
   - Multiple restaurants
3. **Enhance Security**: 
   - Add rate limiting
   - Implement 2FA
   - Add input sanitization
4. **Improve Performance**:
   - Add caching
   - Optimize images
   - Implement lazy loading
5. **Analytics**: 
   - Add Google Analytics
   - Track user behavior
   - Monitor performance

## License

MIT

---

**Happy Coding! 🍔🚀**

