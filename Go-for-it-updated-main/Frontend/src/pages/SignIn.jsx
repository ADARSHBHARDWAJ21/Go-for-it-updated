import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

/**
 * Renders the Clerk Sign In component in a simple, centered dark card layout.
 * The layout is customized to place social sign-in options below the form for consistency.
 */
const SignIn = () => {
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
          <p className="text-muted-foreground text-sm">Welcome back to your travel companion</p>
        </div>

        {/* Clerk Component */}
        <ClerkSignIn 
          routing="path" 
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
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
              // Styling the primary button (Continue)
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg",
              // Styling the social/alternative buttons block (Google, Apple)
              socialButtonsBlockButton: "bg-input hover:bg-secondary/80 text-foreground border border-border rounded-lg transition-all duration-200",
              // Footer link (Sign up link)
              footerActionLink: "text-primary hover:text-primary/80 font-medium",
            },
            layout: {
              // VITAL CHANGE: Place social buttons below the form fields
              socialButtonsPlacement: 'bottom',
              socialButtonsVariant: 'blockButton',
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignIn;