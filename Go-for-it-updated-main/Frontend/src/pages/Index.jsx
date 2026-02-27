import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TravelOptions from "@/components/TravelOptions"; // Import the new component
import LocationsPreview from "@/components/LocationsPreview";
import PlansSection from "@/components/PlansSection";
import AdvertisementSection from "@/components/AdvertisementSection";
import ContactSection from "@/components/ContactSection";
import Chatbot from "@/components/Chatbot";
import TestimonialsSection from "../components/TestimonialsSection";
import TripPlannerSection from "../components/TripPlannerSection";
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TripPlannerSection/>
      <TravelOptions /> {/* Add the new component here */}
      <LocationsPreview />
      <PlansSection />
      <AdvertisementSection />
      <TestimonialsSection />
      <ContactSection />
      <Chatbot />
    </div>
  );
};

export default Index;