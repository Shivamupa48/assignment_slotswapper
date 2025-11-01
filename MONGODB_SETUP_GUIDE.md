# 🗄️ MongoDB Setup & Integration Guide for SlotSwapper

## ✅ Yes, MongoDB IS REQUIRED!

Your project **absolutely needs MongoDB** because:
- ✅ The backend uses **Mongoose** (MongoDB ODM)
- ✅ All data models (User, Event, SwapRequest) are MongoDB collections
- ✅ All authentication, events, and swap data are stored in MongoDB
- ✅ **Without MongoDB, your backend will NOT work**

---

## 🔍 Current Status

**Good News:** MongoDB is already installed on your system (v8.2.1)!

Your `.env` file is configured for:
- **Connection String**: `mongodb://localhost:27017/slotswapper`
- **Port**: 27017 (default MongoDB port)
- **Database Name**: `slotswapper`

---

## 📋 Setup Options

You have **TWO options** for MongoDB:

### Option A: Local MongoDB (Recommended if MongoDB is installed)

**Step 1: Start MongoDB Service**

On Windows, MongoDB usually runs as a service. Check if it's running:

```powershell
# Check MongoDB service status
Get-Service -Name MongoDB*

# If not running, start it:
net start MongoDB
```

**OR** if MongoDB isn't running as a service, start it manually:

```powershell
# Start MongoDB (if installed but not as service)
mongod --dbpath "C:\data\db"
```

**Step 2: Verify Connection**

Try connecting to MongoDB:
```powershell
mongo --eval "db.version()"
```

**Step 3: Start Your Backend**

```powershell
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

---

### Option B: MongoDB Atlas (Cloud - FREE, No Installation Needed)

If local MongoDB gives you trouble, use **MongoDB Atlas** (cloud database):

#### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** or **"Sign Up"**
3. Create account (takes 2 minutes)

#### Step 2: Create Free Cluster
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select cloud provider (AWS recommended)
4. Choose region (closest to you)
5. Click **"Create Cluster"** (takes 3-5 minutes)

#### Step 3: Get Connection String
1. Once cluster is ready, click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```

#### Step 4: Configure Database Access
1. In Atlas dashboard, go to **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username and password (SAVE THIS!)
5. Set privileges: **"Atlas admin"** (for free tier)
6. Click **"Add User"**

#### Step 5: Configure Network Access
1. Go to **"Network Access"**
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
4. Click **"Confirm"**

#### Step 6: Update Your .env File

Edit `backend/.env` and replace the connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/slotswapper
JWT_SECRET=my_super_secret_jwt_key_12345_change_this_in_production
```

**Important:**
- Replace `your_username` with your Atlas username
- Replace `your_password` with your Atlas password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Keep `/slotswapper` at the end (database name)

**Example:**
```env
MONGODB_URI=mongodb+srv://john:MyPass123@cluster0.abc123.mongodb.net/slotswapper
```

#### Step 7: Test Connection

Start your backend:
```powershell
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

---

## 🧪 Testing MongoDB Connection

### Test 1: Check if Backend Connects

Start backend and look for this message:
```
✅ Connected to MongoDB
```

If you see:
```
❌ MongoDB connection error: ...
```

Then MongoDB is not running or connection string is wrong.

### Test 2: Test API Endpoints

Once backend is running:

```powershell
# Test health endpoint
curl http://localhost:5000/api/health

# Should return:
# {"message":"SlotSwapper API is running!","status":"ok"}
```

### Test 3: Create a User (Full Test)

1. Start backend: `npm run dev`
2. Start frontend: `npm start` (in frontend folder)
3. Go to http://localhost:3000
4. Try to sign up a new user
5. If successful, MongoDB is working! ✅

---

## 🔧 Troubleshooting

### Problem 1: "MongoDB connection error"

**Solutions:**
- ✅ Check if MongoDB service is running: `Get-Service MongoDB*`
- ✅ Start MongoDB: `net start MongoDB`
- ✅ Check if port 27017 is in use: `netstat -an | findstr 27017`
- ✅ Verify `.env` file has correct `MONGODB_URI`

### Problem 2: "Authentication failed" (Atlas)

**Solutions:**
- ✅ Check username/password in connection string
- ✅ Verify database user exists in Atlas
- ✅ Check IP whitelist (must include your IP or `0.0.0.0/0`)

### Problem 3: "Connection timeout"

**Solutions:**
- ✅ Check internet connection (for Atlas)
- ✅ Verify firewall isn't blocking port 27017
- ✅ For Atlas: Check network access settings

### Problem 4: "Cannot find module 'mongoose'"

**Solutions:**
```powershell
cd backend
npm install
```

### Problem 5: MongoDB not installed

**Download MongoDB Community Server:**
1. Go to: https://www.mongodb.com/try/download/community
2. Download Windows installer
3. Install with default settings
4. MongoDB will run as a Windows service automatically

---

## 📊 Database Structure

Once MongoDB is connected, your app will automatically create:

### Collections:
1. **users** - User accounts (name, email, password)
2. **events** - Calendar events/slots (title, startTime, endTime, status, userId)
3. **swaprequests** - Swap requests (requesterSlotId, targetSlotId, status)

### Automatic Creation:
- ✅ Collections are created automatically when first data is inserted
- ✅ No manual database setup needed
- ✅ Just start MongoDB and run your backend!

---

## 🚀 Quick Start Checklist

- [ ] MongoDB is installed (✅ You have v8.2.1)
- [ ] MongoDB service is running OR Atlas cluster is created
- [ ] `.env` file has correct `MONGODB_URI`
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Start backend: `npm run dev`
- [ ] See "✅ Connected to MongoDB" message
- [ ] Test by creating a user account

---

## 🎯 Recommended Setup for Development

**For beginners:** Use **MongoDB Atlas** (Option B)
- ✅ No installation needed
- ✅ Free tier available
- ✅ Works from anywhere
- ✅ Easy to reset/clear data

**For advanced users:** Use **Local MongoDB** (Option A)
- ✅ Faster (no network latency)
- ✅ Works offline
- ✅ Full control

---

## 📝 Summary

**YES, MongoDB is required!** Your project won't work without it.

**Quick steps:**
1. Ensure MongoDB is running (local or Atlas)
2. Update `.env` with correct connection string
3. Start backend: `npm run dev`
4. Look for "✅ Connected to MongoDB" message
5. Start building! 🎉

---

Need help? Check the error message in your backend console - it will tell you exactly what's wrong!

