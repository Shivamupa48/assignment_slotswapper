# SlotSwapper - Setup Instructions

## Prerequisites Installation

### 1. Install Node.js
- Go to https://nodejs.org/
- Download and install Node.js (LTS version recommended)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install MongoDB (Choose ONE option)

#### Option A: MongoDB Atlas (Recommended for Beginners)
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for a free account
- Create a new cluster (FREE tier)
- Click "Connect" → "Connect your application"
- Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
- Replace `<password>` with your actual password
- Add database name: `mongodb+srv://username:password@cluster.mongodb.net/slotswapper`

#### Option B: Local MongoDB
- Download from https://www.mongodb.com/try/download/community
- Install MongoDB Community Server
- Start MongoDB service (usually starts automatically)
- Connection string: `mongodb://localhost:27017/slotswapper`

### 3. Install Git (Optional but recommended)
- Download from https://git-scm.com/

---

## Project Setup Steps

### Step 1: Navigate to Project Directory
```bash
cd "D:\java25\Assignment For Internship"
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Set Up Backend Environment Variables

Create a file named `.env` in the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

**Important**: Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string from step 2.

### Step 4: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

After the React app is created, install additional packages:
```bash
npm install react-router-dom axios
```

### Step 5: Set Up Frontend Environment Variables

Create a file named `.env` in the `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Terminal 1: Start Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### Terminal 2: Start Frontend Server
```bash
cd frontend
npm start
```

This will open your browser automatically at http://localhost:3000

---

## Testing the API

### Using Postman or Browser

1. **Health Check**:
   - GET http://localhost:5000/api/health

2. **Sign Up**:
   - POST http://localhost:5000/api/auth/signup
   - Body (JSON):
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123"
     }
     ```
   - Copy the `token` from response

3. **Login**:
   - POST http://localhost:5000/api/auth/login
   - Body (JSON):
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```
   - Copy the `token` from response

4. **Get Events** (requires authentication):
   - GET http://localhost:5000/api/events
   - Headers:
     ```
     Authorization: Bearer YOUR_TOKEN_HERE
     ```

---

## Troubleshooting

### Backend Issues

**Error: Cannot connect to MongoDB**
- Check your `.env` file has the correct `MONGODB_URI`
- For MongoDB Atlas: Ensure your IP address is whitelisted (0.0.0.0/0 for testing)
- For local MongoDB: Ensure MongoDB service is running

**Error: Port already in use**
- Change `PORT` in `.env` file
- Or kill the process using port 5000

### Frontend Issues

**Error: Cannot connect to backend**
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env` file
- Check CORS is enabled in backend (should already be)

**Error: Module not found**
- Run `npm install` again in frontend folder
- Delete `node_modules` and `package-lock.json`, then `npm install`

---

## Next Steps

After setup, you can:
1. Test backend API endpoints with Postman
2. Build frontend components (pages will be created)
3. Connect frontend to backend
4. Test the complete flow

See `PROJECT_PLAN.md` for detailed implementation steps.

