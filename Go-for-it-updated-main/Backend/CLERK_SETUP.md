# Clerk Authentication Setup Guide

## Overview
This application uses Clerk for authentication with support for:
- Google Sign-In
- Apple Sign-In
- Email OTP verification
- Email + Password authentication

## Frontend Setup

1. **Environment Variables**
   - The `.env` file in the Frontend folder should contain:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_Zmxvd2luZy10ZWFsLTI2LmNsZXJrLmFjY291bnRzLmRldiQ
   ```

2. **Clerk Dashboard Configuration**
   - Go to https://dashboard.clerk.com
   - Navigate to your application settings
   - Go to "User & Authentication" → "Social Connections"
   - Enable the following authentication methods:
     - ✅ **Google OAuth** (Click "Configure" and follow setup instructions)
     - ✅ **Apple OAuth** (Click "Configure" and follow setup instructions)
   - Go to "Email, Phone, Username" section
   - Enable:
     - ✅ **Email** (with OTP verification)
     - ✅ **Password** (optional, for email/password flow)
   - Make sure both Google and Apple are enabled for **Sign-up** (not just Sign-in)

## Backend Setup

1. **Environment Variables**
   - The `.env` file in the Backend folder should contain:
   ```
   CLERK_SECRET_KEY=sk_test_kWU5oVNouoQqOXqVYkItjkjlTxhxWsni6Qe9sFB1ty
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

2. **Setting Up Clerk Webhook**

   To sync user data to MongoDB when users sign up/in through Clerk:

   a. **Get Your Webhook Secret:**
      - Go to Clerk Dashboard → Webhooks
      - Click "Add Endpoint"
      - Enter your webhook URL: `http://your-domain.com/api/clerk/webhook`
        - For local development: Use a service like ngrok: `https://your-ngrok-url.ngrok.io/api/clerk/webhook`
      - Select events to listen to:
        - `user.created`
        - `user.updated`
        - `user.deleted`
      - Copy the "Signing Secret" (starts with `whsec_`)
      - Add it to your `.env` file as `CLERK_WEBHOOK_SECRET`

   b. **For Local Development:**
      ```bash
      # Install ngrok
      npm install -g ngrok
      
      # Start your backend server
      cd Backend
      npm start
      
      # In another terminal, expose your local server
      ngrok http 5000
      
      # Copy the https URL (e.g., https://abc123.ngrok.io)
      # Use this URL in Clerk webhook settings: https://abc123.ngrok.io/api/clerk/webhook
      ```

3. **MongoDB Connection**
   - Make sure your MongoDB connection string is set in `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```
   - User data will automatically sync to MongoDB when:
     - A new user signs up
     - A user updates their profile
     - A user is deleted

## How It Works

1. **User Signs Up/In:**
   - User visits `/sign-up` or `/sign-in`
   - Clerk handles authentication (Google, Apple, Email OTP, or Email/Password)
   - After successful authentication, Clerk sends a webhook to your backend

2. **Webhook Syncs to MongoDB:**
   - Backend receives webhook event
   - Verifies webhook signature for security
   - Creates/updates user record in MongoDB
   - User data is now available in your database

3. **User Data Structure in MongoDB:**
   ```javascript
   {
     clerkId: "user_xxx",
     email: "user@example.com",
     fullName: "John Doe",
     imageUrl: "https://...",
     createdAt: Date,
     updatedAt: Date
   }
   ```

## Testing

1. **Start Backend:**
   ```bash
   cd Backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Test Authentication:**
   - Visit `http://localhost:8080/sign-up`
   - Try signing up with Google, Apple, or Email
   - Check MongoDB to verify user was created

## Troubleshooting

- **Webhook not receiving events:**
  - Verify webhook URL is accessible (use ngrok for local dev)
  - Check webhook secret is correct in `.env`
  - Check Clerk dashboard webhook logs for errors

- **Users not syncing to MongoDB:**
  - Verify MongoDB connection string is correct
  - Check backend logs for webhook errors
  - Ensure webhook events are enabled in Clerk dashboard

- **Authentication not working:**
  - Verify `VITE_CLERK_PUBLISHABLE_KEY` is set in Frontend `.env`
  - Check browser console for errors
  - Verify Clerk application is active in dashboard

