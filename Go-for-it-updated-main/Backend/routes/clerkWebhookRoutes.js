const express = require('express');
const router = express.Router();
const { handleClerkWebhook } = require('../controllers/clerkWebhookController');

// Clerk webhook endpoint - must be a POST route
// Note: This route uses express.raw() to get the raw body for signature verification
// DO NOT use express.json() middleware here
router.post('/webhook', express.raw({ type: 'application/json' }), handleClerkWebhook);

module.exports = router;

