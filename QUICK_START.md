# 🚀 Quick Start Guide - SlotSwapper

This is a simplified step-by-step guide to get your app running quickly.

## ⚡ Quick Setup (5 minutes)

### 1. Install Node.js
- Download from: https://nodejs.org/ (LTS version)
- Verify: Open PowerShell and type:
  ```powershell
  node --version
  npm --version
  ```
  You should see version numbers.

### 2. Set Up MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (takes 3-5 minutes)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your actual database password
7. Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/slotswapper`
8. Click "Add IP Address" and allow access from anywhere: `0.0.0.0/0` (for testing)

### 3. Backend Setup

Open PowerShell in the project directory:

```powershell
# Navigate to backend folder
cd backend

# Install dependencies (takes 2-3 minutes)
npm install

# Create .env file
# Copy the content below and paste into a new file named .env
```

Create `backend/.env` file with this content:
```env
PORT=5000
MONGODB_URI=paste_your_mongodb_atlas_connection_string_here
JWT_SECRET=my_super_secret_key_12345_change_this_in_production
```

**Important**: Replace `paste_your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string from step 2.

### 4. Frontend Setup

Open a NEW PowerShell window:

```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies (takes 5-7 minutes - React is large!)
npm install

# Create .env file
# Copy the content below
```

Create `frontend/.env` file with this content:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Run the Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

Wait until you see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

Your browser will automatically open at `http://localhost:3000` 🎉

---

## ✅ Verify Installation

### Check Backend:
- Open browser: http://localhost:5000/api/health
- Should see: `{"message":"SlotSwapper API is running!","status":"ok"}`

### Check Frontend:
- Browser opens automatically at http://localhost:3000
- You should see the Login page

---

## 🎯 First Steps After Running

1. **Sign Up**: Click "Sign up" and create an account
2. **Create Event**: 
   - After login, click "+ Create Event"
   - Fill in: Title, Start Time, End Time
   - Click "Create Event"
3. **Make Swappable**: 
   - Find your event in the list
   - Click "Make Swappable" button
4. **Test Swap**:
   - Create another user account in a different browser/incognito window
   - Create and mark an event as swappable
   - Go to Marketplace to see each other's slots
   - Request a swap!

---

## 🆘 Troubleshooting

### "npm install" fails
- Make sure you have Node.js installed: `node --version`
- Try: `npm cache clean --force` then `npm install` again

### Backend won't start - "Cannot connect to MongoDB"
- Check your `.env` file has the correct MongoDB connection string
- For Atlas: Make sure you whitelisted IP `0.0.0.0/0`
- Verify your password doesn't have special characters (or URL-encode them)

### Frontend won't start
- Make sure backend is running first
- Check `REACT_APP_API_URL` in `frontend/.env`
- Delete `node_modules` and try `npm install` again

### Port already in use
- Change `PORT=5001` in `backend/.env`
- Update `REACT_APP_API_URL=http://localhost:5001/api` in `frontend/.env`

---

## 📚 Need More Help?

- See `SETUP_INSTRUCTIONS.md` for detailed instructions
- See `README.md` for complete documentation
- See `PROJECT_PLAN.md` for implementation details

---

## ✨ You're Ready!

Now you can start building and testing your SlotSwapper application!

Good luck! 🚀

