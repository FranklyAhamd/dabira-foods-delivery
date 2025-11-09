# 🚀 Dabira Foods - Quick Start Guide

## Option 1: Automated Installation (Easiest)

Just **double-click** on `install.bat` and wait. It will:
1. ✅ Install backend dependencies
2. ✅ Setup database with Prisma
3. ✅ Install mobile app
4. ✅ Install admin dashboard

Takes about 5-10 minutes depending on your internet speed.

---

## Option 2: Manual Installation

Open Command Prompt in this folder and run:

### Step 1: Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
cd ..
```

### Step 2: Mobile
```bash
cd mobile
npm install --legacy-peer-deps
cd ..
```

### Step 3: Admin
```bash
cd admin
npm install
cd ..
```

---

## After Installation

### Create Admin User

Run this command (or use Postman):
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"admin@dabirafoods.com\",\"password\":\"admin123\",\"name\":\"Admin User\",\"role\":\"ADMIN\"}"
```

### Start All Apps

**Option A: Automated (Easiest)**
- Double-click `START_APPS.bat`
- Opens 3 windows automatically

**Option B: Manual**
Open 3 separate command prompts:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Admin:**
```bash
cd admin
npm start
```

**Terminal 3 - Mobile:**
```bash
cd mobile
npm start
```

---

## 🌐 Access Points

- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000
- **API Health Check**: http://localhost:5000/api/health
- **Mobile**: Expo Dev Tools will open automatically

---

## 📱 Running Mobile App

After `npm start` in mobile folder:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with **Expo Go** app on your phone

### For Physical Device:
1. Install **Expo Go** from Play Store/App Store
2. Make sure phone and computer are on same WiFi
3. Scan the QR code shown in terminal
4. Or type the URL shown in terminal

---

## ✅ Verify Installation

1. **Backend Running**: Visit http://localhost:5000/api/health
   - Should show: `{"status":"OK","message":"Dabira Foods API is running"}`

2. **Admin Dashboard**: Visit http://localhost:3000
   - Should show login page for Dabira Foods

3. **Database**: Run in backend folder:
   ```bash
   npm run prisma:studio
   ```
   - Opens database viewer at http://localhost:5555

---

## 🔧 Troubleshooting

### "npm install" fails
**Solution**: Use `--legacy-peer-deps`
```bash
npm install --legacy-peer-deps
```

### Cannot connect to database
**Solution**: Check `backend/.env` file exists and has correct DATABASE_URL

### Mobile app can't reach backend
**Solution**: 
1. Find your IP address (ipconfig on Windows)
2. Edit `mobile/src/config/api.js`
3. Change `localhost` to your IP address:
```javascript
const API_URL = 'http://192.168.1.XXX:5000/api';
```

### Port already in use
**Solution**: Kill the process or change port in `.env` files

---

## 📊 What Each App Does

### Backend (Port 5000)
- Handles all API requests
- Manages database
- Processes payments
- Real-time updates via Socket.io

### Admin Dashboard (Port 3000)
- Manage menu items
- View and update orders
- See statistics
- Configure settings

### Mobile App
- Customer ordering
- Browse menu
- Make payments
- Track orders

---

## 🎯 First Time Setup Flow

1. ✅ Run `install.bat` (or manual installation)
2. ✅ Create admin user (curl command above)
3. ✅ Run `START_APPS.bat` (or start manually)
4. ✅ Login to admin dashboard at http://localhost:3000
5. ✅ Add menu items in admin dashboard
6. ✅ Open mobile app and register as customer
7. ✅ Test ordering process

---

## 📞 Need Help?

Check these files:
- `INSTALLATION_STEPS.md` - Detailed installation guide
- `SETUP_GUIDE.md` - Complete setup documentation
- `backend/README.md` - Backend documentation
- `mobile/README.md` - Mobile app documentation
- `admin/README.md` - Admin dashboard documentation

---

**Ready to start? Run `install.bat` now! 🚀**

















