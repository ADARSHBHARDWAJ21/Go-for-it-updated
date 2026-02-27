const User = require('../models/userModel');
const { Webhook } = require('svix');
const mongoose = require('mongoose');

const handleClerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // Get the Svix headers for verification
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error occurred -- no svix headers' });
  }

  // Get the body - req.body is already a Buffer from express.raw()
  const payload = req.body.toString();

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ error: 'Error occurred -- verification failed' });
  }

  // Handle the webhook
  const eventType = evt.type;
  const eventData = evt.data;
  const id = eventData.id;
  const email_addresses = eventData.email_addresses || [];
  const first_name = eventData.first_name || '';
  const last_name = eventData.last_name || '';
  const image_url = eventData.image_url || '';
  const created_at = eventData.created_at;
  const updated_at = eventData.updated_at;

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB not connected. User data will not be saved.');
      return res.status(200).json({ received: true, message: 'Webhook received but MongoDB not connected' });
    }

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const email = email_addresses?.[0]?.email_address || '';
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || email.split('@')[0] || 'User';

      // Find or create user
      let user = await User.findOne({ clerkId: id });

      if (user) {
        // Update existing user
        user.email = email;
        user.fullName = fullName;
        user.imageUrl = image_url || user.imageUrl;
        user.updatedAt = new Date(updated_at * 1000);
        await user.save();
        console.log(`User updated in MongoDB: ${email}`);
      } else {
        // Create new user
        user = await User.create({
          clerkId: id,
          email: email,
          fullName: fullName,
          imageUrl: image_url || '',
          createdAt: new Date(created_at * 1000),
          updatedAt: new Date(updated_at * 1000),
        });
        console.log(`User created in MongoDB: ${email}`);
      }

      return res.status(200).json({ 
        received: true, 
        message: `User ${eventType === 'user.created' ? 'created' : 'updated'} successfully`,
        userId: user._id 
      });
    } else if (eventType === 'user.deleted') {
      // Delete user from MongoDB
      const user = await User.findOneAndDelete({ clerkId: id });
      if (user) {
        console.log(`User deleted from MongoDB: ${id}`);
        return res.status(200).json({ received: true, message: 'User deleted successfully' });
      } else {
        return res.status(200).json({ received: true, message: 'User not found in database' });
      }
    }

    return res.status(200).json({ received: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ error: 'Error processing webhook', details: error.message });
  }
};

module.exports = { handleClerkWebhook };

