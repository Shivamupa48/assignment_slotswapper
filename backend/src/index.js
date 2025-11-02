const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is not set in .env file!');
  console.error('Please create a .env file in the backend folder with:');
  console.error('JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345');
  console.error('MONGODB_URI=your_mongodb_connection_string');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/swap', require('./routes/swap'));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/slotswapper';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Please check your MONGODB_URI in the .env file');
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found. Using default: mongodb://localhost:27017/slotswapper');
      console.error('If you want to use MongoDB Atlas, create .env file with:');
      console.error('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper');
    }
  });

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'SlotSwapper API is running!', 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    jwt: process.env.JWT_SECRET ? 'configured' : 'missing'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing'}`);
  if (process.env.MONGODB_URI) {
    // Hide credentials in log
    const maskedUri = MONGODB_URI.replace(/\/\/.*@/, '//***:***@');
    console.log(`🗄️  MongoDB URI: ${maskedUri}`);
  }
});

