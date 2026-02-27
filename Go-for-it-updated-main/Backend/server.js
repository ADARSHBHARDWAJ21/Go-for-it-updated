const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const cors = require('cors');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const flightRoutes = require('./routes/flightRoutes');
const clerkWebhookRoutes = require('./routes/clerkWebhookRoutes');

// Connect to MongoDB
connectDB().catch((err) => {
  console.warn('MongoDB connection failed. Server will continue running.');
  console.warn('To fix: Update MONGO_URI in your .env file.');
});

const app = express();

// CORS MUST BE BEFORE ROUTES
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/clerk', clerkWebhookRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Auto PORT handling for Render
const PORT = process.env.PORT || 5000;

// Check critical environment variables on startup
console.log('\n📋 Environment Check:');
console.log(`   PORT: ${PORT}`);
console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing'}`);
if (!process.env.GEMINI_API_KEY) {
  console.warn('\n⚠️  WARNING: GEMINI_API_KEY is not set!');
  console.warn('   Itinerary generation will fail until this is configured.');
  console.warn('   For local development: Add GEMINI_API_KEY to Backend/.env');
  console.warn('   For Render deployment: Add GEMINI_API_KEY in Render dashboard → Environment');
  console.warn('   Get API key from: https://aistudio.google.com/apikey\n');
} else {
  console.log('   ✅ All critical environment variables are set\n');
}

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
