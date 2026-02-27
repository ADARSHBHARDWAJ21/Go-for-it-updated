// routes/itineraryRoutes.js — DeepSeek Version (Option A)

const express = require("express");
const {
  generateItinerary,
  generateCustomItinerary,
  regenerateItinerary
} = require("../controllers/itineraryController");

const router = express.Router();

// Generate DeepSeek AI itinerary
router.post("/generate", generateItinerary);

// Generate DeepSeek AI itinerary with customizations
router.post("/generate-custom", generateCustomItinerary);

// Regenerate itinerary using DeepSeek AI
router.post("/regenerate", regenerateItinerary);

module.exports = router;
