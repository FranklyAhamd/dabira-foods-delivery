# Dabira Foods - Quick Reference Card

## 🚀 Start Commands

```bash
# Start all (in separate terminals)
npm run backend    # Backend API
npm run mobile     # Mobile App
npm run admin      # Admin Dashboard

# Or start individually
cd backend && npm run dev
cd mobile && npm start
cd admin && npm start
```

## 📦 Installation

```bash
# Install all dependencies at once
npm run install-all

# Or install individually
cd backend && npm install
cd mobile && npm install
cd admin && npm install
```

## 🗄️ Database Commands

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Push schema to database (development)
npm run prisma:push

# Create migration (production)
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## 👤 Create Admin User

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

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your-secret-key"
PAYSTACK_SECRET_KEY="sk_test_..."
PAYSTACK_PUBLIC_KEY="pk_test_..."
PORT=5000
```

### Mobile (src/config/api.js)
```javascript
// Local development
const API_URL = 'http://localhost:5000/api';

// Physical device testing
const API_URL = 'http://YOUR_IP:5000/api';
```

## 🧪 Paystack Test Cards

**Card Number**: 4084 0840 8408 4081
**CVV**: Any 3 digits
**Expiry**: Any future date
**PIN**: 0000
**OTP**: 123456

## 📱 Mobile App Commands

```bash
cd mobile

# Start Expo dev server
npm start

# Run on Android
npm run android
# or press 'a' in terminal

# Run on iOS
npm run ios
# or press 'i' in terminal

# Clear cache
expo start -c
```

## 🌐 Access Points

- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health
- **Mobile App**: http://localhost:8081
- **Admin Dashboard**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555

## 📡 API Endpoints Quick List

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Menu
```
GET    /api/menu
GET    /api/menu/:id
POST   /api/menu              (admin)
PUT    /api/menu/:id          (admin)
DELETE /api/menu/:id          (admin)
```

### Orders
```
POST   /api/orders
GET    /api/orders/my-orders
GET    /api/orders/all        (admin)
GET    /api/orders/:id
PATCH  /api/orders/:id/status (admin)
GET    /api/orders/stats      (admin)
```

### Payment
```
POST   /api/payment/initialize
GET    /api/payment/verify/:reference
POST   /api/payment/webhook
```

### Settings
```
GET    /api/settings
PUT    /api/settings          (admin)
```

## 🔍 Debugging

### Backend Logs
```bash
cd backend
npm run dev
# Watch terminal for logs
```

### Mobile Logs
```bash
# React Native logs
npx react-native log-android
npx react-native log-ios

# Expo logs
# Press 'j' in Expo terminal
```

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

## 🛠️ Common Issues

### "Cannot connect to backend"
```javascript
// Mobile: Update API_URL in src/config/api.js
const API_URL = 'http://YOUR_COMPUTER_IP:5000/api';

// Find your IP:
// Windows: ipconfig
// Mac/Linux: ifconfig
```

### "Database connection failed"
```bash
# Check .env DATABASE_URL
# Must end with ?sslmode=require for Neon
```

### "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# For mobile
cd mobile
expo start -c
```

## 📂 Key Files

### Backend
- `backend/src/server.js` - Main server
- `backend/prisma/schema.prisma` - Database schema
- `backend/.env` - Environment variables

### Mobile
- `mobile/App.js` - Root component
- `mobile/src/navigation/AppNavigator.js` - Navigation
- `mobile/src/context/AuthContext.js` - Authentication
- `mobile/src/context/CartContext.js` - Shopping cart

### Admin
- `admin/src/App.js` - Root component
- `admin/src/components/Layout/Layout.jsx` - Main layout
- `admin/src/context/AuthContext.js` - Authentication

## 🎨 Styling Pattern

```
Component.jsx (Main component)
ComponentStyles.jsx (Styled components)
```

Example:
```javascript
// Home.jsx
import { Container, Title } from './HomeStyles';

// HomeStyles.jsx
export const Container = styled.View`...`;
export const Title = styled.Text`...`;
```

## 🔄 Order Status Flow

1. PENDING - Order placed
2. CONFIRMED - Payment verified
3. IN_PROGRESS - Being prepared
4. OUT_FOR_DELIVERY - Out for delivery
5. DELIVERED - Completed
6. CANCELLED - Cancelled

## 👥 User Roles

- **CUSTOMER** - Mobile app users
- **ADMIN** - Full admin access
- **MANAGER** - Same as admin

## 🎯 Testing Workflow

1. Start backend
2. Create admin user (curl command)
3. Start admin dashboard
4. Login and add menu items
5. Start mobile app
6. Register customer
7. Browse and order
8. Test payment
9. Update order status in admin
10. Check real-time updates

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Complete setup
- `PROJECT_SUMMARY.md` - What's built
- `QUICK_REFERENCE.md` - This file
- `backend/README.md` - Backend docs
- `mobile/README.md` - Mobile docs
- `admin/README.md` - Admin docs

## 💻 Development Tools

- **VS Code** - Recommended editor
- **Postman** - API testing
- **Prisma Studio** - Database GUI
- **React DevTools** - Browser extension
- **React Native Debugger** - Mobile debugging

## 🚢 Production Checklist

- [ ] Use production DATABASE_URL
- [ ] Set strong JWT_SECRET
- [ ] Use Paystack live keys
- [ ] Update CORS origins
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Run database migrations
- [ ] Build mobile apps
- [ ] Build admin dashboard
- [ ] Test all features

## 📞 Quick Support

Issue with:
- **Backend**: Check `backend/README.md`
- **Mobile**: Check `mobile/README.md`
- **Admin**: Check `admin/README.md`
- **Setup**: Check `SETUP_GUIDE.md`

---

**Keep this file handy for quick reference! 📌**

