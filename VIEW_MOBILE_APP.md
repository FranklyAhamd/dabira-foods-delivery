# 📱 How to View Your Mobile App

## 🎯 Quick Answer

**GitHub shows CODE, not a running app.**

To **SEE** your mobile app:
1. Deploy it to **Vercel** (recommended) or **Netlify**
2. You'll get a live URL like: `https://your-app.vercel.app`
3. Open that URL in any browser!

---

## ⚡ Fastest Way: Deploy to Vercel (5 minutes)

### Step 1: Go to Vercel
👉 [vercel.com](https://vercel.com)

### Step 2: Sign Up with GitHub
- Click **"Sign Up"**
- Choose **"Continue with GitHub"**
- Authorize Vercel

### Step 3: Deploy Mobile App
1. Click **"Add New Project"**
2. Find your `dabira-foods` repository
3. Click **"Import"**

### Step 4: Configure Settings
⚠️ **IMPORTANT:** Change these settings:

```
Framework Preset: React
Root Directory: mobile        ← CHANGE THIS!
Build Command: npm run build
Output Directory: build
```

### Step 5: Add Environment Variable
Click **"Environment Variables"** → Add:
- **Name:** `REACT_APP_API_URL`
- **Value:** `https://your-backend.railway.app/api`
  - (Or `http://localhost:5000/api` if testing locally)

### Step 6: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. ✅ You'll get a URL like: `https://dabira-foods-mobile.vercel.app`

---

## 🌐 Alternative: Netlify

### Step 1: Go to Netlify
👉 [netlify.com](https://netlify.com)

### Step 2: Deploy
1. **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub** → Select `dabira-foods`
3. Configure:
   - **Base directory:** `mobile`
   - **Build command:** `npm run build`
   - **Publish directory:** `mobile/build`
4. Add environment variable: `REACT_APP_API_URL`
5. Click **"Deploy site"**

---

## 🔗 What You'll Get

After deployment:
- ✅ **Live URL:** `https://your-mobile-app.vercel.app`
- ✅ Works on any device (phone, tablet, computer)
- ✅ Accessible from anywhere in the world
- ✅ Automatically updates when you push to GitHub

---

## 📲 Access on Mobile

Once deployed:
1. Open your phone's browser
2. Visit the Vercel URL
3. The app will work perfectly! 📱

**Tip:** You can even add it to your home screen as an app!

---

## 🎯 Summary

| What | Where | Purpose |
|------|-------|---------|
| **Source Code** | GitHub | Store code, version control |
| **Running App** | Vercel/Netlify | Live URL people can use |
| **Backend API** | Railway/Heroku | API server |

---

## ✅ Quick Checklist

- [ ] Code is on GitHub ✅ (You did this!)
- [ ] Sign up for Vercel
- [ ] Deploy mobile app with correct settings
- [ ] Get live URL
- [ ] Share with friends! 🎉

---

**Need help?** Check `DEPLOY_MOBILE.md` for detailed instructions!

