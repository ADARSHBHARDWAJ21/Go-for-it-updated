# Render Deployment Setup Guide

## Fixing the 500 Error: GEMINI_API_KEY Configuration

If you're seeing a 500 error when generating itineraries, it's likely because the `GEMINI_API_KEY` is not configured in your Render deployment.

## Steps to Fix:

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Select or create a Google Cloud project
5. Copy the generated API key (starts with `AIza...`)

### 2. Add API Key to Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service (`go-for-it-backend-1`)
3. Click on **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your API key from step 1 (paste the full key starting with `AIza...`)
6. Click **"Save Changes"**

### 3. Redeploy

After adding the environment variable, Render will automatically redeploy your service. Wait for the deployment to complete (usually 1-2 minutes).

### 4. Verify

1. Check the Render logs to see if the server starts successfully
2. Look for: `✅ GEMINI_API_KEY found` and `✅ Gemini AI client initialized`
3. Try generating an itinerary again

## Additional Environment Variables

Make sure these are also set in Render (if needed):

- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secret key for JWT tokens
- `PORT` - Usually auto-set by Render, but can be manually set

## Troubleshooting

### Still seeing 500 errors?

1. **Check Render logs**: Go to your service → Logs tab
   - Look for error messages about API keys
   - Check if the server started successfully

2. **Verify API key format**:
   - Should start with `AIza`
   - No spaces or line breaks
   - Full key copied correctly

3. **Check API key validity**:
   - Visit https://aistudio.google.com/apikey
   - Verify your key is listed and active
   - Make sure the Generative Language API is enabled

4. **Wait for propagation**:
   - After adding environment variables, wait 2-5 minutes
   - The service needs to redeploy

### Enable Generative Language API

If you get API errors:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Library**
4. Search for **"Generative Language API"**
5. Click **"Enable"**
6. Wait 2-5 minutes for changes to propagate

## Local Development

For local development, create a `.env` file in the `Backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

Then restart your local server.

