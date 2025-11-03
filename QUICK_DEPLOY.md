# ⚡ Quick Deployment Guide

## 📦 Repository Structure Answer

**✅ Use ONE repository (monorepo)** - All three apps (backend, admin, mobile) in the same repo.

**Why?**
- They're tightly coupled (admin & mobile both need the backend API)
- Easier to manage and deploy together
- Single source of truth for the entire project
- Better for CI/CD pipelines

---

## 🚀 Quick Start - Deploy to GitHub

### Step 1: Initialize Git Repository

**Windows:**
```cmd
init-git.bat
```

**Mac/Linux:**
```bash
chmod +x init-git.sh
./init-git.sh
```

**Or manually:**
```bash
git init
git add .
git commit -m "Initial commit - Dabira Foods Delivery App"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"** (or **"+"** → **"New repository"**)
3. Name it: `dabira-foods` (or any name you prefer)
4. **Don't** initialize with README (you already have one)
5. Click **"Create repository"**

### Step 3: Connect and Push

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/dabira-foods.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

## 🌐 Deploy to Production

### Backend → Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect the `backend/` folder
5. Add environment variables:
   - `DATABASE_URL` (from Neon)
   - `JWT_SECRET` (strong random string, 32+ chars)
   - `NODE_ENV=production`
   - `ADMIN_APP_URL` (will set after deploying admin)
   - `MOBILE_APP_URL` (will set after deploying mobile)
   - `PAYSTACK_SECRET_KEY` (your live key)
   - `PAYSTACK_PUBLIC_KEY` (your live key)
6. Railway auto-deploys on every push! 🎉

### Admin Dashboard → Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** `admin`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Environment Variable:** `REACT_APP_API_URL` = `https://your-backend.railway.app/api`
5. Click **"Deploy"**
6. Copy the deployment URL (e.g., `https://dabira-admin.vercel.app`)

### Mobile App → Vercel

1. In Vercel, click **"Add New Project"** again
2. Import the same GitHub repository
3. Configure:
   - **Root Directory:** `mobile`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Environment Variable:** `REACT_APP_API_URL` = `https://your-backend.railway.app/api`
4. Click **"Deploy"**
5. Copy the deployment URL (e.g., `https://dabira-mobile.vercel.app`)

### Update Backend CORS

Go back to Railway and update environment variables:
- `ADMIN_APP_URL` = your Vercel admin URL
- `MOBILE_APP_URL` = your Vercel mobile URL

Railway will automatically redeploy!

---

## ✅ After Deployment

1. **Backend Health Check:** `https://your-backend.railway.app/api/health`
2. **Admin Dashboard:** Your Vercel admin URL
3. **Mobile App:** Your Vercel mobile URL

**Test everything works:**
- Login to admin dashboard
- Browse menu in mobile app
- Place an order
- Check order in admin dashboard

---

## 📝 Environment Variables Checklist

### Backend (Railway):
- [ ] `DATABASE_URL`
- [ ] `JWT_SECRET`
- [ ] `NODE_ENV=production`
- [ ] `ADMIN_APP_URL`
- [ ] `MOBILE_APP_URL`
- [ ] `PAYSTACK_SECRET_KEY`
- [ ] `PAYSTACK_PUBLIC_KEY`

### Admin (Vercel):
- [ ] `REACT_APP_API_URL`

### Mobile (Vercel):
- [ ] `REACT_APP_API_URL`

---

## 🎉 That's It!

Your app is now live! Every time you push to GitHub:
- Railway automatically redeploys backend
- Vercel automatically redeploys admin & mobile

**No manual deployment needed!** 🚀

---

For detailed instructions, see `DEPLOYMENT.md`

