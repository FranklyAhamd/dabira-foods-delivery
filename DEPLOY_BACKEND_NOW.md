# 🚀 Deploy Backend - Quick Guide

## ⚠️ Important Decision

Your backend uses **Socket.io** for real-time features (order updates, notifications).

### ❌ Vercel Problem:
- **Socket.io WON'T WORK** on Vercel
- Vercel uses serverless functions (no persistent connections)
- Real-time features will be broken

### ✅ Railway Solution:
- **Socket.io works perfectly**
- Designed for Node.js servers like yours
- Just as easy as Vercel
- FREE tier available

---

## 🎯 RECOMMENDED: Deploy to Railway (5 minutes)

### Step 1: Sign Up
1. Go to **[railway.app](https://railway.app)**
2. Click **"Start a New Project"**
3. **"Deploy from GitHub repo"**
4. Sign up with GitHub (one click!)

### Step 2: Select Your Repo
1. Find `dabira-foods` repository
2. Click **"Deploy"**

### Step 3: Configure
1. Railway will detect Node.js automatically
2. Click **"Settings"** in your project
3. Set **Root Directory:** `backend`
4. Click **"Save"**

### Step 4: Add Database
1. In your project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway creates database automatically
4. `DATABASE_URL` is set automatically! ✨

### Step 5: Environment Variables
Go to **"Variables"** tab, add:

```
NODE_ENV=production
JWT_SECRET=your-very-secure-random-string-min-32-chars
ADMIN_APP_URL=https://your-admin.vercel.app
MOBILE_APP_URL=https://your-mobile.vercel.app
PAYSTACK_SECRET_KEY=sk_live_your_key
PAYSTACK_PUBLIC_KEY=pk_live_your_key
PORT=5000
```

**Note:** `DATABASE_URL` is already set by Railway PostgreSQL addon!

### Step 6: Deploy!
Railway automatically:
1. Installs dependencies
2. Runs `npm start`
3. Deploys your app

### Step 7: Get Your URL
- Railway gives you: `https://your-backend.up.railway.app`
- Your API: `https://your-backend.up.railway.app/api`

✅ **That's it! Your backend is live!**

---

## 🔄 After Deployment

### 1. Test Backend
Visit: `https://your-backend.up.railway.app/api/health`

Should see: `{"status":"OK","message":"Dabira Foods API is running"}`

### 2. Update Frontend Apps (Vercel)
In Vercel dashboard, update environment variables:
- **Admin:** `REACT_APP_API_URL` = `https://your-backend.up.railway.app/api`
- **Mobile:** `REACT_APP_API_URL` = `https://your-backend.up.railway.app/api`

### 3. Update Backend CORS (Railway)
In Railway variables, set:
- `ADMIN_APP_URL` = Your Vercel admin URL
- `MOBILE_APP_URL` = Your Vercel mobile URL

Railway will auto-redeploy! 🚀

---

## ⚡ Automatic Deployments

Every time you push to GitHub:
```bash
git push origin main
```

Railway automatically redeploys! No manual steps needed! 🎉

---

## 📊 Why Railway > Vercel for Backend

| Feature | Railway ✅ | Vercel ❌ |
|---------|-----------|-----------|
| Socket.io | Works! | Doesn't work |
| Express Server | Full support | Needs refactoring |
| PostgreSQL | Built-in | External needed |
| Setup Time | 5 minutes | Hours of refactoring |
| Real-time Features | ✅ All work | ❌ Broken |

---

## 🆘 Need Help?

- **Backend logs:** Railway dashboard → Deployments → View Logs
- **Database:** Railway PostgreSQL includes free Prisma Studio access
- **Health check:** Always test `/api/health` endpoint first

---

## ✅ Recommended Setup

```
Frontend Apps → Vercel (perfect for React)
Backend API  → Railway (perfect for Node.js + Socket.io)
Database     → Railway PostgreSQL (free, automatic)
```

This is the **best combination** for your app! 🎯

---

**Ready?** Follow the Railway steps above and your backend will be live in 5 minutes! 🚂

