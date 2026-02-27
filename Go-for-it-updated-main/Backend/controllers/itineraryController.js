// controllers/itineraryController.js — DeepSeek Version (Option A)

const aiService = require("../services/aiService");

// Generate itinerary using DeepSeek AI
exports.generateItinerary = async (req, res) => {
  try {
    const itinerary = await aiService.generateItinerary(req.body);

    return res.json({
      success: true,
      data: itinerary.itinerary
    });
  } catch (error) {
    console.error("Itinerary Generation Error:", error);
    console.error("Error stack:", error.stack);
    
    // Provide more detailed error message
    let errorMessage = error.message || "Failed to generate itinerary";
    let userMessage = "Failed to generate itinerary";
    
    // Check for specific error types
    if (errorMessage.includes('GEMINI_API_KEY is missing')) {
      userMessage = "API key is missing. Please configure GEMINI_API_KEY in your environment variables.";
    } else if (errorMessage.includes('Failed to initialize Gemini AI')) {
      userMessage = "Failed to initialize AI service. Please check your API key configuration.";
    } else if (errorMessage.includes('API key') || errorMessage.includes('not enabled')) {
      userMessage = "API key issue detected. Please verify your Gemini API key is valid and the API is enabled.";
    }
    
    return res.status(500).json({
      success: false,
      message: userMessage,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Generate itinerary with custom user changes (same AI call)
exports.generateCustomItinerary = async (req, res) => {
  try {
    const { tripDetails, customizations } = req.body;

    const itinerary = await aiService.generateItinerary({
      ...tripDetails,
      ...customizations
    });

    return res.json({
      success: true,
      data: itinerary.itinerary
    });
  } catch (error) {
    console.error("Custom Itinerary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate custom itinerary",
      error: error.message
    });
  }
};

// Regenerate itinerary with modifications
exports.regenerateItinerary = async (req, res) => {
  try {
    const itinerary = await aiService.generateItinerary(req.body);

    return res.json({
      success: true,
      data: itinerary.itinerary
    });
  } catch (error) {
    console.error("Regenerate Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to regenerate itinerary",
      error: error.message
    });
  }
};
