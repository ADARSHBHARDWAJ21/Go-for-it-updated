import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useAuth as useAppAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { isLoaded: appAuthLoaded } = useAppAuth();
  const location = useLocation();

  // Wait for Clerk to finish loading
  if (!isLoaded || !appAuthLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    // If the user is not logged in, redirect them to the sign-in page.
    // We also save the location they were trying to access, so we can
    // redirect them back there after they sign in.
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the component that was passed in (e.g., the Dashboard)
  return children;
};

export default PrivateRoute;