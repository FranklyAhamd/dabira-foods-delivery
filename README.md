# Dabira Foods - Food Delivery System

A complete full-stack food delivery system for Dabira Foods restaurant.

## Project Structure

```
dabira-foods-delivery/
├── backend/          # Node.js + Express API
├── mobile/           # React Native customer app
├── admin/            # React admin dashboard
└── common/           # Shared configuration
```

## Tech Stack

- **Backend**: Node.js, Express, Prisma, Neon PostgreSQL, Socket.io, JWT
- **Mobile**: React Native, Styled Components, React Navigation
- **Admin**: React, Styled Components, React Router
- **Payment**: Monnify integration

## 🚀 Super Quick Start (3 Steps!)

### Step 1: Install Everything
**Double-click** `install.bat` and wait (5-10 minutes)

### Step 2: Start All Apps  
**Double-click** `START_APPS.bat` (opens 3 windows)

### Step 3: Create Admin User
**Double-click** `create_admin.bat` after backend starts

**That's it!** 🎉

### Access Your Apps
- 💼 **Admin Dashboard**: http://localhost:3000 (login: admin@dabirafoods.com / admin123)
- 📱 **Mobile App**: Follow instructions in the mobile window
- 🔧 **API**: http://localhost:5000

---

## 📖 Manual Installation (Alternative)

If you prefer command line:

```bash
# Install all
cd backend && npm install && npm run prisma:generate && npm run prisma:push && cd ..
cd mobile && npm install --legacy-peer-deps && cd ..
cd admin && npm install && cd ..

# Start all (3 separate terminals)
npm run backend
npm run mobile  
npm run admin
```

## Features

### Customer Mobile App
- Browse restaurant menu
- Add items to cart
- Pay online via Monnify
- Track order status in real-time
- View order history
- Manage profile

### Admin Dashboard
- View sales and order statistics
- Manage menu items
- Update order status
- Configure restaurant settings
- Real-time order notifications

### Backend API
- JWT authentication
- RESTful APIs for menu and orders
- Monnify payment verification
- Real-time updates via Socket.io
- Secure data storage with PostgreSQL

## Documentation

For detailed setup instructions, see the README files in each directory:
- [Backend Setup](./backend/README.md)
- [Mobile App Setup](./mobile/README.md)
- [Admin Dashboard Setup](./admin/README.md)

## License

MIT

