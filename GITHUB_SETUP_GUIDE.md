# 🚀 GitHub Setup & Deployment Guide

## 📦 Pushing Project to GitHub

### Step 1: Initialize Git Repository

If you haven't already, initialize git in your project:

```bash
cd D:\java25\Assignment
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: SlotSwapper - Full Stack Time-Slot Scheduling Application"
```

### Step 4: Add Remote Repository

```bash
git remote add origin https://github.com/Shivamupa48/Assignment.git
```

### Step 5: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

**Note:** If you encounter authentication issues:
- Use Personal Access Token instead of password
- Or use SSH: `git remote set-url origin git@github.com:Shivamupa48/Assignment.git`

---

## 🗄️ Database Setup for GitHub Repository

### ⚠️ IMPORTANT: DO NOT Commit Database Credentials!

**Never push `.env` files to GitHub!** They contain sensitive information.

### Database Hosting Options:

#### Option 1: MongoDB Atlas (Cloud - RECOMMENDED) ✅

**Why MongoDB Atlas?**
- ✅ FREE tier available (M0 - 512MB)
- ✅ Cloud-hosted (no local installation needed)
- ✅ Works with GitHub deployments
- ✅ Secure and scalable
- ✅ Easy to share connection string securely

**Setup Steps:**

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free" or "Sign Up"
   - Create account (takes 2 minutes)

2. **Create Free Cluster**
   - Click "Build a Database"
   - Choose **"M0 FREE"** tier
   - Select cloud provider (AWS recommended)
   - Choose region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (SAVE THIS!)
   - Set privileges: "Atlas admin" (for free tier)
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (`0.0.0.0/0`)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
     ```
   - Replace `<username>` and `<password>` with your database user credentials
   - Add database name at the end:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/slotswapper
     ```

6. **Update Your Local .env File**
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/slotswapper
   ```

7. **For Production/Deployment**
   - Store connection string in environment variables (Render, Heroku, etc.)
   - NEVER commit `.env` to GitHub
   - Use platform's environment variable settings

---

#### Option 2: Local MongoDB (NOT Recommended for GitHub)

**Why NOT recommended:**
- ❌ Requires MongoDB installed on each machine
- ❌ Connection string won't work on deployed apps
- ❌ Only works on your local computer
- ❌ Can't be shared with collaborators

**Only use if:**
- Testing locally only
- No deployment needed
- All developers have MongoDB installed

---

## 🔐 Security Best Practices

### 1. Never Commit Sensitive Files

Your `.gitignore` should include:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. Environment Variables Template

Create `.env.example` file for reference:

**backend/.env.example:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**frontend/.env.example:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Commit `.env.example` but NOT `.env`**

### 3. For Team Collaboration

1. Each developer creates their own `.env` file locally
2. Use MongoDB Atlas for shared development database
3. Share connection string securely (NOT in GitHub)
4. Use different JWT_SECRET for each environment

---

## 📝 Complete GitHub Push Commands

```bash
# Navigate to project
cd D:\java25\Assignment

# Initialize git (if not done)
git init

# Check status
git status

# Add all files (except .env - already in .gitignore)
git add .

# Commit
git commit -m "Initial commit: SlotSwapper - Full Stack Time-Slot Scheduling Application

Features:
- User authentication with JWT
- Calendar event management
- Swap request system
- Marketplace for browsing slots
- Notifications for swap requests
- Profile management
- Password reset functionality"

# Add remote
git remote add origin https://github.com/Shivamupa48/Assignment.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 🚀 Deployment Options

### Frontend Deployment (Vercel/Netlify)

1. **Vercel** (Recommended for React):
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```
   - Set environment variable: `REACT_APP_API_URL=your_backend_url`

2. **Netlify**:
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `build`
   - Set environment variables in Netlify dashboard

### Backend Deployment (Render/Heroku)

1. **Render** (Free tier available):
   - Connect GitHub repo
   - Select backend folder
   - Add environment variables:
     - `MONGODB_URI=your_atlas_connection_string`
     - `JWT_SECRET=your_secret_key`
     - `PORT=5000`

2. **Heroku**:
   ```bash
   heroku create your-app-name
   heroku config:set MONGODB_URI=your_atlas_connection_string
   heroku config:set JWT_SECRET=your_secret_key
   git push heroku main
   ```

---

## ✅ Checklist Before Pushing to GitHub

- [ ] `.env` files are in `.gitignore` ✅
- [ ] `.env.example` files created for reference
- [ ] MongoDB Atlas account created
- [ ] Connection string saved locally (NOT in repo)
- [ ] All code tested and working
- [ ] README.md is complete
- [ ] No sensitive data in code
- [ ] Git initialized
- [ ] Files committed
- [ ] Remote added
- [ ] Pushed to GitHub

---

## 🎯 Quick Summary

1. **Database**: Use MongoDB Atlas (cloud) - FREE and works with GitHub
2. **Credentials**: Store in `.env` (NOT in GitHub)
3. **Push Code**: Use git commands above
4. **Share**: Give teammates MongoDB Atlas access or connection string (securely)
5. **Deploy**: Use Vercel/Netlify for frontend, Render/Heroku for backend

---

## 📞 Need Help?

- **Git Issues**: Check [Git Documentation](https://git-scm.com/doc)
- **MongoDB Atlas**: Check [Atlas Documentation](https://docs.atlas.mongodb.com/)
- **Deployment**: Check platform-specific docs

---

**Remember:** Always keep your `.env` files local and never commit them! 🔒

