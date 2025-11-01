# ✅ Installation Checklist

Use this checklist to ensure everything is set up correctly.

## Prerequisites

- [ ] Node.js installed (v18+) - Run `node --version` to verify
- [ ] npm installed - Run `npm --version` to verify
- [ ] MongoDB Atlas account created OR Local MongoDB installed
- [ ] MongoDB connection string obtained

## Backend Setup

- [ ] Navigated to `backend` folder
- [ ] Ran `npm install` successfully (no errors)
- [ ] Created `.env` file in `backend` folder
- [ ] Added `PORT=5000` to `.env`
- [ ] Added `MONGODB_URI=your_connection_string` to `.env`
- [ ] Added `JWT_SECRET=some_random_string` to `.env`
- [ ] Ran `npm run dev` and see "✅ Connected to MongoDB" and "🚀 Server running"
- [ ] Tested http://localhost:5000/api/health in browser (should return JSON)

## Frontend Setup

- [ ] Navigated to `frontend` folder
- [ ] Ran `npm install` successfully (this takes 5-10 minutes, be patient!)
- [ ] Created `.env` file in `frontend` folder
- [ ] Added `REACT_APP_API_URL=http://localhost:5000/api` to `.env`
- [ ] Ran `npm start` and browser opens at http://localhost:3000
- [ ] See the Login page (not errors)

## Testing the Application

- [ ] Created a user account via Sign Up page
- [ ] Successfully logged in
- [ ] Created an event in Dashboard
- [ ] Made an event "Swappable"
- [ ] Can see swappable slots in Marketplace
- [ ] Can create a swap request (requires 2 users)
- [ ] Can accept/reject swap requests in Notifications

## Common Issues & Solutions

### Backend Issues

**❌ "Cannot find module 'express'"**
- Solution: Run `npm install` in `backend` folder

**❌ "MongoDB connection error"**
- Check `.env` file exists and has correct `MONGODB_URI`
- For Atlas: Verify IP whitelist includes `0.0.0.0/0`
- Verify password in connection string is correct

**❌ "Port 5000 already in use"**
- Change `PORT=5001` in `.env`
- Update frontend `.env` to match: `REACT_APP_API_URL=http://localhost:5001/api`

### Frontend Issues

**❌ "Cannot find module 'react'"**
- Solution: Run `npm install` in `frontend` folder

**❌ "Module not found" errors**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

**❌ "Cannot connect to backend"**
- Verify backend is running (check Terminal 1)
- Check `REACT_APP_API_URL` in `frontend/.env` matches backend port
- Restart both frontend and backend

**❌ TypeScript errors**
- Ensure all dependencies installed: `npm install`
- Check `tsconfig.json` exists
- Try restarting the frontend server

### General Issues

**❌ PowerShell shows "command not recognized"**
- Make sure you're in the correct directory
- Use `cd "D:\java25\Assignment For Internship\backend"` (full path)

**❌ npm install is very slow**
- This is normal for first-time installation
- React and its dependencies are large (200+ MB)
- Be patient, it can take 5-10 minutes

---

## ✅ All Set!

If you've checked all boxes, you're ready to use SlotSwapper!

Next steps:
1. Create your first account
2. Create some events
3. Test the swap functionality
4. Refer to `README.md` for API documentation

Happy coding! 🎉

