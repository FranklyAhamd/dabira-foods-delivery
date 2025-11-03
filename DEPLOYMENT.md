# 🚀 Deployment Guide - Dabira Foods

## 📦 Repository Structure Recommendation

**Use ONE monorepo** for this project. Here's why:
- ✅ Apps are tightly coupled (admin & mobile depend on backend API)
- ✅ Easier to manage versions and releases together
- ✅ Simpler CI/CD pipeline setup
- ✅ Better code sharing and consistency
- ✅ Single source of truth

**Separate repos only if:**
- Different teams manage each app independently
- You need completely independent deployment cycles
- You want to open-source one part but not others

---

## 🎯 Deployment Options

### Option 1: Full-Stack Deployment (Recommended)

#### Backend → Railway/Render/Heroku
- **Railway**: Easy setup, automatic deployments
- **Render**: Free tier available
- **Heroku**: Well-established, reliable

#### Admin Dashboard → Vercel/Netlify
- **Vercel**: Best for React apps, automatic deployments
- **Netlify**: Simple drag-and-drop or Git integration

#### Mobile App → Vercel/Netlify
- Deploy as Progressive Web App (PWA)
- Or build for mobile app stores

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
PORT=5000
NODE_ENV=production
ADMIN_APP_URL="https://your-admin-app.vercel.app"
MOBILE_APP_URL="https://your-mobile-app.vercel.app"
PAYSTACK_SECRET_KEY="sk_live_your_live_key"
PAYSTACK_PUBLIC_KEY="pk_live_your_live_key"
```

**Admin** (set in Vercel/Netlify):
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

**Mobile** (set in Vercel/Netlify):
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

### 2. Database Migration
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate deploy
```

### 3. Build Production Versions
```bash
# Admin
cd admin
npm run build

# Mobile
cd mobile
npm run build
```

---

## 🚂 Railway Deployment (Backend)

### Steps:
1. Sign up at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect `backend/` directory
5. Add environment variables in Railway dashboard
6. Railway will auto-deploy on every push

### Railway Configuration File
See `railway.json` in backend folder

### Environment Variables in Railway:
- `DATABASE_URL` (you can use Railway's PostgreSQL addon)
- `JWT_SECRET`
- `NODE_ENV=production`
- `ADMIN_APP_URL`
- `MOBILE_APP_URL`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`

---

## ⚡ Vercel Deployment (Admin & Mobile)

### Steps:
1. Sign up at [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. **For Admin:**
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variables: `REACT_APP_API_URL`
5. **For Mobile:**
   - Root Directory: `mobile`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variables: `REACT_APP_API_URL`

### Automatic Deployments
Vercel automatically deploys on every push to `main` branch.

---

## 🔄 Deployment Workflow

### First Time Setup:
```bash
# 1. Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit"

# 2. Create GitHub repository
# Go to github.com → New Repository → Create

# 3. Connect and push
git remote add origin https://github.com/YOUR_USERNAME/dabira-foods.git
git branch -M main
git push -u origin main
```

### After Deployment:
```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main

# Deployments happen automatically!
```

---

## 🌐 Production URLs Setup

After deployment, update these:

1. **Backend URL** (e.g., `https://dabira-backend.railway.app`)
2. **Admin URL** (e.g., `https://dabira-admin.vercel.app`)
3. **Mobile URL** (e.g., `https://dabira-mobile.vercel.app`)

Update environment variables:
- Backend: `ADMIN_APP_URL` and `MOBILE_APP_URL`
- Admin & Mobile: `REACT_APP_API_URL`

---

## 🔒 Security Checklist

- [ ] Use production database (not development)
- [ ] Use Paystack live keys (not test keys)
- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Enable HTTPS (all platforms do this automatically)
- [ ] Update CORS origins to production URLs
- [ ] Remove console.logs or use proper logging
- [ ] Set `NODE_ENV=production`

---

## 📱 Mobile App Store Deployment

To deploy to app stores:

```bash
cd mobile
npm install -g eas-cli
eas build:configure
eas build --platform android
eas build --platform ios
```

Then submit to:
- Google Play Store
- Apple App Store

---

## 🐛 Troubleshooting

### Backend won't start:
- Check environment variables are set
- Verify database connection string
- Check logs in Railway dashboard

### Admin/Mobile can't connect to API:
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend URL is accessible

### Database migration fails:
```bash
cd backend
npx prisma migrate reset  # Careful! This deletes data
npx prisma migrate deploy
```

---

## 📞 Support

For deployment issues, check:
- Railway logs: Dashboard → Deployments → View Logs
- Vercel logs: Dashboard → Deployments → View Logs
- Backend health: `https://your-backend-url/api/health`

---

**Ready to deploy?** Follow the steps above and your app will be live! 🎉

