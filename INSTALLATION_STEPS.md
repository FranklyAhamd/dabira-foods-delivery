# Dabira Foods - Installation Steps

## ✅ Your Database is Ready!

Your Neon PostgreSQL database connection:
```
postgresql://neondb_owner:npg_HNgbsTdcGx53@ep-jolly-firefly-adyxju65-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 🚀 Quick Installation

Follow these steps in order:

### Step 1: Install Backend

```bash
cd backend
npm install
```

### Step 2: Setup Database

```bash
# Still in backend directory
npm run prisma:generate
npm run prisma:push
```

This will:
- Generate Prisma Client
- Create all tables in your Neon database

### Step 3: Install Mobile App

```bash
cd ../mobile
npm install --legacy-peer-deps
```

**Note**: We use `--legacy-peer-deps` to resolve React version conflicts.

### Step 4: Install Admin Dashboard

```bash
cd ../admin
npm install
```

### Step 5: Start Everything

Open **3 separate terminals**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Wait for: `🚀 Server running on port 5000`

**Terminal 2 - Admin Dashboard:**
```bash
cd admin
npm start
```
Opens at: `http://localhost:3000`

**Terminal 3 - Mobile App:**
```bash
cd mobile
npm start
```
Then press:
- `a` for Android
- `i` for iOS
- Or scan QR code with Expo Go app

## 🔑 Create Admin User

After backend is running, run this command:

```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"admin@dabirafoods.com\",\"password\":\"admin123\",\"name\":\"Admin User\",\"role\":\"ADMIN\"}"
```

Or use Postman/Thunder Client:
- **URL**: `http://localhost:5000/api/auth/register`
- **Method**: POST
- **Body** (JSON):
```json
{
  "email": "admin@dabirafoods.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "ADMIN"
}
```

## 🧪 Test the System

1. **Admin Dashboard** (`http://localhost:3000`)
   - Login with: `admin@dabirafoods.com` / `admin123`
   - Add some menu items

2. **Mobile App**
   - Register as a customer
   - Browse menu
   - Add to cart
   - Test checkout

## ⚠️ Troubleshooting

### "npm install" fails with peer dependency error
**Solution**: Use `--legacy-peer-deps` flag
```bash
npm install --legacy-peer-deps
```

### Cannot connect to database
**Solution**: Check that your .env file has the correct DATABASE_URL
```bash
cat backend/.env
```

### Mobile app can't reach backend
**Solution**: Update API URL in `mobile/src/config/api.js`
```javascript
// Use your computer's IP address (not localhost)
const API_URL = 'http://YOUR_IP:5000/api';
```

Find your IP:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

## 📱 For Physical Device Testing

1. Find your computer's IP address
2. Update `mobile/src/config/api.js`:
```javascript
const API_URL = 'http://192.168.1.XXX:5000/api'; // Your IP here
```
3. Make sure phone and computer are on same WiFi
4. Restart mobile app: `expo start -c`

## ✅ Success Indicators

- ✅ Backend: See "Server running on port 5000"
- ✅ Admin: Opens at `http://localhost:3000`
- ✅ Mobile: Shows Expo QR code or opens simulator
- ✅ Database: Run `npm run prisma:studio` to view data

## 🔥 Quick Commands

```bash
# Check backend health
curl http://localhost:5000/api/health

# View database
cd backend && npm run prisma:studio

# Clear mobile cache
cd mobile && expo start -c
```

---

**You're all set! 🎉**

















