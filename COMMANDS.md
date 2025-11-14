# Dabira Foods - Terminal Commands

## Step 1: Install Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
cd ..
```

## Step 2: Install Mobile App
```bash
cd mobile
npm install --legacy-peer-deps
cd ..
```

## Step 3: Install Admin Dashboard
```bash
cd admin
npm install
cd ..
```

## Step 4: Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Keep this terminal open. Wait for: `Server running on port 5000`

## Step 5: Start Admin Dashboard (Terminal 2 - New Window)
```bash
cd admin
npm start
```
Keep this terminal open. Opens at: http://localhost:3000

## Step 6: Start Mobile App (Terminal 3 - New Window)
```bash
cd mobile
npm start
```
Keep this terminal open. Then press `a` for Android or `i` for iOS

## Step 7: Create Admin User (Terminal 4 - After Backend is Running)
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"admin@dabirafoods.com\",\"password\":\"admin123\",\"name\":\"Admin User\",\"role\":\"ADMIN\"}"
```

## Login Credentials
- **Email**: admin@dabirafoods.com
- **Password**: admin123
- **URL**: http://localhost:3000

## Quick Commands

### View Database
```bash
cd backend
npm run prisma:studio
```
Opens at: http://localhost:5555

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

### Restart Mobile Cache
```bash
cd mobile
expo start -c
```

## Troubleshooting

### If npm install fails:
```bash
npm install --legacy-peer-deps
```

### If port is in use:
```bash
# Find and kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Find and kill process on port 3000 (admin)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Database connection issues:
Check that `backend/.env` exists with your Neon connection string


















