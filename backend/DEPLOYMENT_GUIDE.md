# 🚀 Backend Deployment Guide

## ⚠️ Important: Vercel vs Railway

### Why NOT Vercel for this backend:
- ❌ **Socket.io won't work** - Vercel uses serverless functions (no persistent connections)
- ❌ **Complex refactoring needed** - Would need to convert entire Express app to serverless functions
- ❌ **Prisma + PostgreSQL** - Better suited for traditional server platforms
- ❌ **Real-time features** - Socket.io requires persistent WebSocket connections

### Why Railway is Better:
- ✅ **Full Node.js server** - Runs your Express app as-is
- ✅ **Socket.io works perfectly** - Supports persistent connections
- ✅ **Easy PostgreSQL setup** - Built-in database addon
- ✅ **Auto-deployments** - Just push to GitHub
- ✅ **Free tier available**

---

## 🚂 Recommended: Deploy to Railway (Best Choice)

### Step 1: Sign up for Railway
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with GitHub (easiest!)

### Step 2: Deploy from GitHub
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your `dabira-foods` repository
3. Railway will auto-detect it's a Node.js app

### Step 3: Configure Project
1. Railway will show your project
2. Click on it → **"Settings"**
3. Set **Root Directory** to: `backend`
4. Click **"Save"**

### Step 4: Add PostgreSQL Database
1. Click **"+ New"** in your project
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a database automatically
4. Copy the connection string (it's already set as `DATABASE_URL`)

### Step 5: Add Environment Variables
Go to **"Variables"** tab and add:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-32-chars-minimum
ADMIN_APP_URL=https://your-admin.vercel.app
MOBILE_APP_URL=https://your-mobile.vercel.app
PAYSTACK_SECRET_KEY=sk_live_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_public_key
PORT=5000
```

**Note:** `DATABASE_URL` is automatically set by Railway when you add PostgreSQL.

### Step 6: Run Database Migrations
1. Go to **"Deployments"** tab
2. Click on the deployment → **"View Logs"**
3. Wait for first deployment to complete
4. Railway will auto-run `npm start` which uses `server.js`

### Step 7: Get Your Backend URL
After deployment:
- Railway gives you a URL like: `https://your-backend.up.railway.app`
- Your API will be at: `https://your-backend.up.railway.app/api`

---

## 🆕 Alternative: Deploy to Render (Similar to Railway)

### Step 1: Sign up
Go to [render.com](https://render.com) → Sign up with GitHub

### Step 2: Deploy
1. **"New"** → **"Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name:** `dabira-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run prisma:generate`
   - **Start Command:** `npm start`
   - **Environment:** Node

### Step 3: Add Database
1. **"New"** → **"PostgreSQL"**
2. Copy connection string to environment variables as `DATABASE_URL`

### Step 4: Environment Variables
Add the same variables as Railway

---

## ⚡ If You Still Want Vercel (With Limitations)

⚠️ **Warning:** Socket.io real-time features **WON'T WORK** on Vercel!

If you proceed, I'll need to create a serverless adapter. See `vercel-serverless.md` for instructions.

---

## ✅ After Deployment

### Test Your Backend:
1. Health check: `https://your-backend.up.railway.app/api/health`
2. Should return: `{"status":"OK","message":"Dabira Foods API is running"}`

### Update Frontend Apps:
In Vercel (for admin & mobile), update:
- `REACT_APP_API_URL` = `https://your-backend.up.railway.app/api`

### Update Backend CORS:
In Railway environment variables:
- `ADMIN_APP_URL` = Your Vercel admin URL
- `MOBILE_APP_URL` = Your Vercel mobile URL

---

## 🔄 Automatic Deployments

Both Railway and Render automatically deploy when you push to GitHub!

Just:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

Deployment happens automatically! 🎉

---

## 📊 Comparison

| Feature | Railway | Render | Vercel |
|---------|---------|--------|--------|
| Socket.io Support | ✅ Yes | ✅ Yes | ❌ No |
| Full Express App | ✅ Yes | ✅ Yes | ⚠️ Needs refactoring |
| PostgreSQL Database | ✅ Built-in | ✅ Built-in | ❌ External needed |
| Auto Deployments | ✅ Yes | ✅ Yes | ✅ Yes |
| Free Tier | ✅ Yes | ✅ Yes | ✅ Yes |
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

**Recommendation: Use Railway!** 🚂

---

For detailed Railway setup, see the `railway.json` file in the backend folder.

