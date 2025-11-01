# SlotSwapper - Complete Step-by-Step Building Guide

## Overview
SlotSwapper is a peer-to-peer time-slot scheduling application where users can swap their busy calendar slots with other users.

## Technology Stack

### Frontend
- **React** with **TypeScript** - Modern, type-safe frontend framework
- **React Router** - For navigation between pages
- **Axios** - For making API calls
- **Context API** - For state management (simpler than Redux for beginners)

### Backend
- **Node.js** with **Express** - JavaScript runtime and web framework
- **MongoDB** with **Mongoose** - NoSQL database (easier for beginners than SQL)
- **JWT (jsonwebtoken)** - For authentication
- **bcryptjs** - For password hashing
- **CORS** - To allow frontend-backend communication

### Development Tools
- **npm** or **yarn** - Package manager
- **nodemon** - Auto-restart server during development
- **concurrently** - Run frontend and backend together

---

## Installation Requirements

### Prerequisites (Install these first)

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - This installs both Node.js and npm
   - Verify: Open terminal and run `node --version` and `npm --version`

2. **MongoDB** (or MongoDB Atlas - Cloud version)
   - Option A: Local MongoDB - Download from: https://www.mongodb.com/try/download/community
   - Option B: MongoDB Atlas (Free cloud database) - Sign up at: https://www.mongodb.com/cloud/atlas
   - For beginners, **MongoDB Atlas is recommended** (easier setup)

3. **Code Editor**
   - VS Code is recommended: https://code.visualstudio.com/

4. **Git** (for version control)
   - Download from: https://git-scm.com/

---

## Project Structure

```
slotswapper/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── models/      # Database models (User, Event, SwapRequest)
│   │   ├── routes/      # API route handlers
│   │   ├── middleware/  # Authentication middleware
│   │   ├── config/      # Database configuration
│   │   └── index.js     # Server entry point
│   ├── package.json
│   └── .env            # Environment variables
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React Context for state
│   │   ├── services/   # API service functions
│   │   ├── utils/      # Helper functions
│   │   └── App.tsx     # Main app component
│   ├── package.json
│   └── tsconfig.json
│
├── README.md           # Project documentation
└── .gitignore
```

---

## Step-by-Step Building Process

### Phase 1: Project Setup (Day 1)

1. **Initialize Project**
   - Create project folders
   - Initialize Git repository
   - Create backend and frontend folders

2. **Backend Setup**
   - Initialize npm project
   - Install dependencies
   - Set up Express server
   - Configure MongoDB connection
   - Create .env file for environment variables

3. **Frontend Setup**
   - Create React app with TypeScript
   - Install routing and HTTP client libraries
   - Set up basic project structure

### Phase 2: Database Models (Day 1-2)

1. **User Model**
   - name, email, password (hashed)
   
2. **Event Model**
   - title, startTime, endTime, status, userId
   - Status enum: BUSY, SWAPPABLE, SWAP_PENDING
   
3. **SwapRequest Model**
   - requesterSlotId, targetSlotId
   - requesterUserId, targetUserId
   - status: PENDING, ACCEPTED, REJECTED
   - timestamps

### Phase 3: Authentication (Day 2)

1. **Backend Authentication**
   - Sign up endpoint (POST /api/auth/signup)
   - Log in endpoint (POST /api/auth/login)
   - JWT token generation
   - Authentication middleware

2. **Frontend Authentication**
   - Sign up page/component
   - Log in page/component
   - Auth context for managing user state
   - Protected route wrapper

### Phase 4: Events CRUD (Day 3)

1. **Backend API**
   - GET /api/events - Get user's events
   - POST /api/events - Create event
   - PUT /api/events/:id - Update event
   - DELETE /api/events/:id - Delete event
   - PUT /api/events/:id/status - Change event status

2. **Frontend**
   - Calendar/Dashboard page
   - Create event form
   - Event list display
   - Toggle "Make Swappable" functionality

### Phase 5: Swap Logic (Day 4-5) - THE CORE

1. **Backend - Swappable Slots**
   - GET /api/swappable-slots
   - Filter out user's own slots
   - Return only SWAPPABLE status slots

2. **Backend - Swap Request**
   - POST /api/swap-request
   - Validate both slots exist and are SWAPPABLE
   - Create SwapRequest record
   - Update both slots to SWAP_PENDING

3. **Backend - Swap Response**
   - POST /api/swap-response/:requestId
   - Handle ACCEPT: Exchange slot owners, update statuses
   - Handle REJECT: Revert slots back to SWAPPABLE
   - Transaction logic (critical!)

### Phase 6: Frontend Views (Day 5-6)

1. **Marketplace View**
   - Display all swappable slots
   - "Request Swap" button
   - Modal to select user's own slot to offer

2. **Notifications View**
   - Incoming requests list (with Accept/Reject)
   - Outgoing requests list (with status)

3. **State Management**
   - Update UI after swap actions
   - Refresh data without page reload

### Phase 7: Polish & Testing (Day 7)

1. **Error Handling**
   - Frontend error messages
   - Backend validation

2. **Styling**
   - Make it look professional
   - Responsive design

3. **Testing**
   - Test all API endpoints
   - Test swap logic thoroughly

4. **Documentation**
   - Complete README.md
   - API documentation

---

## Detailed Implementation Steps

### Step 1: Create Project Structure

```bash
# Create main folder
mkdir slotswapper
cd slotswapper

# Initialize Git
git init

# Create backend and frontend folders
mkdir backend frontend
```

### Step 2: Backend Setup

```bash
cd backend
npm init -y

# Install dependencies
npm install express mongoose cors dotenv jsonwebtoken bcryptjs
npm install --save-dev nodemon
```

### Step 3: Frontend Setup

```bash
cd ../frontend
npx create-react-app . --template typescript

# Install additional dependencies
npm install react-router-dom axios
```

### Step 4: Environment Variables

Backend `.env` file:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

Frontend `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get current user's events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `PUT /api/events/:id/status` - Change event status

### Swaps
- `GET /api/swappable-slots` - Get all swappable slots from other users
- `POST /api/swap-request` - Create swap request
- `GET /api/swap-requests` - Get user's swap requests (incoming & outgoing)
- `POST /api/swap-response/:requestId` - Accept/Reject swap

---

## Key Challenges & Solutions

1. **Swap Transaction Logic**
   - Ensure atomic operations (both slots update together)
   - Handle edge cases (slot deleted before swap completes)

2. **State Management**
   - Use React Context for global auth state
   - Refresh data after mutations

3. **Date/Time Handling**
   - Use ISO 8601 format for timestamps
   - Consider timezone handling

---

## Next Steps

Once you understand this plan, we'll start building:
1. Project structure
2. Backend server setup
3. Database models
4. Authentication system
5. And continue step by step...

---

## Tips for Beginners

1. **Test as you go**: Test each endpoint with Postman before building frontend
2. **Console logs**: Use console.log() liberally to debug
3. **Error handling**: Always add try-catch blocks
4. **Read documentation**: React docs, Express docs are your friends
5. **Ask questions**: If stuck, research or ask for help

