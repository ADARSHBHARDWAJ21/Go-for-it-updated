# Gemini API Key Setup Guide

## Issue: API Key Expired or Invalid

If you're seeing errors like:
- "API key expired. Please renew the API key."
- "API_KEY_INVALID"
- "400 Bad Request"

Your Gemini API key needs to be renewed or replaced.

## How to Get a New API Key

1. **Visit Google AI Studio:**
   - Go to: https://aistudio.google.com/apikey
   - Sign in with your Google account

2. **Create a New API Key:**
   - Click "Create API Key" or "Get API Key"
   - Select or create a Google Cloud project
   - Copy the generated API key (starts with `AIza...`)

3. **Update Your .env File:**
   - Open `Backend/.env` file (create it if it doesn't exist)
   - Add or update this line:
     ```
     GEMINI_API_KEY=your_new_api_key_here
     ```
   - Replace `your_new_api_key_here` with the key you copied

4. **Restart Your Server:**
   - Stop the backend server (Ctrl+C)
   - Start it again: `npm start`

## Example .env File

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=AIzaSy...your_new_key_here
GEMINI_MODEL=gemini-1.5-flash
```

## Important Notes

- **API keys are free** for development use (with rate limits)
- **Keep your API key secret** - never commit it to version control
- The `.env` file is already in `.gitignore`
- If the API key fails, the system will automatically use mock data (so the app still works)

## Troubleshooting

### "API key expired" error
- Get a new key from https://aistudio.google.com/apikey
- Make sure there are no extra spaces in your .env file
- Restart the server after updating

### "API key invalid" error
- Verify the key starts with `AIza`
- Check for typos in the .env file
- Ensure the key is on a single line (no line breaks)

### Server not picking up changes
- Make sure the .env file is in the `Backend` folder
- Restart the server completely
- Check that dotenv is loading: Look for `[dotenv@...] injecting env` in console

## Fallback Behavior

If the API key is invalid or expired, the system will:
- ✅ Still generate itineraries using mock data
- ✅ Show clear error messages in the console
- ✅ Continue working for users (they'll get mock itineraries)

This ensures your application always works, even if the AI service is unavailable.

