const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper to convert user to response format (convert ObjectId to string)
const toUserResponse = (user) => {
  return {
    id: user._id.toString(), // Convert MongoDB ObjectId to string
    name: user.name,
    email: user.email
  };
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and password.' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long.' 
      });
    }

    // Normalize email (lowercase and trim) to match User model
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists (with normalized email)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists.' 
      });
    }

    // Create new user (email will be normalized by model schema)
    const user = await User.create({ 
      name: name.trim(), 
      email: normalizedEmail, 
      password 
    });

    // Don't return token on signup - user must login separately
    res.status(201).json({
      message: 'User created successfully. Please login to continue.',
      user: toUserResponse(user)
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000 || error.name === 'MongoServerError') {
      return res.status(400).json({ 
        message: 'User with this email already exists.' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      message: 'Server error during signup.', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password.' 
      });
    }

    // Normalize email (lowercase and trim) to match stored format
    const normalizedEmail = email.toLowerCase().trim();

    // Find user with normalized email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password.' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password.' 
      });
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing!');
      return res.status(500).json({ 
        message: 'Server configuration error. Please contact administrator.' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: toUserResponse(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login.', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: toUserResponse(req.user)
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error.', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset user password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validation
    if (!email || !newPassword) {
      return res.status(400).json({ 
        message: 'Please provide both email and new password.' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long.' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // Always return success message (don't reveal if user exists for security)
    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return res.json({
        message: 'If an account with this email exists, password has been reset. Please login with your new password.'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password reset successfully. Please login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      message: 'Server error resetting password.', 
      error: error.message 
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ 
        message: 'Please provide both name and email.' 
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email: normalizedEmail, 
      _id: { $ne: req.user._id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email is already taken by another user.' 
      });
    }

    // Update user
    req.user.name = name.trim();
    req.user.email = normalizedEmail;
    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: toUserResponse(req.user)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error updating profile.', 
      error: error.message 
    });
  }
});

module.exports = router;

