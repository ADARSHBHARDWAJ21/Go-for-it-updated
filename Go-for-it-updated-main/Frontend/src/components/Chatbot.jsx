import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, X } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your travel assistant. You can ask me about booking flights, hotels, or how to use the AI Trip Planner.",
      isBot: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot thinking and response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        isBot: true,
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputValue("");
  };

  // --- UPDATED AND EXPANDED CHATBOT LOGIC ---
  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Greeting
    if (input.includes("hello") || input.includes("hi")) {
        return "Hello there! How can I assist with your travel plans today?";
    }

    // AI Trip Planner
    if (input.includes("plan a trip") || input.includes("plan trip") || input.includes("planner") || input.includes("itinerary")) {
        return "The AI Trip Planner is my specialty! Just go to the 'Plan a Trip' tab, fill in your destination, dates, and preferences, and I'll generate a custom itinerary for you.";
    }

    // Flight Booking
    if (input.includes("flight") || input.includes("plane") || input.includes("ticket")) {
        return "You can book flights by clicking the 'Book Flight' button on the homepage or dashboard. Just enter your departure and destination cities to get started!";
    }

    // Hotel Booking
    if (input.includes("hotel") || input.includes("stay") || input.includes("accommodation")) {
        return "Finding a hotel is easy! Navigate to the 'Find Hotel' section, enter your destination and dates, and you'll see a list of great options.";
    }

    // Pricing and Membership
    if (input.includes("price") || input.includes("cost") || input.includes("membership")) {
        return "We have various travel packages! For full benefits, check out our 'Membership' page for exclusive deals. Our AI Trip Planner can also help you create a trip within a specific budget.";
    }
    
    // Destinations
    if (input.includes("destination") || input.includes("place to go")) {
      return "We offer amazing destinations like Kerala, Rajasthan, Himachal, and Goa! You can see featured packages under the 'Incredible India' section on the homepage.";
    }

    // Default Fallback Response
    return "I can help with flights, hotels, the AI trip planner, and membership details. What would you like to know more about?";
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-hero hover:opacity-90 animate-glow"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 z-50 bg-gradient-card border-border/50 shadow-card flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-semibold">Travel Assistant</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col flex-1 p-4 pt-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                    }`}
                  >
                    <div className={`p-1.5 rounded-full mt-1 ${message.isBot ? 'bg-primary' : 'bg-secondary'}`}>
                      {message.isBot ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        message.isBot
                          ? 'bg-secondary text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;