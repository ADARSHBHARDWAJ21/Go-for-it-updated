import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const AdvertisementSection = () => {
  return (
    <section id="special-offer" className="py-20 px-4 bg-gradient-to-br from-background to-secondary/10">
      <div className="container mx-auto">
        <div className="text-center">
          <Card className="bg-gradient-to-tr from-travel-gold/10 via-background to-background border-travel-gold/30 max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-travel-gold/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-travel-ocean/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-4 bg-travel-gold/20 rounded-full mb-6 border border-travel-gold/30">
                  <Sparkles className="h-8 w-8 text-travel-gold" />
                </div>
                {/* UPDATED THIS LINE: Removed gradient classes and used a solid text color */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-travel-gold ">
                   🎉 <span className="gradient-text">Special Launch Offer </span>🎊
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join 10,000+ travelers who upgraded this month and Save Upto 50% on your first premium subscription!
                </p>
                <Button size="lg" className="bg-travel-gold text-background hover:bg-travel-gold/90 font-bold px-10 py-6 text-base">
                  Get 50% Off Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdvertisementSection;