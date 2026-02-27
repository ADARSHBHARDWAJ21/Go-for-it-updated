import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your next adventure? Our travel experts are here to help you every step of the way.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="How can we help you?" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us about your dream destination..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-muted-foreground mb-8">
                We're here to make your travel dreams come true. Reach out to us through any of these channels.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-card border-border/50 p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-travel-ocean/20 rounded-lg">
                    <Mail className="h-6 w-6 text-travel-ocean" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-muted-foreground">support@goforit.com</p>
                    <p className="text-muted-foreground">info@goforit.com</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-card border-border/50 p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-travel-sunset/20 rounded-lg">
                    <Phone className="h-6 w-6 text-travel-sunset" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground">+1 (555) 987-6543</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-card border-border/50 p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-travel-forest/20 rounded-lg">
                    <MapPin className="h-6 w-6 text-travel-forest" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Office</h4>
                    <p className="text-muted-foreground">123 Travel Street</p>
                    <p className="text-muted-foreground">New York, NY 10001</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-card border-border/50 p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-travel-gold/20 rounded-lg">
                    <Clock className="h-6 w-6 text-travel-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Business Hours</h4>
                    <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">24/7 for Premium Members</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;