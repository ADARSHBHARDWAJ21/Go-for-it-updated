// src/components/LocationsPreview.jsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Send } from "lucide-react";
//import keralaBBackwaters from "@/assets/kerala-backwaters.jpg";
import rajasthanDesert from "@/assets/rajasthan-desert.jpg";
import himachalMountains from "@/assets/himachal-mountains.jpg";
import goaBeach from "@/assets/goa-beach.jpg";
import keralaBackwaters from "@/assets/kerala-backwaters.jpg";

// Updated locations array with unique IDs for routing
const locations = [
  {
    id: "rajasthan-desert-safari",
    name: "Rajasthan Desert Safari",
    location: "Jaisalmer, Rajasthan",
    rating: 4.7,
    image: rajasthanDesert,
    price: "₹12,499",
  },
  {
    id: "goa-beach-paradise",
    name: "Beach Paradise",
    location: "Goa",
    rating: 4.6,
    image: goaBeach,
    price: "₹9,999",
  },
  {
    id: "kerala-backwaters",
    name: "Kerala Backwaters",
    location: "Alleppey, Kerala",
    rating: 4.8,
    image: keralaBackwaters,
    price: "₹15,999",
  },
  {
    id: "himachal-mountain-retreat",
    name: "Himachal Mountain Retreat",
    location: "Manali, Himachal Pradesh",
    rating: 4.9,
    image: himachalMountains,
    price: "₹18,999",
  },
];

const LocationsPreview = () => {
  const navigate = useNavigate();

  // Updated function to handle the button click
  const handleBookNow = (locationId) => {
    // Navigate to the dynamic package details page
    navigate(`/package/${locationId}`);
  };

  return (
    <section id="locations" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Incredible <span className="gradient-text">India</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the diverse beauty of India from serene backwaters to majestic deserts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location) => (
            <Card 
              key={location.id} 
              className="group flex flex-col cursor-pointer overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:scale-105"
            >
              <div className="relative overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                  {location.price}
                </div>
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg mb-2">{location.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{location.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-travel-gold fill-current mr-1" />
                      <span className="text-sm font-medium">{location.rating}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-gradient-hero hover:opacity-90"
                  onClick={() => handleBookNow(location.id)} // Pass the ID
                >
                  <Send className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsPreview;