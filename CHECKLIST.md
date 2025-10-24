# ✅ Setup Checklist

## Before You Start

### Prerequisites
- [ ] Node.js installed (v14 or higher)
- [ ] MongoDB installed and accessible
- [ ] npm available in terminal
- [ ] Two terminal windows ready

## Installation Steps

### Step 1: Verify Prerequisites
```powershell
# Check Node.js
node --version
# Should show: v14.x.x or higher

# Check npm
npm --version
# Should show: 6.x.x or higher

# Check MongoDB
mongod --version
# Should show MongoDB version
```

### Step 2: Install Dependencies

#### Option A: Automatic (Recommended)
```powershell
cd C:\Users\priya\Desktop\invoice
.\install.ps1
```

#### Option B: Manual
```powershell
# Backend
cd C:\Users\priya\Desktop\invoice\backend
npm install

# Frontend
cd C:\Users\priya\Desktop\invoice\frontend
npm install
```

### Step 3: Start MongoDB
```powershell
# Start MongoDB service
net start MongoDB

# Or if installed locally
mongod
```

### Step 4: Run the Application

#### Terminal 1 - Backend
```powershell
cd C:\Users\priya\Desktop\invoice\backend
npm start
```

**Expected Output:**
```
Server is running on port 5000
MongoDB Connected: localhost
```

#### Terminal 2 - Frontend
```powershell
cd C:\Users\priya\Desktop\invoice\frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view the app in the browser.
Local: http://localhost:3000
```

## Testing the Application

### Step 5: Open Browser
- [ ] Navigate to http://localhost:3000
- [ ] You should see the Invoice Generator form

### Step 6: Fill Sample Data
Use the data from `SAMPLE_DATA.md`:

**Company Details:**
- [ ] Company Name: TRUE POWER LIMITED
- [ ] Address: 123, Industrial Area, Phase-1, Sector 44, Gurugram, Haryana
- [ ] Contact: +91-9876543210
- [ ] Email: info@truepower.com

**Customer Details:**
- [ ] Name: Rajesh Kumar
- [ ] Company: Tech Solutions Pvt Ltd
- [ ] Address: 456, Tech Park, Cyber City, Bengaluru
- [ ] Contact: +91-9988776655

**Quotation Details:**
- [ ] Number: QT-2025-001
- [ ] Date: (Today's date)

**Items:**
- [ ] Item 1: Industrial Motor 5HP, Qty: 10, Rate: 15000, CGST: 9, SGST: 9
- [ ] Item 2: Control Panel Cabinet, Qty: 5, Rate: 8500, CGST: 9, SGST: 9
- [ ] Item 3: Installation Service, Qty: 1, Rate: 25000, CGST: 9, SGST: 9

### Step 7: Generate PDF
- [ ] Click "Generate PDF Invoice" button
- [ ] Wait for success message
- [ ] PDF should download automatically
- [ ] Open PDF to verify format

### Step 8: Verify Backend
- [ ] Check backend terminal - should show no errors
- [ ] Check `backend/invoices` folder - PDF should be saved there
- [ ] MongoDB should have the invoice record

## Troubleshooting Checklist

### If Backend Won't Start
- [ ] Is MongoDB running?
- [ ] Is port 5000 free?
- [ ] Are all dependencies installed?
- [ ] Check `.env` file exists in backend folder

### If Frontend Won't Start
- [ ] Are all dependencies installed?
- [ ] Is port 3000 free?
- [ ] Check for compilation errors in terminal

### If PDF Doesn't Generate
- [ ] Check backend terminal for errors
- [ ] Verify all form fields are filled
- [ ] Check MongoDB connection
- [ ] Verify `backend/invoices` folder exists

### If PDF Doesn't Download
- [ ] Check browser download settings
- [ ] Look for PDF in default downloads folder
- [ ] Check browser console for errors
- [ ] Verify backend response in network tab

## File Structure Verification

### Root Files
- [ ] README.md
- [ ] QUICKSTART.md
- [ ] SAMPLE_DATA.md
- [ ] PROJECT_SUMMARY.md
- [ ] APPLICATION_GUIDE.md
- [ ] CHECKLIST.md (this file)
- [ ] install.ps1

### Backend Files
- [ ] backend/package.json
- [ ] backend/.env
- [ ] backend/.gitignore
- [ ] backend/server.js
- [ ] backend/config/database.js
- [ ] backend/models/Invoice.js
- [ ] backend/controllers/invoiceController.js
- [ ] backend/routes/invoiceRoutes.js
- [ ] backend/utils/pdfGenerator.js
- [ ] backend/invoices/ (folder)

### Frontend Files
- [ ] frontend/package.json
- [ ] frontend/.gitignore
- [ ] frontend/tailwind.config.js
- [ ] frontend/postcss.config.js
- [ ] frontend/public/index.html
- [ ] frontend/src/index.js
- [ ] frontend/src/index.css
- [ ] frontend/src/App.js
- [ ] frontend/src/components/InvoiceForm.js

## Success Indicators

### Backend Running Successfully
- [ ] ✅ "Server is running on port 5000"
- [ ] ✅ "MongoDB Connected"
- [ ] ✅ No error messages in terminal

### Frontend Running Successfully
- [ ] ✅ "Compiled successfully!"
- [ ] ✅ Browser opens automatically
- [ ] ✅ Form displays correctly

### Application Working
- [ ] ✅ Form accepts input
- [ ] ✅ Calculations work in real-time
- [ ] ✅ Add/Remove items works
- [ ] ✅ PDF generates without errors
- [ ] ✅ PDF downloads automatically
- [ ] ✅ PDF matches TRUE POWER LIMITED format

## Performance Checklist

- [ ] Form is responsive on all screen sizes
- [ ] No console errors in browser
- [ ] API calls complete in < 2 seconds
- [ ] PDF generates in < 3 seconds
- [ ] No memory leaks observed

## Security Checklist

- [ ] .env file not committed to git
- [ ] node_modules not committed to git
- [ ] Generated PDFs not committed to git
- [ ] CORS properly configured
- [ ] Input validation working

## Final Verification

- [ ] ✅ Backend + Frontend both running
- [ ] ✅ MongoDB connected and working
- [ ] ✅ Form accepts all required data
- [ ] ✅ Calculations are accurate
- [ ] ✅ PDF generates successfully
- [ ] ✅ PDF format matches requirements
- [ ] ✅ Data saved to MongoDB
- [ ] ✅ No errors in any terminal

---

## 🎉 If All Checked - You're Ready!

Your full-stack MERN invoice generator is now fully operational!

### Quick Reference Commands

**Start Backend:**
```powershell
cd C:\Users\priya\Desktop\invoice\backend
npm start
```

**Start Frontend:**
```powershell
cd C:\Users\priya\Desktop\invoice\frontend
npm start
```

**View Logs:**
- Backend: Check backend terminal
- Frontend: Check browser console (F12)
- MongoDB: Check MongoDB logs

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

---

**Need Help?** Check README.md for detailed documentation.
