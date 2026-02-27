# Gemini API Troubleshooting Guide

## Error: "Model not found for API version v1beta"

If you're seeing errors like:
- `404 Not Found: models/gemini-1.5-flash is not found for API version v1beta`
- `404 Not Found: models/gemini-pro is not found for API version v1beta`

This usually means the **Gemini API is not enabled** in your Google Cloud project.

## Solution Steps:

### 1. Enable the Gemini API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Library**
4. Search for **"Generative Language API"**
5. Click on it and press **"Enable"**

Alternatively, use this direct link:
https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

### 2. Verify API Key Permissions

1. Go to **APIs & Services** → **Credentials**
2. Find your API key (the one starting with `AIza...`)
3. Click on it to edit
4. Under **API restrictions**, make sure:
   - Either "Don't restrict key" is selected, OR
   - "Restrict key" is selected AND "Generative Language API" is in the allowed list

### 3. Wait a Few Minutes

After enabling the API, wait 2-5 minutes for the changes to propagate.

### 4. Restart Your Server

```bash
# Stop the server (Ctrl+C)
# Then restart
npm start
```

## Alternative: Use a Different API Key

If the above doesn't work:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Update your `.env` file:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```
4. Restart the server

## Model Availability

The system will automatically try these models in order:
1. `gemini-1.5-flash` (fastest, recommended)
2. `gemini-1.5-pro` (most capable)
3. `gemini-pro` (legacy, most stable)

If one model fails, the system automatically tries the next one.

## Check Your API Key Status

You can verify your API key works by visiting:
https://aistudio.google.com/apikey

If you see your key listed there, it should work once the API is enabled.

## Still Having Issues?

1. **Check API Quotas**: Make sure you haven't exceeded your quota
2. **Verify Billing**: Some APIs require a billing account (though Gemini has a free tier)
3. **Check Console Logs**: Look for more specific error messages
4. **Try Mock Data**: The system will automatically use mock data if AI fails, so your app will still work

## Fallback Behavior

Even if the AI API fails, your application will:
- ✅ Continue working normally
- ✅ Generate itineraries using mock data
- ✅ Show clear error messages in the console
- ✅ Automatically retry with different models

This ensures your users always get itineraries, even if the AI service is temporarily unavailable.

