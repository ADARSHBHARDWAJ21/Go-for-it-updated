# AI-Powered Itinerary Generation Integration

## Overview
This project now includes AI-powered itinerary generation using Google's Gemini API. The system provides intelligent, personalized travel itineraries with full customization options and fallback mechanisms.

## Features Implemented

### 1. Backend AI Integration
- **Gemini API Integration**: Uses Google's Gemini API for intelligent itinerary generation
- **Fallback Mechanism**: Automatically falls back to mock data if AI API fails
- **RESTful Endpoints**: Three main endpoints for different use cases
- **Error Handling**: Comprehensive error handling and user-friendly messages

### 2. Frontend Integration
- **Seamless Integration**: Updated TripPlannerSection to use AI-generated itineraries
- **Customization Support**: Full support for existing customization options
- **Real-time Generation**: Live itinerary generation with loading states
- **Fallback UI**: Graceful handling when AI is unavailable

## API Endpoints

### 1. Generate Basic Itinerary
```
POST /api/itinerary/generate
```
**Request Body:**
```json
{
  "destination": "Goa",
  "duration": "5 days",
  "budget": "₹25,000",
  "adults": 2,
  "children": 1,
  "preferences": "Beach activities and water sports",
  "startDate": "2024-02-01",
  "endDate": "2024-02-05"
}
```

### 2. Generate Custom Itinerary
```
POST /api/itinerary/generate-custom
```
**Request Body:**
```json
{
  "destination": "Goa",
  "duration": "5 days",
  "budget": "₹25,000",
  "adults": 2,
  "children": 1,
  "preferences": "Beach activities and water sports",
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "customizations": {
    "specificActivities": ["Scuba diving", "Beach volleyball"],
    "dietaryRestrictions": "Vegetarian",
    "mobilityNeeds": "Wheelchair accessible",
    "interests": ["Photography", "Local culture"]
  }
}
```

### 3. Regenerate Itinerary
```
POST /api/itinerary/regenerate
```
**Request Body:**
```json
{
  "originalItinerary": { /* existing itinerary object */ },
  "modifications": {
    "preferences": "Updated preferences",
    "startDate": "2024-02-10",
    "endDate": "2024-02-15"
  },
  "customizations": {
    "specificActivities": ["New activities"],
    "dietaryRestrictions": "Updated restrictions"
  }
}
```

## AI Features

### 1. Intelligent Itinerary Generation
- **Context-Aware**: Considers destination, duration, budget, and traveler count
- **Personalized**: Adapts to user preferences and special requirements
- **Comprehensive**: Includes activities, dining, transportation, and accommodation
- **Realistic**: Provides practical timing and cost estimates

### 2. Customization Options
- **Specific Activities**: Request particular activities or attractions
- **Dietary Restrictions**: Accommodate special dietary needs
- **Mobility Needs**: Ensure accessibility requirements are met
- **Interests**: Focus on specific interests (photography, culture, adventure, etc.)

### 3. Smart Fallback
- **Mock Data Generation**: Provides realistic itineraries when AI is unavailable
- **Consistent Structure**: Maintains the same data structure as AI-generated content
- **Seamless Experience**: Users don't notice the difference

## File Structure

```
Backend/
├── services/
│   └── aiService.js          # AI integration service
├── controllers/
│   └── itineraryController.js # API controllers
├── routes/
│   └── itineraryRoutes.js    # API routes
└── server.js                 # Updated with new routes

expo-main/src/
├── services/
│   └── itineraryService.js   # Frontend API service
└── components/
    └── TripPlannerSection.jsx # Updated with AI integration
```

## Setup Instructions

### 1. Backend Setup
```bash
cd Backend
npm install
npm start
```

### 2. Frontend Setup
```bash
cd expo-main
npm install
npm run dev
```

### 3. API Key Configuration
The Gemini API key is currently hardcoded in `Backend/services/aiService.js`. For production, move it to environment variables:

