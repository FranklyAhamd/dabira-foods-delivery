# ⚡ Quick Start: Deploy Backend in 5 Minutes

## 🎯 Use Railway (NOT Vercel)

**Why?** Your backend uses Socket.io - Vercel doesn't support it!

---

## 🚂 Railway Deployment Steps

### 1. Go to Railway
👉 **[railway.app](https://railway.app)**

### 2. Sign Up (GitHub)
- Click **"Start a New Project"**
- **"Deploy from GitHub repo"**
- Authorize with GitHub

### 3. Select Repository
- Find `dabira-foods`
- Click **"Deploy"**

### 4. Configure Root Directory
- Click project → **"Settings"**
- **Root Directory:** `backend`
- **Save**

### 5. Add PostgreSQL Database
- Click **"+ New"**
- **"Database"** → **"Add PostgreSQL"**
- ✅ Database created! `DATABASE_URL` is auto-set!

### 6. Add Environment Variables
Go to **"Variables"** tab, add:

```
NODE_ENV=production
JWT_SECRET=change-this-to-random-32-chars-minimum
ADMIN_APP_URL=https://your-admin.vercel.app
MOBILE_APP_URL=https://your-mobile.vercel.app
PAYSTACK_SECRET_KEY=sk_live_your_key_here
PAYSTACK_PUBLIC_KEY=pk_live_your_key_here
PORT=5000
```

### 7. Deploy!
Railway automatically:
- ✅ Installs packages
- ✅ Generates Prisma client
- ✅ Starts server

### 8. Get Your URL
Railway shows: `https://your-app.up.railway.app`

---

## ✅ Test It

Visit: `https://your-app.up.railway.app/api/health`

Should see: `{"status":"OK","message":"Dabira Foods API is running"}`

---

## 🔄 Auto-Deploy

Push to GitHub = Auto deploy to Railway! 🎉

```bash
git push origin main
```

---

## 📝 That's It!

**Backend URL:** `https://your-app.up.railway.app/api`

Update your frontend apps (Vercel) with this URL in `REACT_APP_API_URL`!

---

**Questions?** See `DEPLOY_BACKEND_NOW.md` for detailed guide.

