const API_BASE_URL = 'http://localhost:5000/api';

class ItineraryService {
    async generateItinerary(tripDetails) {
        try {
            const response = await fetch(`${API_BASE_URL}/itinerary/generate`, {
               method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripDetails)
            });

            if (!response.ok) {
                let errorMessage = 'Failed to generate itinerary';
                let errorDetails = null;
                
                try {
                    const errorData = await response.json();
                    // Prioritize message, then error field, then fallback
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    errorDetails = errorData.error || errorData.details;
                    
                    // Log full error details for debugging
                    console.error('Backend error response:', {
                        message: errorData.message,
                        error: errorData.error,
                        status: response.status
                    });
                } catch (parseError) {
                    // If response is not JSON, try to get text
                    try {
                        const text = await response.text();
                        errorMessage = text || response.statusText || `Server error (${response.status})`;
                    } catch (textError) {
                        errorMessage = response.statusText || `Server error (${response.status})`;
                    }
                }
                
                // Provide more specific error messages based on status
                if (response.status === 500) {
                    // If we have a specific error message, use it; otherwise provide generic one
                    if (errorMessage === 'Failed to generate itinerary' && !errorDetails) {
                        errorMessage = 'Server error: The AI service is currently unavailable. This usually means the GEMINI_API_KEY is not configured on the server. Please contact the administrator.';
                    }
                } else if (response.status === 401 || response.status === 403) {
                    errorMessage = 'Authentication failed. Please try again.';
                } else if (response.status === 429) {
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                }
                
                // Include error details if available
                if (errorDetails && errorDetails !== errorMessage) {
                    console.error('Detailed error:', errorDetails);
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error generating itinerary:', error);
            // Re-throw with a more user-friendly message if it's a network error
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
            }
            throw error;
        }
    }

    async generateCustomItinerary(tripDetails, customizations = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/itinerary/generate-custom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...tripDetails,
                    customizations
                })
            });

            if (!response.ok) {
                let errorMessage = 'Failed to generate custom itinerary';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    errorMessage = response.statusText || `Server error (${response.status})`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error generating custom itinerary:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
            }
            throw error;
        }
    }

    async regenerateItinerary(originalItinerary, modifications = {}, customizations = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/itinerary/regenerate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    originalItinerary,
                    modifications,
                    customizations
                })
            });

            if (!response.ok) {
                let errorMessage = 'Failed to regenerate itinerary';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    errorMessage = response.statusText || `Server error (${response.status})`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error regenerating itinerary:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
            }
            throw error;
        }
    }
}

export default new ItineraryService();

