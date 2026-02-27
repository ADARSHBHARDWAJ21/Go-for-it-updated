# Enabling Google and Apple OAuth in Clerk Dashboard

## Quick Setup Guide

### Step 1: Enable Google OAuth

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **"User & Authentication"** → **"Social Connections"**
4. Find **"Google"** and click **"Configure"**
5. You'll need to:
   - Create a Google OAuth 2.0 Client ID in [Google Cloud Console](https://console.cloud.google.com/)
   - Add the Client ID and Client Secret to Clerk
   - Add authorized redirect URIs:
     - `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
     - For production: `https://your-domain.com/v1/oauth_callback`
6. Enable **"Available for sign-up"** toggle
7. Save the configuration

### Step 2: Enable Apple OAuth

1. In the same **"Social Connections"** section
2. Find **"Apple"** and click **"Configure"**
3. You'll need to:
   - Create an App ID in [Apple Developer Portal](https://developer.apple.com/)
   - Create a Service ID
   - Configure the Sign in with Apple service
   - Add the Service ID, Team ID, Key ID, and Private Key to Clerk
4. Enable **"Available for sign-up"** toggle
5. Save the configuration

### Step 3: Verify Settings

Make sure both Google and Apple have:
- ✅ **Enabled** toggle is ON
- ✅ **Available for sign-up** toggle is ON (this is important!)
- ✅ Proper credentials configured

### Step 4: Test

1. Visit your sign-up page: `http://localhost:8080/sign-up`
2. You should see:
   - Google button
   - Apple button
   - Email option
3. Try signing up with Google or Apple
4. After successful sign-up, check MongoDB to verify user was created

## Important Notes

- **Sign-up vs Sign-in**: Make sure to enable "Available for sign-up" not just "Available for sign-in"
- **Development Mode**: In development, Clerk uses test mode. OAuth providers may have restrictions
- **Production**: For production, you'll need to configure production OAuth credentials
- **Redirect URIs**: Always add the correct redirect URIs in your OAuth provider settings

## Troubleshooting

**Google/Apple buttons not showing:**
- Check that both are enabled in Clerk Dashboard
- Verify "Available for sign-up" is enabled
- Clear browser cache and reload
- Check browser console for errors

**OAuth flow fails:**
- Verify redirect URIs are correct in OAuth provider settings
- Check that credentials are correctly entered in Clerk
- Ensure your app is in the correct environment (development/production)

