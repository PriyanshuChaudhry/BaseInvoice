# 🚀 Complete Deployment Guide
## BaseInvoice - Invoice & Quotation Management System

### 📋 Deployment Stack
- **Frontend**: Vercel (React)
- **Backend**: Render (Node.js + Express)
- **Database**: MongoDB Atlas (already configured)
- **Storage**: MongoDB GridFS (already configured)

---

## 📦 Pre-Deployment Checklist

### ✅ What's Already Done
- [x] MongoDB GridFS implementation complete
- [x] All Cloudinary code removed
- [x] Environment variables configured locally
- [x] Responsive design for mobile
- [x] Toast notifications
- [x] Delete functionality with database cleanup
- [x] PDF streaming from GridFS
- [x] Error handling

### ⚠️ What You Need
- GitHub account
- Vercel account (free tier)
- Render account (free tier)
- MongoDB Atlas account (already have)

---

## 🎯 Step 1: Prepare for GitHub

### Create `.gitignore` files

**Backend `.gitignore`:**
```
node_modules/
.env
invoices/
*.log
.DS_Store
cleanup-invalid-pdfs.js
test-*.js
```

**Frontend `.gitignore`:**
```
node_modules/
build/
.env
.env.local
.DS_Store
```

### Update `package.json` scripts

**Backend `package.json`** - Add this to scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Frontend `package.json`** - Already correct

---

## 🐙 Step 2: Push to GitHub

### Initialize Git (if not already done)
```powershell
cd C:\Users\priya\Desktop\invoice
git init
git add .
git commit -m "Initial commit - BaseInvoice with GridFS"
```

### Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `baseinvoice`
3. Description: "Invoice & Quotation Management System with GridFS"
4. Keep it **Private** (recommended)
5. Don't initialize with README
6. Click "Create repository"

### Push to GitHub
```powershell
git remote add origin https://github.com/YOUR_USERNAME/baseinvoice.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 3: Deploy Backend on Render

### 3.1 Create Web Service
1. Go to https://render.com
2. Sign in / Sign up
3. Click "New +" → "Web Service"
4. Connect your GitHub account
5. Select `baseinvoice` repository
6. Configure:

### 3.2 Render Configuration

| Setting | Value |
|---------|-------|
| **Name** | `baseinvoice-backend` |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 3.3 Environment Variables on Render

Click "Advanced" → "Add Environment Variable"

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=production
```

**Get MongoDB URI from:**
1. Go to MongoDB Atlas
2. Database → Connect → Connect your application
3. Copy connection string
4. Replace `<password>` with your actual password

### 3.4 Deploy
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. Copy the URL (e.g., `https://baseinvoice-backend.onrender.com`)
4. **Save this URL** - you'll need it for frontend!

---

## 🌐 Step 4: Deploy Frontend on Vercel

### 4.1 Create Project
1. Go to https://vercel.com
2. Sign in / Sign up
3. Click "Add New..." → "Project"
4. Import your `baseinvoice` repository
5. Configure:

### 4.2 Vercel Configuration

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Create React App` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |

### 4.3 Environment Variables on Vercel

Click "Environment Variables" tab:

```env
REACT_APP_API_URL=https://baseinvoice-backend.onrender.com
```

**Use the Render URL from Step 3.4!**

### 4.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app will be live at `https://baseinvoice-xxx.vercel.app`

---

## 📱 Step 5: Mobile PWA Setup (Add to Home Screen)

### 5.1 Add to iPhone Home Screen
1. Open your Vercel URL in Safari
2. Tap Share button (square with arrow)
3. Scroll down → "Add to Home Screen"
4. Name it "BaseInvoice"
5. Tap "Add"

### 5.2 Add to Android Home Screen
1. Open your Vercel URL in Chrome
2. Tap ⋮ menu (three dots)
3. Tap "Add to Home screen"
4. Name it "BaseInvoice"
5. Tap "Add"

---

## 🧪 Step 6: Test Production Deployment

### Test Checklist
- [ ] Open frontend URL
- [ ] Create a quotation
- [ ] PDF opens in browser
- [ ] Go to Document List
- [ ] View PDF works
- [ ] Delete PDF works
- [ ] Table updates after delete
- [ ] Create proforma invoice
- [ ] Create final invoice
- [ ] Test on mobile browser
- [ ] Add to home screen works
- [ ] App works as PWA

---

## 🔧 Step 7: Update CORS After Deployment

Update backend `server.js` CORS:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-vercel-url.vercel.app'  // Add your Vercel URL
];
```

Then:
```powershell
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-redeploy!

---

## 🚨 Troubleshooting

### Issue: "Failed to load documents"
**Fix:** Check `REACT_APP_API_URL` in Vercel → Settings → Environment Variables

### Issue: "Network Error"
**Fix:** Check backend logs on Render → Logs tab

### Issue: "PDF not found"
**Fix:** Run cleanup script locally, old documents won't have PDFs

### Issue: Backend keeps spinning down (free tier)
**Note:** Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- This is normal on free tier

### Issue: MongoDB connection failed
**Fix:** 
1. MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` to IP whitelist (for Render)

---

## 📊 Free Tier Limits

### Vercel Free Tier
✅ 100GB bandwidth/month
✅ Unlimited projects
✅ Automatic HTTPS

### Render Free Tier
✅ 750 hours/month
⚠️ Spins down after 15 minutes inactivity
✅ Automatic HTTPS
✅ Auto-deploys from GitHub

### MongoDB Atlas Free Tier
✅ 512 MB storage
✅ Enough for ~5000 documents
✅ GridFS for PDF storage included

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push
1. Push code to GitHub:
```powershell
git add .
git commit -m "Your changes"
git push
```

2. **Render** auto-deploys backend (takes 2-3 min)
3. **Vercel** auto-deploys frontend (takes 1-2 min)

---

## 🎉 Success!

Your app is now:
- ✅ Live on the internet
- ✅ Accessible from any device
- ✅ Works as mobile PWA
- ✅ Auto-deploys on git push
- ✅ Using MongoDB GridFS for fast PDF storage
- ✅ Production-ready

---

**Deployment Date**: October 24, 2025  
**Version**: GridFS v1.0  
**Status**: Production Ready ✅
