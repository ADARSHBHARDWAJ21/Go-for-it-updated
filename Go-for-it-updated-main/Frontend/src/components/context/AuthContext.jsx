import React, { createContext, useContext } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerkAuth();

  // Transform Clerk user to match the expected format
  const transformedUser = user ? {
    _id: user.id,
    fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'User',
    email: user.emailAddresses[0]?.emailAddress || '',
    imageUrl: user.imageUrl,
    clerkId: user.id,
  } : null;

  const login = (userData) => {
    // Clerk handles login, this is kept for backward compatibility
    console.log('Login handled by Clerk');
  };

  const logout = async () => {
    await signOut();
  };

  const value = { 
    user: transformedUser, 
    isLoaded: userLoaded,
    login, 
    logout 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};