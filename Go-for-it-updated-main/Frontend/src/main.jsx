import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Index from './pages/Index.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/Signup.jsx';
import DashLayout from './pages/DashLayout.jsx';
import NotFound from './pages/NotFound.jsx';
import Payment from './pages/Payment.jsx';
import Membership from './pages/Membership.jsx';
import BookFlight from './pages/BookFlight.jsx';
import FlightResults from './pages/FlightResults.jsx'; 
import BookTrain from './pages/Booktrain.jsx';
import TrainResults from './pages/TrainResults.jsx';
import BookHotel from './pages/BookHotel.jsx';
import HotelResults from './pages/HotelResults.jsx';
import HotelDetails from './pages/HotelDetails.jsx';
import PackageDetails from './pages/PackageDetails.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import './index.css';

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file');
  console.error('Authentication features will not work without this key.');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Index /> },
      { path: 'sign-in/*', element: <SignIn /> },
      { path: 'sign-up/*', element: <SignUp /> },
      { path: 'login', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
      
      { 
        path: 'dashboard/*', 
        element: (
          <PrivateRoute>
            <DashLayout />
          </PrivateRoute>
        ) 
      },

      { path: 'payment', element: <Payment /> },
      { path: 'membership', element: <Membership /> },
      { path: 'book-flight', element: <BookFlight /> },
      { path: 'book-flight/results', element: <FlightResults /> }, 
      { path: 'book-train', element: <BookTrain /> },
      { path: 'book-train/results', element: <TrainResults /> },
      { path: 'book-hotel', element: <BookHotel /> },
      { path: 'book-hotel/results', element: <HotelResults /> },
      { path: 'hotel/:hotelId', element: <HotelDetails /> },
      { path: 'package/:id', element: <PackageDetails /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);