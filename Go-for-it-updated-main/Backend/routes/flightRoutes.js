const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// POST /api/flights/search
router.post('/search', async (req, res) => {
  try {
    const { from, to, departure, adults = 1, children = 0, infants = 0, travelClass = 'ECONOMY' } = req.body || {};
    const results = await aiService.searchFlights({ from, to, departure, adults, children, infants, travelClass });
    res.json(results);
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch flights' });
  }
});

module.exports = router;


