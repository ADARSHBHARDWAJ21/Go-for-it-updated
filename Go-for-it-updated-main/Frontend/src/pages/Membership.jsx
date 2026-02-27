import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Crown } from "lucide-react";
import { useBooking } from "@/components/context/BookingContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "799",
    priceDisplay: "₹799",
    period: "/ for 1 Trip",
    description: "Perfect for occasional travelers",
    features: [
      "Access to basic destinations",
      "Standard booking options",
      "Email support",
      "24/7 support",
      "Mobile app access",
      "Basic travel guides",
    ],
    icon: Star,
    popular: false,
  },
  {
    name: "Premium Membership",
    price: "2499",
    priceDisplay: "₹2,499",
    period: "/ month",
    description: "For the ultimate travel experience",
    features: [
      "Access to ALL destinations",
      "Priority booking & upgrades",
      "24/7 priority service & support",
      "Exclusive deals & discounts",
      "Personalized travel planning",
      "VIP airport lounge access",
      "Travel insurance included",
      "Concierge services",
    ],
    icon: Crown,
    popular: true,
  },
];

const Membership = () => {
    const { initiateBooking } = useBooking();
    const navigate = useNavigate();

    const handlePurchase = (plan) => {
        const subtotal = parseFloat(plan.price);
        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        const bookingData = {
            destination: plan.name,
            duration: plan.period,
            travelers: '1 Member',
            flight: null,
            hotel: null,
            subtotal: `₹${subtotal.toFixed(2)}`,
            gst: `₹${gst.toFixed(2)}`,
            total: `₹${total.toFixed(2)}`,
          };
          initiateBooking(bookingData);
          navigate('/payment');
    }

  return (
    <section id="plans" className="py-20 px-4 bg-background min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Membership</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your travel needs and unlock amazing experiences.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`relative bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 ${
                  plan.popular ? 'border-travel-gold shadow-glow scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-premium text-foreground px-6 py-1 rounded-full text-sm font-semibold border border-travel-gold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular ? 'bg-gradient-premium' : 'bg-secondary'}`}>
                      <IconComponent className={`h-8 w-8 ${plan.popular ? 'text-travel-gold' : 'text-primary'}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary">
                    {plan.priceDisplay}
                    <span className="text-lg text-muted-foreground font-normal">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-travel-forest mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handlePurchase(plan)}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-hero hover:opacity-90' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    size="lg"
                  >
                    Get Started
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

export default Membership;