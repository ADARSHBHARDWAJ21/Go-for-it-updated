// src/components/TestimonialsSection.jsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Kerala Backwaters Trip",
    avatar: "https://i.pravatar.cc/150?u=priya",
    testimonial: "'Go For It' planned the most serene and beautiful trip for my family. The houseboat experience was unforgettable. Everything was handled perfectly, from start to finish!",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    location: "Rajasthan Desert Safari",
    avatar: "https://i.pravatar.cc/150?u=rohan",
    testimonial: "The desert safari was an adventure of a lifetime! The team was incredibly supportive and the itinerary was packed with culture and excitement. Highly recommended.",
    rating: 5,
  },
  {
    name: "Anjali Singh",
    location: "Himachal Mountain Retreat",
    avatar: "https://i.pravatar.cc/150?u=anjali",
    testimonial: "My solo trip to Himachal was flawlessly organized. The views were breathtaking, and the AI-planned itinerary gave me the perfect balance of adventure and relaxation.",
    rating: 5,
  },
  {
    name: "Vikram Desai",
    location: "Goa Beach Paradise",
    avatar: "https://i.pravatar.cc/150?u=vikram",
    testimonial: "Booking our Goa trip through this platform was so easy. The premium plan got us amazing deals and access to exclusive beach clubs. It was the best trip with friends!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="gradient-text">Travelers Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from our community of explorers who trusted us with their adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-2 flex flex-col"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <blockquote className="text-muted-foreground italic border-l-2 border-primary/50 pl-4 mb-4">
                  {testimonial.testimonial}
                </blockquote>
                <div className="flex justify-end mt-auto">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-travel-gold fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;