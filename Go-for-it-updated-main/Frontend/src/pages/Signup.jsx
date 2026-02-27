import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

/**
 * Renders the Clerk Sign Up component in a simple, centered dark card layout.
 * This matches the requested screen and uses theme colors defined in index.css.
 */
const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="text-muted-foreground hover:bg-secondary/50"
        >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
        </Button>
      </div>

      <div className="w-full max-w-md my-10">
        {/* Title Block */}
        <div className="text-center mb-6">
          <Link to="/" className="text-3xl font-bold gradient-text mb-1 inline-block">
            Go For It
          </Link>
          <p className="text-muted-foreground text-sm">Start your journey with us</p>
        </div>
        
        {/* Clerk Component */}
        <ClerkSignUp 
          routing="path" 
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
          appearance={{
            // Use the dark theme base from Clerk
            variables: {
              colorPrimary: 'hsl(217, 91%, 60%)', // Primary color (blue for Go For It)
              colorBackground: 'hsl(0, 0%, 5%)',
              colorInputBackground: 'hsl(0, 0%, 15%)',
              colorInputText: 'hsl(0, 0%, 98%)',
              colorText: 'hsl(0, 0%, 98%)',
              colorTextSecondary: 'hsl(0, 0%, 65%)',
              colorDanger: 'hsl(0, 84%, 60%)',
              borderRadius: '0.75rem',
            },
            elements: {
              // Styling the main card wrapper
              card: "bg-card/90 backdrop-blur-sm border border-border shadow-2xl p-6",
              // Styling the purple/primary button (Continue)
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg",
              // Ensuring social buttons match the dark theme inputs
              socialButtonsBlockButton: "bg-input hover:bg-secondary/80 text-foreground border border-border rounded-lg transition-all duration-200",
              // Footer link (Sign in link)
              footerActionLink: "text-primary hover:text-primary/80 font-medium",
            },
            layout: {
              socialButtonsPlacement: 'top',
              socialButtonsVariant: 'blockButton',
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignUp;