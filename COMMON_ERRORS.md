# 🐛 Common Errors & Solutions

## Error: "Duplicate Quotation Number"

### Error Message:
```
E11000 duplicate key error collection: invoice_generator.invoices
index: quotationDetails.quotationNumber_1 dup key
```

### What It Means:
You're trying to create an invoice with a quotation number that already exists in the database. Each quotation number must be unique.

### ✅ Solution:
**Change the quotation number to something unique!**

Examples:
- If you used: `BP/QUT2024-25/1720`
- Try: `BP/QUT2024-25/1721`, `BP/QUT2024-25/1722`, etc.
- Or: `QT-2025-001`, `QT-2025-002`, etc.

### Why This Happens:
- You tested the same quotation number multiple times
- The invoice was already saved to the database
- Each quotation number is marked as unique in MongoDB

### 🗑️ Want to Delete Old Invoices?

#### Option 1: MongoDB Atlas Dashboard
1. Login to MongoDB Atlas
2. Go to "Browse Collections"
3. Select `invoice_generator` database
4. Select `invoices` collection
5. Find and delete old test invoices

#### Option 2: MongoDB Compass (if using local)
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Navigate to `invoice_generator` → `invoices`
4. Delete test documents

#### Option 3: Drop All Invoices (Use Carefully!)
Run this in backend terminal:
```javascript
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(async () => { await mongoose.connection.db.collection('invoices').deleteMany({}); console.log('All invoices deleted!'); process.exit(0); });"
```

---

## Error: "MongoDB Connection Error"

### Error Messages:
- `MongoNetworkError`
- `ECONNREFUSED`
- `Authentication failed`

### ✅ Solutions:

#### For MongoDB Atlas:
1. **Check IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Make sure your IP is whitelisted
   - Or add `0.0.0.0/0` for development

2. **Verify Credentials:**
   - Check username and password in `.env`
   - No special characters causing issues?

3. **Check Connection String:**
   - Must include database name: `/invoice_generator`
   - Format: `mongodb+srv://user:pass@cluster.mongodb.net/invoice_generator?retryWrites=true`

#### For Local MongoDB:
1. **Start MongoDB Service:**
   ```powershell
   net start MongoDB
   ```

2. **Check if Running:**
   ```powershell
   Get-Service MongoDB
   ```

---

## Error: "Port 5000 Already in Use"

### Error Message:
```
Error: listen EADDRINUSE: address already in use :::5000
```

### ✅ Solution:

**Option 1: Kill the Process**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with actual number)
taskkill /PID [PID] /F
```

**Option 2: Change Port**
Edit `backend\.env`:
```env
PORT=5001
```

---

## Error: "Cannot POST /api/invoices/create"

### What It Means:
Frontend can't reach the backend API.

### ✅ Solutions:

1. **Is Backend Running?**
   - Check backend terminal
   - Should see: "Server is running on port 5000"

2. **Check Frontend API URL:**
   - Open `frontend/src/components/InvoiceForm.js`
   - Line 179: Should be `http://localhost:5000/api/invoices/create`

3. **CORS Issue?**
   - Check backend `server.js` has `app.use(cors());`

---

## Error: "PDF Not Downloading"

### ✅ Solutions:

1. **Check Browser Settings:**
   - Allow downloads from localhost
   - Check download folder

2. **Check Browser Console:**
   - Press F12
   - Look for errors in Console tab
   - Check Network tab for API response

3. **Check Backend Logs:**
   - Any errors when generating PDF?

4. **Verify Folder Exists:**
   ```powershell
   Test-Path "C:\Users\priya\Desktop\invoice\backend\invoices"
   ```

---

## Error: "Module Not Found"

### Error Message:
```
Error: Cannot find module 'express'
```

### ✅ Solution:
```powershell
# Reinstall dependencies
cd C:\Users\priya\Desktop\invoice\backend
npm install

# Or frontend
cd C:\Users\priya\Desktop\invoice\frontend
npm install
```

---

## Error: "Compiled with Warnings" (Frontend)

### What It Means:
React compiled but has non-critical warnings.

### ✅ Solution:
- Usually safe to ignore during development
- Check console for specific warnings
- Fix if needed (unused variables, etc.)

---

## Error: "Failed to Fetch" in Browser

### What It Means:
Frontend can't connect to backend.

### ✅ Solutions:

1. **Backend Running?**
   ```
   http://localhost:5000 should respond
   ```

2. **Correct Backend URL?**
   - Check `InvoiceForm.js` line 179
   - Should be: `http://localhost:5000/api/invoices/create`

3. **Firewall Blocking?**
   - Allow Node.js through Windows Firewall

---

## Still Having Issues?

### Debug Checklist:

- [ ] MongoDB connected? (Check backend terminal)
- [ ] Backend running on port 5000?
- [ ] Frontend running on port 3000?
- [ ] `.env` file configured correctly?
- [ ] Dependencies installed? (`npm install`)
- [ ] Tried restarting both servers?

### Get More Info:

1. **Backend Logs:** Check terminal running backend
2. **Frontend Logs:** Press F12 in browser → Console
3. **MongoDB Logs:** Check Atlas dashboard or local logs
4. **Network Tab:** F12 → Network → See API calls

### Quick Test:

**Test MongoDB Connection:**
```powershell
cd C:\Users\priya\Desktop\invoice\backend
node test-connection.js
```

**Test Backend API:**
```powershell
# In PowerShell
Invoke-WebRequest -Uri http://localhost:5000 -UseBasicParsing
```

---

## 🆘 Emergency Reset

If nothing works, try a fresh start:

```powershell
# Stop all servers (Ctrl+C)

# Delete node_modules
Remove-Item -Recurse -Force C:\Users\priya\Desktop\invoice\backend\node_modules
Remove-Item -Recurse -Force C:\Users\priya\Desktop\invoice\frontend\node_modules

# Reinstall
cd C:\Users\priya\Desktop\invoice\backend
npm install

cd C:\Users\priya\Desktop\invoice\frontend
npm install

# Restart both
cd C:\Users\priya\Desktop\invoice\backend
npm start

# In new terminal
cd C:\Users\priya\Desktop\invoice\frontend
npm start
```

---

**Most common issue?** Duplicate quotation numbers! Just use a new number! 🎯
