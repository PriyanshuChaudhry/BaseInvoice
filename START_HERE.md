# 🚀 START HERE - Complete Setup Guide

Welcome! Follow these steps in order to get your Invoice Generator running.

---

## ⚡ Quick Overview

**What you need:**
1. MongoDB (database) - **Cloud or Local**
2. Backend server (Node.js/Express)
3. Frontend app (React)

**Time needed:** 15-20 minutes

---

## 📋 Step-by-Step Setup

### ✅ Step 1: Verify Prerequisites

Open PowerShell and check:

```powershell
# Check Node.js (should be v14+)
node --version

# Check npm
npm --version
```

**If not installed:** Download from https://nodejs.org/

---

### ✅ Step 2: Setup MongoDB (CHOOSE ONE OPTION)

#### 🌐 **Option A: MongoDB Atlas (Cloud - Recommended)**

**Why choose this?**
- ✅ No installation needed
- ✅ Free tier available
- ✅ Works from anywhere
- ✅ Perfect for beginners

**Steps:**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free M0 cluster (takes 5 min)
4. Create database user + password
5. Whitelist your IP (or use `0.0.0.0/0`)
6. Get connection string from "Connect" button
7. Update `backend\.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/invoice_generator?retryWrites=true&w=majority
```

📖 **Need detailed help?** See `MONGODB_SETUP.md`

---

#### 💻 **Option B: Local MongoDB**

**Why choose this?**
- ✅ Works offline
- ✅ Faster for development

**Steps:**
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start service:
   ```powershell
   net start MongoDB
   ```
4. Keep default in `backend\.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/invoice_generator
   ```

📖 **Need detailed help?** See `MONGODB_SETUP.md`

---

### ✅ Step 3: Install Dependencies

**Option A - Automatic (Recommended):**
```powershell
cd C:\Users\priya\Desktop\invoice
.\install.ps1
```

**Option B - Manual:**
```powershell
# Backend
cd C:\Users\priya\Desktop\invoice\backend
npm install

# Frontend (in new terminal)
cd C:\Users\priya\Desktop\invoice\frontend
npm install
```

⏱️ This takes 2-3 minutes.

---

### ✅ Step 4: Start Backend Server

**Open Terminal 1:**
```powershell
cd C:\Users\priya\Desktop\invoice\backend
npm start
```

**You should see:**
```
Server is running on port 5000
MongoDB Connected: [your-mongodb-host]
```

✅ **Success!** Backend is running.

❌ **Error?** Check:
- Is MongoDB running/connected?
- Is port 5000 free?
- Check `MONGODB_SETUP.md` for troubleshooting

---

### ✅ Step 5: Start Frontend App

**Open Terminal 2 (new window):**
```powershell
cd C:\Users\priya\Desktop\invoice\frontend
npm start
```

**You should see:**
```
Compiled successfully!
Local: http://localhost:3000
```

✅ **Success!** Browser opens automatically.

---

### ✅ Step 6: Test the Application

1. **Fill in Company Details:**
   - Company Name: TRUE POWER LIMITED
   - Address, Contact, Email

2. **Add Customer Details:**
   - Customer name, company, address, contact

3. **Set Quotation Details:**
   - Quotation Number: QT-2025-001
   - Date: Today's date

4. **Add Items:**
   - Click "+ Add Item" to add rows
   - Fill: Particulars, Quantity, Rate, Tax %
   - Watch Amount auto-calculate!

5. **Click "Generate PDF Invoice"**
   - Wait for "Success!" message
   - PDF downloads automatically! 🎉

📖 **Sample test data:** See `SAMPLE_DATA.md`

---

## ✅ Verification Checklist

- [ ] ✅ MongoDB connected (Atlas or Local)
- [ ] ✅ Backend running on port 5000
- [ ] ✅ Frontend running on port 3000
- [ ] ✅ Form displays in browser
- [ ] ✅ Can fill all fields
- [ ] ✅ Calculations work
- [ ] ✅ PDF generates and downloads

---

## 🎯 Access Points

| Service | URL | Status Check |
|---------|-----|--------------|
| Frontend | http://localhost:3000 | Open in browser |
| Backend API | http://localhost:5000 | Check terminal |
| MongoDB | (Your connection string) | Check terminal logs |

---

## 📚 Documentation Guide

**Just getting started?**
1. ✅ **START_HERE.md** (You are here!)
2. 📖 **MONGODB_SETUP.md** - Detailed MongoDB setup
3. 🚀 **QUICKSTART.md** - Quick reference

**Need more details?**
4. 📘 **README.md** - Complete documentation
5. 📊 **PROJECT_SUMMARY.md** - What's included
6. 🎨 **APPLICATION_GUIDE.md** - Visual walkthrough

**Testing & Verification:**
7. 📝 **SAMPLE_DATA.md** - Test data
8. ✅ **CHECKLIST.md** - Detailed verification

---

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:** 
- Atlas: Check connection string, IP whitelist, password
- Local: Run `net start MongoDB`
- See `MONGODB_SETUP.md` troubleshooting section

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID [PID] /F
```

### Issue: "Cannot find module"
**Solution:**
```powershell
# Reinstall dependencies
cd backend
npm install

cd ../frontend
npm install
```

### Issue: "PDF not downloading"
**Solution:**
- Check browser download settings
- Check browser console (F12) for errors
- Verify backend terminal shows no errors
- Check if `backend/invoices` folder exists

---

## 🎉 Success! What's Next?

Once everything works:

1. **Explore the Features:**
   - Add multiple items
   - Try different tax rates (CGST, SGST, IGST)
   - Generate multiple invoices

2. **Check Saved Data:**
   - **MongoDB Atlas:** View in Atlas dashboard
   - **Local MongoDB:** Use MongoDB Compass
   - **PDFs:** Check `backend/invoices` folder

3. **Customize (Optional):**
   - Change company name in form
   - Modify PDF layout in `backend/utils/pdfGenerator.js`
   - Adjust styling in `frontend/src/components/InvoiceForm.js`

---

## 📞 Need Help?

1. **Quick Questions:** Check the relevant `.md` file
2. **MongoDB Issues:** See `MONGODB_SETUP.md`
3. **General Setup:** See `README.md`
4. **Step-by-Step:** See `CHECKLIST.md`

---

## 🎓 Learning Path

**If you want to understand the code:**

1. **Backend:**
   - `backend/server.js` - Express server
   - `backend/models/Invoice.js` - Database schema
   - `backend/controllers/invoiceController.js` - Business logic
   - `backend/utils/pdfGenerator.js` - PDF creation

2. **Frontend:**
   - `frontend/src/App.js` - Main component
   - `frontend/src/components/InvoiceForm.js` - Form logic
   - `frontend/src/index.css` - Styling

---

## 🚀 Ready to Start?

**Your journey:**
1. ✅ **You're here** - Reading START_HERE.md
2. 🔄 **Next** - Setup MongoDB (Step 2)
3. 🔄 **Then** - Install dependencies (Step 3)
4. 🔄 **Finally** - Start both servers (Steps 4-5)
5. 🎉 **Done!** - Generate your first invoice!

---

**Let's build something awesome! 💪**

Begin with **Step 2** above ⬆️
