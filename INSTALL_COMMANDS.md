# 🚀 CORRECT Installation Commands for Dabira Foods

## ⚠️ IMPORTANT: Install Each App Separately (No Workspaces)

The npm workspace was causing conflicts. Each app must be installed independently.

---

## 📦 INSTALLATION STEPS

### Step 1: Install Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
cd ..
```

✅ **Expected Result**: 
- Packages installed
- Prisma client generated
- Database tables created in Neon

---

### Step 2: Install Mobile App
```bash
cd mobile
npm install --legacy-peer-deps
cd ..
```

✅ **Expected Result**: 
- React Native and Expo packages installed
- No peer dependency errors

---

### Step 3: Install Admin Dashboard
```bash
cd admin
npm install
cd ..
```

✅ **Expected Result**: 
- React packages installed
- Build tools ready

---

## 🚀 RUNNING THE APPS

### Terminal 1 - Backend (Port 5000)
```bash
cd backend
npm run dev
```
✅ **Wait for**: `🚀 Server running on port 5000`

### Terminal 2 - Admin (Port 3000) 
```bash
cd admin
npm start
```
✅ **Opens**: http://localhost:3000 in browser

### Terminal 3 - Mobile (Expo)
```bash
cd mobile
npm start
```
✅ **Then press**:
- `a` for Android emulator
- `i` for iOS simulator
- Or scan QR code with Expo Go app

---

## 👤 CREATE ADMIN USER

**After backend is running**, in a new terminal:

```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"admin@dabirafoods.com\",\"password\":\"admin123\",\"name\":\"Admin User\",\"role\":\"ADMIN\"}"
```

**Or use Postman/Thunder Client:**
- URL: `http://localhost:5000/api/auth/register`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "email": "admin@dabirafoods.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "ADMIN"
}
```

### Login Credentials:
- **URL**: http://localhost:3000
- **Email**: admin@dabirafoods.com
- **Password**: admin123

---

## ✅ VERIFICATION

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"OK","message":"Dabira Foods API is running"}`

### View Database
```bash
cd backend
npm run prisma:studio
```
Opens at: http://localhost:5555

---

## 🔧 TROUBLESHOOTING

### If "prisma is not recognized":
The npm install failed. Try:
```bash
cd backend
rm -rf node_modules
npm install
```

### If peer dependency errors:
Use the `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### If port already in use:
```bash
# Find process on port 5000
netstat -ano | findstr :5000
# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

### Mobile can't connect to backend:
1. Find your IP: `ipconfig`
2. Edit `mobile/src/config/api.js`
3. Change `http://localhost:5000/api` to `http://YOUR_IP:5000/api`
4. Restart mobile app

---

## 📱 FOR PHYSICAL DEVICE

1. Install **Expo Go** app from Play Store/App Store
2. Make sure phone and computer are on **same WiFi**
3. In `mobile/src/config/api.js`, change:
```javascript
const API_URL = 'http://YOUR_COMPUTER_IP:5000/api'; // e.g., 192.168.1.5
```
4. Restart: `cd mobile && npm start`
5. Scan QR code with Expo Go app

---

## 🎯 QUICK TEST FLOW

1. ✅ Backend running (Terminal 1)
2. ✅ Create admin user (curl command)
3. ✅ Login to admin at http://localhost:3000
4. ✅ Add menu items (burgers, pizza, etc.)
5. ✅ Start mobile app (Terminal 3)
6. ✅ Register as customer in mobile
7. ✅ Browse menu and add to cart
8. ✅ Test checkout flow

---

## 📊 YOUR DATABASE

**Connection String** (already in `backend/.env`):
```
postgresql://neondb_owner:npg_HNgbsTdcGx53@ep-jolly-firefly-adyxju65-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**View Database Online**:
- Go to: https://console.neon.tech
- Login with your Neon account
- Select your project
- Click "Tables" to see data

---

## 🆘 STILL HAVING ISSUES?

1. **Delete all node_modules**:
```bash
cd backend && rm -rf node_modules && cd ..
cd mobile && rm -rf node_modules && cd ..
cd admin && rm -rf node_modules && cd ..
```

2. **Reinstall one by one**:
```bash
cd backend && npm install && cd ..
cd mobile && npm install --legacy-peer-deps && cd ..
cd admin && npm install && cd ..
```

3. **Check Node version**: Should be v16 or higher
```bash
node --version
```

4. **Clear npm cache**:
```bash
npm cache clean --force
```

---

**Ready to try again? Start with `cd backend && npm install` 🚀**














