import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex flex-col items-center space-x-2">
          <div className="text-2xl font-bold gradient-text">Go For it</div>
        </Link>
        
        <nav className="hidden md:flex items-center ml-20 space-x-2">
        
          <Button variant="ghost" size="sm" asChild>
            <a href="#locations">Destinations</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/membership">Membership</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a className="font-bold text-m" href="#special-offer">Special Offer</a>
          </Button>
          <SignedIn>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="#contact">Contact Us</a>
          </Button>
          
          <SignedOut>
            <Button variant="ghost" size="sm" onClick={() => navigate('/sign-in')}>
              Login
            </Button>
            <Button size="sm" className="bg-gradient-hero hover:opacity-90" onClick={() => navigate('/sign-up')}>
              Sign Up
            </Button>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;