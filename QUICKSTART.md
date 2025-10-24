# 🚀 Quick Start Guide

## Prerequisites Check

✅ Node.js installed? Check with: `node --version`  
✅ npm installed? Check with: `npm --version`

## MongoDB Setup (IMPORTANT - Do This First!)

**Choose ONE option:**

### Option A: MongoDB Atlas (Cloud - Easier, No Installation)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account + cluster (takes 5 minutes)
3. Get connection string
4. Update `backend\.env` with your connection string

📖 **Detailed guide**: See `MONGODB_SETUP.md`

### Option B: Local MongoDB (On Your PC)
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start service: `net start MongoDB`
4. Keep default settings in `backend\.env`

📖 **Detailed guide**: See `MONGODB_SETUP.md`

⚠️ **Don't skip this!** The app won't work without MongoDB.

---

## Installation (5 minutes)

### Step 1: Install Backend Dependencies
```powershell
cd C:\Users\priya\Desktop\invoice\backend
npm install
```

### Step 2: Install Frontend Dependencies
```powershell
cd C:\Users\priya\Desktop\invoice\frontend
npm install
```

## Running the Application

### Terminal 1 - Start Backend
```powershell
cd C:\Users\priya\Desktop\invoice\backend
npm start
```
✅ Backend running at: http://localhost:5000

### Terminal 2 - Start Frontend
```powershell
cd C:\Users\priya\Desktop\invoice\frontend
npm start
```
✅ Frontend opens automatically at: http://localhost:3000

## Test the App

1. Open http://localhost:3000 in your browser
2. Fill in the form:
   - Company Details (pre-filled with TRUE POWER LIMITED)
   - Customer Details
   - Quotation Details
   - Add items with tax rates
3. Click "Generate PDF Invoice"
4. PDF downloads automatically!

## Troubleshooting

**MongoDB not running?**
```powershell
# Start MongoDB service
net start MongoDB
```

**Port already in use?**
- Backend: Change PORT in `backend\.env`
- Frontend: It will prompt you to use a different port

**Need help?** Check the main README.md for detailed documentation.

---

That's it! You're ready to generate professional invoices! 🎉
