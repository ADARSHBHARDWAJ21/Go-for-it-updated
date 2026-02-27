import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Corrected import: Replaced GlassOfWine with PartyPopper
import { User, Users, PartyPopper } from "lucide-react";

const travelOptions = [
  {
    title: "Solo",
    description: "Embark on a journey of self-discovery and adventure, tailored just for you specially designed by us.",
    icon: User,
  },
  {
    title: "Family",
    description: "Create lasting memories with family-friendly destinations and activities for all ages.",
    icon: Users,
  },
  {
    title: "Friends",
    description: "Experience the ultimate getaway with your friends, full of fun and unforgettable moments.",
    // Corrected icon usage
    icon: PartyPopper,
  },
];

const TravelOptions = () => {
  return (
    <section id="travel-options" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How Do You <span className="gradient-text">Want to Travel?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the style of travel that best suits your next great adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {travelOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card 
                key={option.title}
                className="group cursor-pointer bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow text-center"
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-secondary rounded-full">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-2xl mb-3">{option.title}</h3>
                  <p className="text-muted-foreground mb-6">{option.description}</p>
                  <Button className="w-full bg-gradient-hero hover:opacity-90">
                    Select Option
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TravelOptions;