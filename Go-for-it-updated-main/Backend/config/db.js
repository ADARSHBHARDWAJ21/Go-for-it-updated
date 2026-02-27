const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('MONGO_URI not set. Skipping MongoDB connection.');
    isConnected = false;
    return null;
  }

  // Check if URI contains placeholder values
  if (uri.includes('<username>') || uri.includes('<password>') || 
      uri.includes('<cluster-url>') || uri.includes('<database>')) {
    console.warn('MONGO_URI contains placeholder values. Please update your .env file with actual MongoDB credentials.');
    console.warn('Skipping MongoDB connection. Some features may not work without a database connection.');
    isConnected = false;
    return null;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Server will continue running, but database features will not be available.');
    isConnected = false;
    // Don't throw error, allow server to continue
    return null;
  }
};

// Helper function to check connection status
const checkConnection = () => {
  return mongoose.connection.readyState === 1 || isConnected;
};

module.exports = { connectDB, checkConnection };