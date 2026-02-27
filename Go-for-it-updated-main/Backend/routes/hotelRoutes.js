const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Proxy endpoint to search hotels via TripAdvisor
router.get('/search', async (req, res) => {
  try {
    const { destination = '', checkin = '', checkout = '', adults = '2' } = req.query;
    const results = await aiService.searchHotels({ destination, checkin, checkout, adults: Number(adults) });
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch hotels' });
  }
});

module.exports = router;


