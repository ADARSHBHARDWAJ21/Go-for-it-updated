import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Sidebar from './SideBar';
import Booking from './Booking';
import Itinerary from './Itinerary';
import DigitalKeys from './DigitalKeys';
import Budget from './Budget';
import Notifications from './Notifications';
import Profile from './Profile';
import PlanTrip from './PlanTrip';

function DashLayout() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />; // Pass setActiveTab here
      case 'planatrip':
        return <PlanTrip />;
      case 'bookings':
        return <Booking setActiveTab={setActiveTab} />; // Also pass to Booking
      case 'itinerary':
        return <Itinerary />;
      case 'digital-keys':
        return <DigitalKeys />;
      case 'budget':
       return <Budget/>
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen from-slate-50 to-blue-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-64">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashLayout;