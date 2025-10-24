# 🍃 MongoDB Setup Guide

You have **two options** for MongoDB. Choose the one that works best for you:

---

## 🌐 Option 1: MongoDB Atlas (Cloud - Recommended)

### ✅ Advantages:
- ✅ No local installation needed
- ✅ Free 512MB tier available
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Better for deployment

### 📋 Setup Steps:

#### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (or use Google/GitHub)
3. Verify your email address

#### Step 2: Create a Free Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select a cloud provider and region (choose closest to you):
   - AWS, Google Cloud, or Azure
   - Region: Choose your country/nearest location
4. Name your cluster (default is fine): `Cluster0`
5. Click **"Create"** (takes 3-5 minutes)

#### Step 3: Create Database User
1. You'll see a security quickstart
2. Choose **"Username and Password"**
3. Create credentials:
   ```
   Username: invoice_admin
   Password: [Generate secure password or create your own]
   ```
4. **⚠️ IMPORTANT:** Save these credentials securely!
5. Click **"Create User"**

#### Step 4: Whitelist Your IP Address
1. Scroll down to "Where would you like to connect from?"
2. Click **"Add My Current IP Address"**
3. For development, you can also:
   - Click **"Add a Different IP Address"**
   - Enter `0.0.0.0/0` (allows access from anywhere)
   - Add description: "Allow All (Development Only)"
4. Click **"Add Entry"**
5. Click **"Finish and Close"**

#### Step 5: Get Connection String
1. Click **"Connect"** on your cluster
2. Select **"Connect your application"**
3. Choose:
   - Driver: **Node.js**
   - Version: **4.1 or later**
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://invoice_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### Step 6: Update Your .env File
1. Open `backend\.env` file
2. Replace `<password>` with your actual password
3. Add database name after `.net/`:
   ```env
   MONGODB_URI=mongodb+srv://invoice_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/invoice_generator?retryWrites=true&w=majority
   ```

#### Example:
```env
# If your password is: MySecure123
# And your cluster URL is: cluster0.abc123.mongodb.net

MONGODB_URI=mongodb+srv://invoice_admin:MySecure123@cluster0.abc123.mongodb.net/invoice_generator?retryWrites=true&w=majority
```

### ✅ Verify Connection
Start your backend server:
```powershell
cd C:\Users\priya\Desktop\invoice\backend
npm start
```

You should see:
```
Server is running on port 5000
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

---

## 💻 Option 2: Local MongoDB (On Your PC)

### ✅ Advantages:
- ✅ Works offline
- ✅ No internet required
- ✅ Faster for development
- ✅ Full control

### 📋 Setup Steps:

#### Step 1: Download MongoDB Community Server
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: 7.0.x (current)
   - Platform: Windows x64
   - Package: MSI
3. Click **"Download"**

#### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose **"Complete"** installation
3. Install as a Service:
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Service Name: MongoDB
   - ✅ Run service as Network Service user
4. Install **MongoDB Compass** (GUI tool) - recommended
5. Click **"Install"**

#### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

You should see MongoDB version information.

#### Step 4: Start MongoDB Service
```powershell
# Start MongoDB service
net start MongoDB

# Check if running
Get-Service MongoDB
```

Expected output:
```
Status   Name               DisplayName
------   ----               -----------
Running  MongoDB            MongoDB
```

#### Step 5: Update .env File
Your `.env` file should already have:
```env
MONGODB_URI=mongodb://localhost:27017/invoice_generator
```

No changes needed! ✅

#### Step 6: (Optional) Use MongoDB Compass
1. Open MongoDB Compass (installed with MongoDB)
2. Connection string: `mongodb://localhost:27017`
3. Click **"Connect"**
4. You'll see your databases (including `invoice_generator` once you create invoices)

---

## 🔧 Troubleshooting

### MongoDB Atlas Issues

#### Can't Connect - Check:
1. ✅ Is your IP whitelisted? (Try 0.0.0.0/0)
2. ✅ Is the password correct? (No special characters issues)
3. ✅ Did you replace `<password>` in the connection string?
4. ✅ Is there a `/invoice_generator` database name in the URL?

#### Password with Special Characters:
If your password has special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `:` → `%3A`

Example: `My@Pass#123` becomes `My%40Pass%23123`

### Local MongoDB Issues

#### MongoDB Service Won't Start:
```powershell
# Stop and restart
net stop MongoDB
net start MongoDB
```

#### Port 27017 Already in Use:
```powershell
# Find what's using the port
netstat -ano | findstr :27017

# Kill the process (replace PID with actual process ID)
taskkill /PID [PID] /F
```

#### MongoDB Not Installed as Service:
```powershell
# Install MongoDB as service manually
mongod --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg" --install
```

---

## 🎯 Which Should You Choose?

### Choose **MongoDB Atlas** if:
- ✅ You don't want to install anything locally
- ✅ You plan to deploy this app online later
- ✅ You want automatic backups
- ✅ You have stable internet connection

### Choose **Local MongoDB** if:
- ✅ You want to work offline
- ✅ You prefer local development
- ✅ You want faster database operations
- ✅ You're comfortable with local installations

---

## 📊 Quick Connection Test

Create a test file to verify your connection:

**test-connection.js** (in backend folder):
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  });
```

Run it:
```powershell
cd C:\Users\priya\Desktop\invoice\backend
node test-connection.js
```

---

## 🔐 Security Best Practices

### For MongoDB Atlas:
1. ✅ Use strong passwords
2. ✅ Don't commit `.env` file to git
3. ✅ Use IP whitelisting in production
4. ✅ Create separate users for different apps
5. ✅ Regularly rotate passwords

### For Local MongoDB:
1. ✅ Enable authentication in production
2. ✅ Don't expose port 27017 to internet
3. ✅ Keep MongoDB updated
4. ✅ Use firewall rules

---

## 📝 Summary

### MongoDB Atlas Connection String Format:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/DATABASE_NAME?retryWrites=true&w=majority
```

### Local MongoDB Connection String Format:
```
mongodb://localhost:27017/DATABASE_NAME
```

### Your Database Name:
```
invoice_generator
```

---

## 🆘 Need Help?

1. **MongoDB Atlas Issues**: Check Atlas documentation or support
2. **Local MongoDB Issues**: Check Windows services and MongoDB logs
3. **Connection Errors**: Review the troubleshooting section above
4. **Still stuck?**: Check backend terminal for detailed error messages

---

**Once MongoDB is set up, you're ready to run the application!** 🎉

Go back to **README.md** or **QUICKSTART.md** to continue with the setup.
