# 📅 SlotSwapper - Peer-to-Peer Time-Slot Scheduling Application

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/Shivamupa48/Assignment)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)

## 📋 Overview

SlotSwapper is a full-stack web application that allows users to swap their busy calendar time slots with other users. Built as a technical challenge, this application demonstrates skills in data modeling, complex API logic, authentication, and frontend state management.

**Repository:** [https://github.com/Shivamupa48/Assignment](https://github.com/Shivamupa48/Assignment)

### Key Features

- ✅ User authentication with JWT
- ✅ User registration and login (separate flows)
- ✅ Password reset functionality (Forgot Password)
- ✅ Profile management (Edit Profile)
- ✅ Calendar management (Create, Read, Update, Delete events)
- ✅ Mark events as "swappable"
- ✅ Browse available swappable slots from other users (Marketplace)
- ✅ Request swaps with other users
- ✅ Accept or reject swap requests (Notifications)
- ✅ Automatic calendar updates when swaps are accepted
- ✅ Real-time UI updates without page refresh
- ✅ Modern, responsive UI with animations

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with **TypeScript**
- **React Router** for navigation
- **Axios** for HTTP requests
- **Context API** for state management
- **CSS3** for styling

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** (jsonwebtoken) for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for frontend communication

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - **MongoDB Atlas** (Cloud - Recommended for beginners) - [Sign up here](https://www.mongodb.com/cloud/atlas)
   - **MongoDB Community** (Local) - [Download here](https://www.mongodb.com/try/download/community)
3. **Git** (Optional) - [Download here](https://git-scm.com/)
4. **Code Editor** (VS Code recommended)

---

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/Shivamupa48/Assignment.git
cd Assignment
```

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

**⚠️ IMPORTANT: Database Setup Required**

**You MUST set up MongoDB before running the application.** The app requires a database to store users, events, and swap requests.

**Recommended: MongoDB Atlas (Cloud - FREE)** ✅
- ✅ No installation needed
- ✅ Works with GitHub deployments
- ✅ Free tier available (512MB storage)
- ✅ Accessible from anywhere
- **Setup Steps:** Follow the instructions below:

**Quick MongoDB Atlas Setup:**
1. Sign up at https://www.mongodb.com/cloud/atlas (FREE)
2. Create a free M0 cluster (takes 3-5 minutes)
3. Go to "Database Access" → Create database user (save username/password!)
4. Go to "Network Access" → Add IP: `0.0.0.0/0` (allow from anywhere)
5. Go to "Database" → "Connect" → "Connect your application"
6. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/`
7. Add database name: `...mongodb.net/slotswapper`
8. Paste in `.env` file as `MONGODB_URI`

**Alternative: Local MongoDB** (NOT recommended for GitHub/deployment)
- Install MongoDB Community Server
- Start MongoDB service
- Use: `mongodb://localhost:27017/slotswapper`

4. Replace `your_mongodb_connection_string_here` in `.env` with your actual connection string.

### Step 3: Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Start Backend Server

Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### Start Frontend Server

Open a **new terminal** and run:
```bash
cd frontend
npm start
```

The browser will automatically open at `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user (returns JWT) | No |
| POST | `/api/auth/reset-password` | Reset password via email | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile (name, email) | Yes |

### Events
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get user's events | Yes |
| POST | `/api/events` | Create new event | Yes |
| PUT | `/api/events/:id` | Update event | Yes |
| DELETE | `/api/events/:id` | Delete event | Yes |
| PUT | `/api/events/:id/status` | Change event status | Yes |

### Swaps
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/swap/swappable-slots` | Get all swappable slots | Yes |
| POST | `/api/swap/swap-request` | Create swap request | Yes |
| GET | `/api/swap/swap-requests` | Get swap requests | Yes |
| POST | `/api/swap/swap-response/:requestId` | Accept/Reject swap | Yes |

---

## 📝 API Usage Examples

### Using Postman or cURL

#### 1. Sign Up
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 3. Create Event (Requires Auth Token)
```bash
POST http://localhost:5000/api/events
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Team Meeting",
  "startTime": "2025-01-15T10:00:00Z",
  "endTime": "2025-01-15T11:00:00Z",
  "status": "BUSY"
}
```

#### 4. Get Swappable Slots
```bash
GET http://localhost:5000/api/swap/swappable-slots
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 5. Create Swap Request
```bash
POST http://localhost:5000/api/swap/swap-request
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "mySlotId": "slot_id_1",
  "theirSlotId": "slot_id_2"
}
```

#### 6. Respond to Swap Request
```bash
POST http://localhost:5000/api/swap/swap-response/request_id
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "accepted": true
}
```

#### 7. Reset Password
```bash
POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "newPassword": "newpassword123"
}
```

#### 8. Update Profile
```bash
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

---

## 🏗️ Project Structure

```
slotswapper/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database connection
│   │   ├── models/
│   │   │   ├── User.js              # User model
│   │   │   ├── Event.js              # Event/Slot model
│   │   │   └── SwapRequest.js        # Swap request model
│   │   ├── routes/
│   │   │   ├── auth.js               # Authentication routes
│   │   │   ├── events.js             # Event CRUD routes
│   │   │   └── swap.js               # Swap logic routes
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT authentication middleware
│   │   └── index.js                  # Express server entry point
│   ├── package.json
│   └── .env                          # Environment variables (create this)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx            # Navigation component
│   │   ├── pages/
│   │   │   ├── Login.tsx             # Login page
│   │   │   ├── Signup.tsx            # Signup page
│   │   │   ├── ForgotPassword.tsx    # Password reset page
│   │   │   ├── Dashboard.tsx          # Calendar/Dashboard page
│   │   │   ├── Marketplace.tsx       # Marketplace page
│   │   │   ├── Notifications.tsx      # Notifications page
│   │   │   └── EditProfile.tsx       # Edit profile page
│   │   ├── services/
│   │   │   ├── authService.ts        # Auth API calls
│   │   │   ├── eventService.ts       # Event API calls
│   │   │   └── swapService.ts        # Swap API calls
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Authentication context
│   │   ├── utils/
│   │   │   └── api.ts                # Axios configuration
│   │   ├── App.tsx                   # Main app component
│   │   ├── index.tsx                 # React entry point
│   │   └── index.css                 # Global styles
│   ├── public/
│   │   └── index.html                # HTML template
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                          # Environment variables (create this)
│
├── README.md                         # This file
├── PROJECT_PLAN.md                   # Detailed project plan
├── SETUP_INSTRUCTIONS.md            # Setup guide
└── .gitignore
```

---

## 🎯 Design Decisions

### Database Schema

1. **User Model**: Stores user credentials with hashed passwords
2. **Event Model**: 
   - Status enum: `BUSY`, `SWAPPABLE`, `SWAP_PENDING`
   - Linked to user via `userId`
3. **SwapRequest Model**: 
   - Links two events and two users
   - Status: `PENDING`, `ACCEPTED`, `REJECTED`
   - Prevents duplicate requests

### Swap Logic

The core swap functionality works as follows:

1. **Request Creation**:
   - Validates both slots are `SWAPPABLE`
   - Updates both slots to `SWAP_PENDING` to prevent other swaps
   - Creates a `SwapRequest` with `PENDING` status

2. **Acceptance**:
   - Exchanges the `userId` of both slots
   - Sets both slots back to `BUSY`
   - Updates `SwapRequest` to `ACCEPTED`

3. **Rejection**:
   - Sets both slots back to `SWAPPABLE`
   - Updates `SwapRequest` to `REJECTED`

### Frontend Architecture

- **Context API**: Manages global authentication state
- **Service Layer**: Separates API logic from components
- **Protected Routes**: Ensures authenticated access
- **Real-time Updates**: Refreshes data after mutations

---

## 🧪 Testing the Application

### Test Flow

1. **Create Two User Accounts**:
   - User A: `alice@example.com`
   - User B: `bob@example.com`

2. **User A**:
   - Login and create an event (e.g., "Team Meeting" on Tuesday 10-11 AM)
   - Mark it as "Swappable"

3. **User B**:
   - Login and create an event (e.g., "Focus Block" on Wednesday 2-3 PM)
   - Mark it as "Swappable"
   - Go to Marketplace and see User A's slot
   - Click "Request Swap" and select their own slot
   - Check Notifications page - see "Outgoing Request: Pending"

4. **User A**:
   - Check Notifications page - see "Incoming Request"
   - Click "Accept"

5. **Both Users**:
   - Check Dashboard - slots should now belong to the other user

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
- Verify `.env` file has correct `MONGODB_URI`
- For Atlas: Check IP whitelist (use `0.0.0.0/0` for testing)
- For local: Ensure MongoDB service is running

**"Port 5000 already in use"**
- Change `PORT` in backend `.env` file
- Or kill the process: `npx kill-port 5000` (if installed)

### Frontend Issues

**"Cannot connect to backend"**
- Ensure backend is running on correct port
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify CORS is enabled (already configured in backend)

**"Module not found" errors**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**TypeScript errors**
- Ensure all dependencies are installed
- Check `tsconfig.json` is correct

---

## 🎨 UI Features

- Modern gradient design with smooth animations
- Responsive layout (mobile-friendly)
- Profile dropdown with avatar and quick actions
- Interactive forms with real-time validation
- Toast notifications for user feedback
- Loading states and spinners
- Protected routes with authentication

## 🔮 Future Enhancements (Bonus Features)

Potential improvements if time permits:

- [ ] Unit/Integration tests for backend API
- [ ] Real-time notifications using WebSockets
- [ ] Calendar grid view (instead of list)
- [ ] Email notifications for swap requests
- [ ] Swap history and analytics
- [ ] Docker containerization
- [ ] Deploy to production (Vercel/Netlify + Render/Heroku)

---

## 📚 Assumptions Made

1. **Time Zones**: All times are stored and displayed in UTC. For production, timezone handling should be added.

2. **Slot Validation**: The application assumes users won't create overlapping events. Overlap validation can be added.

3. **Swap Cancellation**: Users cannot cancel a pending swap request. This feature can be added.

4. **Event Deletion**: If an event involved in a pending swap is deleted, the swap request remains. Edge case handling can be improved.

---

## 🤝 Contributing

This is a technical challenge project. If you'd like to extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is created as part of a technical challenge for ServiceHive.

---

## 👤 Author

Built as a Full Stack Developer Internship technical challenge.

---

## 📞 Support

**If you encounter issues:**
- Follow the setup instructions in this README
- Review backend console logs for error messages
- Review browser console (F12) for frontend errors
- Verify MongoDB connection in `.env` file
- Check MongoDB Atlas dashboard for connection status

---

## 🌐 Database Hosting Information

### ❓ Do I Need to Host Database Separately?

**YES!** The database (MongoDB) must be hosted separately. You have two options:

1. **MongoDB Atlas (RECOMMENDED)** ✅
   - FREE cloud database (M0 tier: 512MB)
   - No installation needed
   - Works with GitHub deployments
   - Accessible from anywhere
   - Setup: https://www.mongodb.com/cloud/atlas
   - **This is what you should use!**

2. **Local MongoDB** (NOT for GitHub/deployment)
   - Only works on your computer
   - Not accessible for deployed apps
   - Requires installation

### 🔐 Important Security Note

- **NEVER commit `.env` files to GitHub!** (Already in `.gitignore`)
- Store database credentials in environment variables
- Use `.env.example` files as templates
- For production, use platform environment variables (Vercel, Render, etc.)

**All database setup instructions are included in the README above.**

---

## 📊 Repository Statistics

- **Total Files:** 48+ files
- **Languages:** TypeScript (55.9%), JavaScript (26.9%), CSS (16.7%), HTML (0.5%)
- **Frontend:** React 18 + TypeScript
- **Backend:** Node.js + Express + MongoDB
- **Database:** MongoDB (Atlas recommended)

---
**Happy Swapping! 🎉**

**Repository Link:** [https://github.com/Shivamupa48/Assignment](https://github.com/Shivamupa48/Assignment)  

**Frontend Link:** [https://assignment-slotswapper.vercel.app](https://assignment-slotswapper.vercel.app)  

**Backend Link:** [https://assignment-slotswapper.onrender.com](https://assignment-slotswapper.onrender.com)  

**Database Connection String:**  
`mongodb+srv://<your-username>:<your-password>@<your-cluster>.mongodb.net/slotswapper`  

**Project Live Link:** [https://assignment-slotswapper.vercel.app](https://assignment-slotswapper.vercel.app)

