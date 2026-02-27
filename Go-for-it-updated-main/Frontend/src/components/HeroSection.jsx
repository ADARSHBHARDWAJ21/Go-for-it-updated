import { Button } from "@/components/ui/button";
import { Plane, MapPin, Clock, Hotel, Train, Bot } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for navigation

const HeroSection = () => {
  
  const quickActions = [
    { label: 'Book Flight', icon: Plane, href: '/book-flight' },
    { label: 'Find Hotel', icon: Hotel, href: '/book-hotel' },
    { label: 'AI Trip Planner', icon: Bot, href: '#trip-planner' },
    { label: 'Book Train Tickets', icon: Train, href: '/book-train' }
  ];

  const handleScrollClick = (target) => {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-travel-ocean/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-travel-sunset/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-travel-forest/20 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">LESS PLANNING</span>
            <br />
            <span className="gradient-text">MORE LIVING</span>
          </h1>
          
          <p className="text-xl md:text-1xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Smart AI Itineraries, Hassle-free rides, Meals, and stays We handle the details, You enjoy the Journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-hero hover:opacity-90 animate-glow" onClick={() => handleScrollClick('#trip-planner')}>
              <Plane className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="border-travel-ocean hover:bg-travel-ocean/10" onClick={() => handleScrollClick('#locations')}>
              <MapPin className="mr-2 h-5 w-5" />
              Explore Destinations
            </Button>
          </div>
          
          {/* --- QUICK ACTIONS SECTION --- */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const isExternalLink = action.href.startsWith('http');
                const isScrollLink = action.href.startsWith('#');

                const ActionComponent = ({ children }) => 
                  isScrollLink ? (
                    <button onClick={() => handleScrollClick(action.href)} className="w-full h-full flex flex-col items-center space-y-2 p-4 rounded-lg bg-black/10 hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm border border-white/5">
                      {children}
                    </button>
                  ) : (
                    <Link to={action.href} className="w-full h-full flex flex-col items-center space-y-2 p-4 rounded-lg bg-black/10 hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm border border-white/5">
                      {children}
                    </Link>
                  );

                return (
                  <ActionComponent key={action.label}>
                    <Icon className="w-6 h-6 text-white/80" />
                    <span className="text-sm font-medium text-white/80 text-center">{action.label}</span>
                  </ActionComponent>
                );
              })}
            </div>
          </div>
          {/* --- END OF QUICK ACTIONS SECTION --- */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <MapPin className="h-6 w-6 text-travel-ocean" />
              <span>200+ Destinations</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <Clock className="h-6 w-6 text-travel-sunset" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <Plane className="h-6 w-6 text-travel-forest" />
              <span>Instant Booking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;