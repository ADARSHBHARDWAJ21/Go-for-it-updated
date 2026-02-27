const mongoose = require('mongoose');
const { checkConnection } = require('../config/db');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// In-memory user store for development when MongoDB is not available
const inMemoryUsers = new Map();

// Helper to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Helper to compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // Validate request body
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }

    const { fullName, email, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required'
      });
    }

    // Check if MongoDB is connected
    const useMongoDB = checkConnection() && mongoose.connection.readyState === 1;

    if (useMongoDB) {
      // Use MongoDB
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      const user = await User.create({
        fullName,
        email,
        password,
      });

      if (user) {
        const userData = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          token: generateToken(user._id),
        };
        return res.status(201).json(userData);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid user data'
        });
      }
    } else {
      // Use in-memory store (development mode)
      console.log('[User Controller] Using in-memory storage (MongoDB not available)');
      
      if (inMemoryUsers.has(email.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      const hashedPassword = await hashPassword(password);
      const userId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const userData = {
        _id: userId,
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
      };

      inMemoryUsers.set(email.toLowerCase(), userData);

      const responseData = {
        _id: userId,
        fullName,
        email: email.toLowerCase(),
        token: generateToken(userId),
      };

      return res.status(201).json(responseData);
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError' || error.message.includes('buffering timed out')) {
      // Fallback to in-memory store
      try {
        const { fullName, email, password } = req.body;
        if (inMemoryUsers.has(email.toLowerCase())) {
          return res.status(400).json({
            success: false,
            message: 'User already exists'
          });
        }
        const hashedPassword = await hashPassword(password);
        const userId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        inMemoryUsers.set(email.toLowerCase(), {
          _id: userId,
          fullName,
          email: email.toLowerCase(),
          password: hashedPassword,
        });
        return res.status(201).json({
          _id: userId,
          fullName,
          email: email.toLowerCase(),
          token: generateToken(userId),
        });
      } catch (fallbackError) {
        return res.status(500).json({
          success: false,
          message: 'Failed to register user'
        });
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register user'
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    // Validate request body
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if MongoDB is connected
    const useMongoDB = checkConnection() && mongoose.connection.readyState === 1;

    if (useMongoDB) {
      // Use MongoDB
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        const userData = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          token: generateToken(user._id),
        };
        return res.json(userData);
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    } else {
      // Use in-memory store (development mode)
      console.log('[User Controller] Using in-memory storage (MongoDB not available)');
      
      const user = inMemoryUsers.get(email.toLowerCase());
      
      if (user && (await comparePassword(password, user.password))) {
        const userData = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          token: generateToken(user._id),
        };
        return res.json(userData);
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    }
  } catch (error) {
    console.error('Error in authUser:', error);
    
    // Check if it's a MongoDB connection error - fallback to in-memory
    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError' || error.message.includes('buffering timed out')) {
      try {
        const { email, password } = req.body;
        const user = inMemoryUsers.get(email.toLowerCase());
        if (user && (await comparePassword(password, user.password))) {
          return res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            token: generateToken(user._id),
          });
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
      } catch (fallbackError) {
        return res.status(500).json({
          success: false,
          message: 'Failed to authenticate user'
        });
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to authenticate user'
    });
  }
};

module.exports = { registerUser, authUser };