# 📱 Deploy Mobile Frontend - Quick Guide

## ⚠️ Important: GitHub vs Live App

**GitHub = Code Storage** 📦
- GitHub shows your SOURCE CODE
- It's NOT a running application
- You can browse files, but not use the app

**Vercel/Netlify = Live App** 🌐
- These platforms HOST your app
- You get a live URL (like `https://your-app.vercel.app`)
- Anyone can use your app through this URL

---

## 🚀 Option 1: Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Sign up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest!)
4. Authorize Vercel to access your repositories

### Step 2: Deploy Mobile App
1. After signing up, click **"Add New Project"**
2. Find and select your `dabira-foods` repository
3. Click **"Import"**

### Step 3: Configure Mobile App
**Important settings:**
- **Framework Preset:** React
- **Root Directory:** `mobile` ⬅️ **Change this!**
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### Step 4: Add Environment Variable
Click **"Environment Variables"** and add:
- **Name:** `REACT_APP_API_URL`
- **Value:** `https://your-backend-url.railway.app/api`
  - (Replace with your actual backend URL if you've deployed it)
  - Or use: `http://localhost:5000/api` for local testing

### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Vercel will give you a URL like: `https://dabira-foods-mobile.vercel.app` 🎉

---

## 🌐 Option 2: Deploy to Netlify (Alternative)

### Step 1: Sign up for Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click **"Sign up"** → **"GitHub"**
3. Authorize Netlify

### Step 2: Deploy
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub** → Select your repository
3. Configure:
   - **Base directory:** `mobile`
   - **Build command:** `npm run build`
   - **Publish directory:** `mobile/build`
4. Add environment variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-url.railway.app/api`
5. Click **"Deploy site"**

---

## 📋 Quick Checklist

Before deploying:
- [ ] Your code is pushed to GitHub
- [ ] You have a GitHub account
- [ ] You've signed up for Vercel (or Netlify)
- [ ] You know your backend URL (or use localhost for testing)

After deploying:
- [ ] You get a live URL (e.g., `https://your-app.vercel.app`)
- [ ] You can open this URL in any browser
- [ ] The mobile app loads and connects to your backend

---

## 🔗 Your Live URLs

After deployment, you'll have:
- **Mobile App:** `https://your-mobile.vercel.app`
- **Admin Dashboard:** `https://your-admin.vercel.app` (deploy separately)
- **Backend API:** `https://your-backend.railway.app`

Share these URLs with anyone who wants to use your app! 🎉

---

## 🐛 Troubleshooting

**Problem:** App shows white screen
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Make sure backend is running and accessible

**Problem:** Can't connect to backend
- Update `REACT_APP_API_URL` in Vercel settings
- Make sure backend CORS allows your Vercel domain
- Check backend is deployed and running

**Problem:** Build fails
- Check Vercel deployment logs
- Make sure all dependencies are in `package.json`
- Verify `mobile/` folder structure is correct

---

## ✅ Done!

Once deployed, you'll have a **live URL** that anyone can visit to use your mobile app!

**Example:** `https://dabira-foods-mobile.vercel.app`

Bookmark it and share it! 🚀

