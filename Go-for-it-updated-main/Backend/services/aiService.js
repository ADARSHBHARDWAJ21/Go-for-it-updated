// Backend/services/aiService.js — Gemini API with REST API Fallback

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require("node-fetch");

class AIService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        // Try these models in order - updated with more recent model names
        this.fallbackModels = [
            'gemini-1.5-pro',
            'gemini-1.5-flash', 
            'gemini-pro',
            'gemini-2.0-flash-exp',
            'models/gemini-1.5-pro',
            'models/gemini-1.5-flash',
            'models/gemini-pro'
        ];
        this.modelName = process.env.GEMINI_MODEL || this.fallbackModels[0];

        if (!this.apiKey) {
            console.error("❌ GEMINI_API_KEY missing in environment variables");
            console.error("   Please set GEMINI_API_KEY in your .env file or Render environment variables");
            this.genAI = null;
        } else {
            console.log("✅ GEMINI_API_KEY found");
            try {
                this.genAI = new GoogleGenerativeAI(this.apiKey);
                console.log("✅ Gemini AI client initialized");
            } catch (err) {
                console.error("❌ Error initializing Gemini AI:", err.message);
                this.genAI = null;
            }
        }
    }

    // List available models using REST API and filter for generateContent support
    async listAvailableModels() {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models?key=${this.apiKey}`
            );
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const status = response.status;
                
                if (status === 403 || status === 401) {
                    console.error("❌ API key authentication failed. Check your GEMINI_API_KEY.");
                    throw new Error("API key is invalid or doesn't have permission to list models");
                } else if (status === 404) {
                    console.error("❌ Generative Language API not found. Enable it in Google Cloud Console.");
                    throw new Error("Generative Language API is not enabled for your project");
                } else {
                    console.error(`❌ Error fetching models list (${status}):`, errorData);
                    return [];
                }
            }
            
            const data = await response.json();
            
            if (data.models && Array.isArray(data.models)) {
                // Filter for Gemini models that support generateContent
                const supportedModels = data.models
                    .filter(model => {
                        const name = model.name || '';
                        const supportsGenerateContent = model.supportedGenerationMethods && 
                            model.supportedGenerationMethods.includes('generateContent');
                        return name.includes('gemini') && supportsGenerateContent;
                    })
                    .map(model => {
                        // Return both full name and short name
                        const fullName = model.name;
                        const shortName = fullName.replace(/^models\//, '');
                        return { fullName, shortName };
                    });
                
                const modelNames = supportedModels.map(m => m.shortName);
                console.log("📋 Available Gemini models with generateContent support:", modelNames);
                
                if (supportedModels.length === 0) {
                    const allGeminiModels = data.models
                        .filter(m => m.name && m.name.includes('gemini'))
                        .map(m => m.name);
                    console.log("⚠️ Found Gemini models but none support generateContent:", allGeminiModels);
                }
                
                return supportedModels;
            }
            return [];
        } catch (error) {
            console.error("❌ Error listing models:", error.message);
            return [];
        }
    }

    // Generate content using REST API directly (v1 endpoint)
    async generateContentViaREST(modelName, prompt) {
        // Clean model name (remove 'models/' prefix if present)
        const cleanModelName = modelName.replace(/^models\//, '');
        const url = `https://generativelanguage.googleapis.com/v1/models/${cleanModelName}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        }
        
        throw new Error("Invalid response format from API");
    }

    // Parse AI response - extract JSON from text
    parseItineraryResponse(text) {
        try {
            // Try to extract JSON from markdown code blocks if present
            const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
            }

            // Try to find JSON object in the text
            const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
            if (jsonObjectMatch) {
                return JSON.parse(jsonObjectMatch[0]);
            }

            // If no JSON found, return as text (fallback)
            console.warn("⚠️ Could not parse JSON from AI response, returning as text");
            return text;
        } catch (error) {
            console.error("❌ Error parsing JSON response:", error.message);
            console.log("Raw response:", text.substring(0, 500));
            // Return as text if parsing fails
            return text;
        }
    }

    // Generate a realistic, detailed itinerary with fallback support
    async generateItinerary(tripDetails) {
        // Validate API key first
        if (!this.apiKey) {
            throw new Error(
                'GEMINI_API_KEY is missing. Please add it to your .env file.\n\n' +
                'To fix this:\n' +
                '1. Get an API key from https://aistudio.google.com/apikey\n' +
                '2. Add GEMINI_API_KEY=your_key_here to Backend/.env\n' +
                '3. Restart your server'
            );
        }

        // Validate that genAI is initialized
        if (!this.genAI) {
            throw new Error(
                'Failed to initialize Gemini AI. Please check your API key.\n\n' +
                'To fix this:\n' +
                '1. Verify your API key at https://aistudio.google.com/apikey\n' +
                '2. Make sure GEMINI_API_KEY in .env is correct\n' +
                '3. Restart your server'
            );
        }

        const prompt = this.buildPrompt(tripDetails);
        
        // First, get the actual available models from the API
        console.log("🔍 Checking available models from API...");
        let availableModels = [];
        let listModelsError = null;
        
        try {
            availableModels = await this.listAvailableModels();
        } catch (error) {
            // If ListModels fails with auth/permission error, throw immediately
            listModelsError = error;
            if (error.message.includes('API key') || error.message.includes('not enabled')) {
                throw new Error(
                    `Cannot access Gemini API: ${error.message}\n\n` +
                    `Please:\n` +
                    `1. Verify your API key at https://aistudio.google.com/apikey\n` +
                    `2. Enable Generative Language API: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n` +
                    `3. Check API key restrictions allow "Generative Language API"\n` +
                    `4. Wait 2-5 minutes after enabling, then restart your server`
                );
            }
            // Otherwise, continue with fallback models
            console.log("⚠️ Could not fetch available models, will try common model names...");
        }
        
        // Use ONLY models that are actually available from the API
        let modelsToTry = [];
        
        if (availableModels.length > 0) {
            // Use the models returned from ListModels API
            modelsToTry = availableModels.map(m => m.shortName);
            console.log(`✅ Found ${modelsToTry.length} available model(s) to try: ${modelsToTry.join(', ')}`);
        } else {
            // If ListModels returned empty or failed, try common model names as fallback
            console.log("⚠️ No models found in API response, trying common model names as fallback...");
            modelsToTry = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'];
        }

        if (modelsToTry.length === 0) {
            throw new Error(
                "No Gemini models are available for your API key. " +
                "Please verify:\n" +
                "1. Your API key is valid at https://aistudio.google.com/apikey\n" +
                "2. Generative Language API is enabled in Google Cloud Console\n" +
                "3. Your API key has access to Gemini models"
            );
        }

        let lastError = null;

        // Try SDK first, then REST API for each model
        for (let i = 0; i < modelsToTry.length; i++) {
            const modelName = modelsToTry[i];
            // Clean model name (should already be clean from listAvailableModels, but just in case)
            const cleanModelName = modelName.replace(/^models\//, '');
            
            // Try SDK first
            try {
                console.log(`🔄 [${i + 1}/${modelsToTry.length}] Attempting with SDK - model: ${cleanModelName}`);
                
                const model = this.genAI.getGenerativeModel({
                    model: cleanModelName
                });

                const result = await model.generateContent(prompt);
                const text = await result.response.text();

                console.log(`✅ Successfully generated itinerary using SDK model: ${cleanModelName}`);

                // Parse JSON response
                const parsedItinerary = this.parseItineraryResponse(text);

                return {
                    success: true,
                    itinerary: parsedItinerary,
                    modelUsed: cleanModelName,
                    method: 'SDK'
                };
            } catch (sdkError) {
                console.log(`⚠️ SDK failed for ${cleanModelName}, trying REST API...`);
                
                // If SDK fails, try REST API
                try {
                    console.log(`🔄 [${i + 1}/${modelsToTry.length}] Attempting with REST API - model: ${cleanModelName}`);
                    const text = await this.generateContentViaREST(cleanModelName, prompt);
                    
                    console.log(`✅ Successfully generated itinerary using REST API model: ${cleanModelName}`);

                    // Parse JSON response
                    const parsedItinerary = this.parseItineraryResponse(text);

                    return {
                        success: true,
                        itinerary: parsedItinerary,
                        modelUsed: cleanModelName,
                        method: 'REST'
                    };
                } catch (restError) {
                    console.error(`❌ Both SDK and REST failed for ${cleanModelName}`);
                    console.error(`   SDK Error: ${sdkError.message.substring(0, 200)}...`);
                    console.error(`   REST Error: ${restError.message.substring(0, 200)}...`);
                    lastError = restError;
                    
                    // Continue to next model if available
                    if (i < modelsToTry.length - 1) {
                        console.log(`🔄 Trying next model...`);
                        continue;
                    }
                }
            }
        }

        // If all models failed, provide helpful error message
        console.error("❌ All Gemini models failed.");
        
        let errorMessage = `Failed to generate itinerary after trying ${modelsToTry.length} model(s): ${modelsToTry.join(', ')}`;
        errorMessage += `\n\nThis usually means:`;
        errorMessage += `\n1. Your API key doesn't have access to Gemini models`;
        errorMessage += `\n2. Generative Language API is not enabled for your project`;
        errorMessage += `\n3. Your API key restrictions are blocking access`;
        errorMessage += `\n\nTo fix this:`;
        errorMessage += `\n1. Go to https://aistudio.google.com/apikey and verify your key`;
        errorMessage += `\n2. Enable Generative Language API: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com`;
        errorMessage += `\n3. Check API key restrictions allow "Generative Language API"`;
        errorMessage += `\n4. Wait 2-5 minutes after enabling, then restart your server`;
        
        if (lastError) {
            const errorMsg = lastError.message || String(lastError);
            // Extract the key error message
            if (errorMsg.includes('404')) {
                errorMessage += `\n\nError: Models are not found. This confirms the API is not enabled or accessible.`;
            } else if (errorMsg.includes('quota') || errorMsg.includes('429')) {
                errorMessage += `\n\nError: Quota exceeded. Please check your usage limits.`;
            } else {
                errorMessage += `\n\nLast error: ${errorMsg.substring(0, 300)}`;
            }
        }
        
        throw new Error(errorMessage);
    }

    // Build AI prompt from user trip inputs
    buildPrompt(details) {
        const {
            destination,
            dates,
            budget,
            adults,
            children,
            preferences,
            airport,
            railway,
            startDate,
            endDate
        } = details;

        // Calculate number of days and generate date array
        let numDays = 5; // default
        let startDateObj = null;
        let dateArray = [];
        
        if (startDate && endDate) {
            startDateObj = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - startDateObj);
            numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            
            // Generate array of dates for each day
            for (let i = 0; i < numDays; i++) {
                const currentDate = new Date(startDateObj);
                currentDate.setDate(startDateObj.getDate() + i);
                dateArray.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
            }
        } else if (details.duration) {
            const match = details.duration.match(/(\d+)/);
            if (match) numDays = parseInt(match[1]);
        }

        return `
You are an expert senior travel planner. Create a detailed, day-by-day itinerary in JSON format.

Destination: ${destination}
Travel Dates: ${dates || (startDate && endDate ? `${startDate} to ${endDate}` : 'Not specified')}
Budget Range: ${budget}
Travellers: ${adults} adults, ${children} children
Nearest Airport: ${airport || 'Not specified'}
Nearest Railway Station: ${railway || 'Not specified'}
Traveler Preferences: ${preferences || 'None specified'}
Number of Days: ${numDays}

IMPORTANT: You MUST respond with ONLY valid JSON in this exact format (no markdown, no code blocks, just pure JSON):

{
  "destination": "${destination}",
  "duration": "${numDays} days",
  "budget": "${budget}",
  "startDate": "${startDate || ''}",
  "endDate": "${endDate || ''}",
  "days": [
    {
      "day": 1,
      "date": "${dateArray[0] || ''}",
      "city": "${destination}",
      "activities": [
        {
          "time": "9:00 AM",
          "title": "Activity name",
          "type": "activity",
          "location": "Location name",
          "duration": "2 hours",
          "notes": "Brief description or notes"
        }
      ],
      "alternatives": [
        {
          "title": "Alternative activity name",
          "type": "activity"
        }
      ]
    }
  ]
}

Requirements:
- Generate exactly ${numDays} days in the "days" array
${dateArray.length > 0 ? `- Assign dates to each day: ${dateArray.map((d, i) => `Day ${i + 1} = ${d}`).join(', ')}` : '- Include date field for each day (YYYY-MM-DD format)'}
- Each day must have at least 3-5 activities covering morning, afternoon, and evening
- Activity types can be: "activity", "food", "transport", "accommodation", "sightseeing"
- Include realistic times (e.g., "9:00 AM", "2:30 PM", "7:00 PM")
- Include "duration" field for each activity (e.g., "2 hours", "1.5 hours", "45 minutes")
- Use real places, restaurants, and attractions in ${destination}
- Provide specific locations (neighborhoods, areas, or landmarks)
- Include 2-3 alternatives per day
- Make activities realistic and sequential (consider travel time between locations)
- Keep notes brief but informative

Return ONLY the JSON object, nothing else.
        `;
    }
}

module.exports = new AIService();