```javascript
// In aiService.js
this.apiKey = process.env.GEMINI_API_KEY || 'AIzaSyANM_kTO12zyhB6-FoST3jyEVyg6OcRUco';
```

## Usage Examples

### 1. Basic Itinerary Generation
```javascript
const tripDetails = {
  destination: "Rajasthan",
  duration: "7 days",
  budget: "₹35,000",
  adults: 2,
  children: 0,
  preferences: "Cultural heritage and palaces",
  startDate: "2024-03-01",
  endDate: "2024-03-07"
};

const itinerary = await itineraryService.generateItinerary(tripDetails);
```

### 2. Custom Itinerary Generation
```javascript
const customizations = {
  specificActivities: ["Desert safari", "Palace tour", "Camel ride"],
  dietaryRestrictions: "Vegetarian",
  mobilityNeeds: "No stairs",
  interests: ["Photography", "History", "Architecture"]
};

const customItinerary = await itineraryService.generateCustomItinerary(tripDetails, customizations);
```

### 3. Regenerate with Modifications
```javascript
const modifications = {
  preferences: "More adventure activities",
  startDate: "2024-04-01",
  endDate: "2024-04-07"
};

const newItinerary = await itineraryService.regenerateItinerary(originalItinerary, modifications, customizations);
```

## Response Structure

The AI generates itineraries with the following structure:

```json
{
  "destination": "Goa",
  "duration": "5 days",
  "budget": "₹25,000",
  "totalTravelers": 3,
  "days": [
    {
      "day": 1,
      "date": "2024-02-01",
      "city": "Goa",
      "activities": [
        {
          "time": "10:00 AM",
          "title": "Visit Basilica of Bom Jesus",
          "type": "sightseeing",
          "location": "Old Goa",
          "description": "Explore this UNESCO World Heritage site",
          "duration": "2 hours",
          "cost": "₹500"
        }
      ],
      "alternatives": [
        {
          "title": "Beach relaxation",
          "type": "activity",
          "description": "Spend time at Calangute Beach"
        }
      ],
      "dailyBudget": "₹1,700",
      "highlights": ["Cultural sites", "Beach time", "Local cuisine"]
    }
  ],
  "transportation": {
    "flights": { /* flight options */ },
    "trains": [ /* train options */ ]
  },
  "accommodation": {
    "budget": [ /* budget hotels */ ],
    "midRange": [ /* mid-range hotels */ ],
    "luxury": [ /* luxury hotels */ ]
  },
  "totalEstimatedCost": "₹12,500",
  "tips": ["Travel tips"],
  "emergencyContacts": { /* emergency numbers */ }
}
```

## Error Handling

The system includes comprehensive error handling:

1. **API Failures**: Automatically falls back to mock data
2. **Validation Errors**: Clear error messages for invalid inputs
3. **Network Issues**: Graceful handling of connection problems
4. **Rate Limiting**: Proper handling of API rate limits

## Future Enhancements

1. **Real-time Pricing**: Integration with actual flight/hotel APIs
2. **Weather Integration**: Consider weather conditions in itinerary planning
3. **User Preferences Learning**: Learn from user modifications
4. **Multi-language Support**: Generate itineraries in different languages
5. **Offline Mode**: Cache generated itineraries for offline access

## Troubleshooting

### Common Issues

1. **AI API Not Working**: The system automatically falls back to mock data
2. **CORS Issues**: Ensure backend CORS is properly configured
3. **API Key Issues**: Verify the Gemini API key is valid and has proper permissions

### Debug Mode

Enable debug logging by setting:
```javascript
console.log('AI Debug Mode Enabled');
```

## Support

For issues or questions regarding the AI integration:
1. Check the console logs for error messages
2. Verify API key validity
3. Test with the fallback mock data
4. Check network connectivity

The system is designed to be robust and provide a seamless experience even when AI services are unavailable.
