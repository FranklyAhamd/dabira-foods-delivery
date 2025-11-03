# 🎉 Deployment Successful! Next Steps

## ✅ Your Backend is LIVE!

Your Railway deployment shows:
- 🟢 **ACTIVE** status
- ✅ **Deployment successful**
- 🚀 Backend is running!

---

## 🧪 Step 1: Test Your Backend

### Get Your Backend URL

1. In Railway dashboard:
   - Click your service (`dabira-foods-delivery`)
   - Look for **"Settings"** tab
   - Scroll to **"Networking"** section
   - Find **"Generate Domain"** button
   - Click it to get your public URL

OR

2. Check the service:
   - Railway usually auto-generates a URL like:
   - `https://dabira-foods-delivery-production-xxxx.up.railway.app`

### Test Health Endpoint

Visit in browser or use curl:
```
https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Dabira Foods API is running"
}
```

---

## 📝 Step 2: Update Environment Variables

### In Railway (Backend):

Go to **Variables** tab and add/update:

```
NODE_ENV=production
JWT_SECRET=your-very-secure-random-string-32-chars-minimum
ADMIN_APP_URL=https://your-admin.vercel.app
MOBILE_APP_URL=https://your-mobile.vercel.app
PAYSTACK_SECRET_KEY=sk_live_your_key
PAYSTACK_PUBLIC_KEY=pk_live_your_key
PORT=8080
```

**Note:** Railway sets `PORT` automatically (usually 8080), so you can omit it.

---

## 🌐 Step 3: Deploy Frontend Apps

### Deploy Admin Dashboard to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. **Add New Project**
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** `admin`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Environment Variable:**
     - `REACT_APP_API_URL` = `https://your-railway-url.up.railway.app/api`
5. **Deploy**

### Deploy Mobile App to Vercel:

1. In Vercel, click **Add New Project** again
2. Import same repository
3. Configure:
   - **Root Directory:** `mobile`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Environment Variable:**
     - `REACT_APP_API_URL` = `https://your-railway-url.up.railway.app/api`
4. **Deploy**

---

## 🔄 Step 4: Update Backend CORS

After deploying frontends, update Railway variables:

1. Go to Railway → Your service → **Variables**
2. Set:
   - `ADMIN_APP_URL` = Your Vercel admin URL
   - `MOBILE_APP_URL` = Your Vercel mobile URL
3. Railway will auto-redeploy with updated CORS

---

## ✅ Step 5: Run Database Migrations

Your Prisma schema needs to be synced with the database:

1. **Option A: Run migrations locally** (recommended first time):
   ```bash
   cd backend
   npm run prisma:migrate deploy
   ```
   (Make sure `DATABASE_URL` in your local `.env` matches Railway's)

2. **Option B: Railway CLI** (if you have it):
   ```bash
   railway run npm run prisma:migrate deploy
   ```

3. **Option C: Use Prisma Studio** to verify:
   - Local: `npm run prisma:studio`
   - Should connect to your Railway/Neon database

---

## 📊 Step 6: Create Admin User

After migrations, create your first admin user:

**Using curl or Postman:**
```bash
curl -X POST https://your-railway-url.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dabirafoods.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

---

## 🎯 Your Live URLs Checklist

After completing all steps, you'll have:

- ✅ **Backend API:** `https://your-backend.up.railway.app`
- ✅ **Admin Dashboard:** `https://your-admin.vercel.app`
- ✅ **Mobile App:** `https://your-mobile.vercel.app`
- ✅ **Database:** Connected and working
- ✅ **Real-time Features:** Socket.io working

---

## 🚀 You're Done!

Your full-stack app is now live and accessible from anywhere in the world! 🌍

**Next:** Test everything end-to-end:
1. Register a user on mobile app
2. Place an order
3. View order in admin dashboard
4. Update order status
5. See real-time updates!

---

**Congratulations on deploying your app!** 🎉

