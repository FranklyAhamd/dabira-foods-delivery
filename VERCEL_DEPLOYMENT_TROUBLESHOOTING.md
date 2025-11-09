# 🔧 Vercel Deployment Troubleshooting

## ⚠️ Issue: Updates Not Showing After 15 Minutes

Your code is pushed to `master` branch, but Vercel might be watching a different branch or the deployment might have failed.

---

## 🔍 Step 1: Check Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Log in to your account
3. Find your project (admin or mobile app)
4. Click on it to see the **Deployments** tab

### What to Look For:
- ✅ **Latest deployment status** - Is it "Ready" or "Error"?
- ✅ **Which branch** is being deployed (should show `master` or `main`)
- ✅ **Last deployment time** - Does it match your recent push?

---

## 🎯 Step 2: Fix Branch Mismatch (Most Common Issue)

### Option A: Update Vercel to Watch `master` Branch

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Git**
3. Find **Production Branch** setting
4. Change it from `main` to `master`
5. Click **Save**
6. Vercel will automatically trigger a new deployment

### Option B: Rename Your Branch to `main` (If Vercel Requires It)

```bash
# Rename master to main
git branch -m master main

# Push the renamed branch
git push origin main

# Set upstream
git push -u origin main

# Delete old master branch on remote (optional)
git push origin --delete master
```

**Note:** After renaming, update Vercel to watch `main` branch.

---

## 🚀 Step 3: Manually Trigger Redeploy

If the branch is correct but deployment didn't trigger:

1. In Vercel dashboard, go to **Deployments** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Select **"Redeploy"**
5. Wait 2-3 minutes for deployment to complete

---

## 🔍 Step 4: Check Build Logs

If deployment is failing:

1. In Vercel dashboard, click on the failed deployment
2. Click **"View Build Logs"**
3. Look for error messages

### Common Build Errors:

**Error: "Cannot find module"**
- Solution: Make sure all dependencies are in `package.json`

**Error: "Build command failed"**
- Solution: Check if `npm run build` works locally
- Run: `cd mobile && npm run build` (or `cd admin && npm run build`)

**Error: "Root directory not found"**
- Solution: In Vercel settings, verify:
  - **Root Directory:** `mobile` (for mobile app) or `admin` (for admin app)

---

## ✅ Step 5: Verify Configuration

### For Mobile App:
- **Root Directory:** `mobile`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### For Admin App:
- **Root Directory:** `admin`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### Environment Variables:
Make sure `REACT_APP_API_URL` is set correctly in Vercel:
- Go to **Settings** → **Environment Variables**
- Verify `REACT_APP_API_URL` = `https://your-backend.railway.app/api`

---

## 🔄 Step 6: Force New Deployment

If nothing works, create an empty commit to trigger deployment:

```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin master
```

This will force Vercel to detect a new commit and start a deployment.

---

## 📊 Quick Checklist

- [ ] Checked Vercel dashboard for deployment status
- [ ] Verified branch name matches Vercel configuration (`master` vs `main`)
- [ ] Checked build logs for errors
- [ ] Verified root directory is set correctly (`mobile` or `admin`)
- [ ] Confirmed environment variables are set
- [ ] Tried manual redeploy
- [ ] Checked if build works locally (`npm run build`)

---

## 🆘 Still Not Working?

1. **Clear Vercel cache:**
   - Settings → General → Clear Build Cache
   - Then redeploy

2. **Check GitHub connection:**
   - Settings → Git
   - Verify repository is connected correctly

3. **Contact Vercel support:**
   - If deployment keeps failing, check Vercel status page
   - Or contact support through Vercel dashboard

---

## ⏱️ Expected Deployment Time

- **Build time:** 2-5 minutes
- **Deploy time:** 30 seconds - 1 minute
- **Total:** 3-6 minutes

If it's been 15+ minutes, something is likely wrong and needs investigation.

