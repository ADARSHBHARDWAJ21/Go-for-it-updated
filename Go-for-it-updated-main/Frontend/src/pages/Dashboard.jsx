import React from 'react';
import {
  Calendar,
  MapPin,
  CreditCard,
  Bell,
  Plane,
  Hotel,
  Car,
  Camera,
  TrendingUp,
  Clock
} from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  const upcomingTrips = [
    {
      id: 1,
      destination: 'Udaipur, India',
      dates: 'Sep 25 - Sep 29, 2025',
      status: 'Confirmed',
      image: 'https://assets-news.housing.com/news/wp-content/uploads/2022/07/04223747/featured-compressed-1.jpg'
    },
    {
      id: 2,
      destination: 'Kerala, India',
      dates: 'Oct 10 - Oct 16, 2025',
      status: 'Planning',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2VyYWxhfGVufDB8fDB8fHww'
    }
  ];

  const quickStats = [
    { label: 'Active Trips', value: '2', icon: MapPin, color: 'blue' },
    { label: 'Total Bookings', value: '12', icon: Calendar, color: 'teal' },
    { label: 'Budget Used', value: '₹3,240', icon: CreditCard, color: 'orange' },
    { label: 'Notifications', value: '5', icon: Bell, color: 'green' }
  ];

  const recentActivity = [
    { action: 'Flight booked for Kerala', time: '2 hours ago', icon: Plane },
    { action: 'Hotel confirmed in Udaipur', time: '1 day ago', icon: Hotel },
    { action: 'Car rental added', time: '2 days ago', icon: Car },
    { action: 'AI itinerary generated', time: '3 days ago', icon: Camera }
  ];

  const email = localStorage.getItem('email');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find(user => user.email === email);
  
  // FIX: Safely access fullName to prevent crash if it's missing
  const firstName = currentUser?.fullName?.split(" ")[0] || "Guest";

  return (
    <div className="space-y-8 from-slate-50 to-blue-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {firstName}</h1>
          <p className="text-muted-foreground mt-1">Plan your next adventure with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-card px-4 py-2 rounded-xl shadow-sm border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last updated: Just now</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            teal: 'from-teal-500 to-teal-600',
            orange: 'from-orange-500 to-orange-600',
            green: 'from-green-500 to-green-600'
          };
          
          return (
            <div key={index} className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Upcoming Trips</h2>
              <button className="text-primary hover:text-primary/90 font-medium text-sm">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted transition-colors duration-200 group">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      src={trip.image} 
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{trip.destination}</h3>
                    <p className="text-sm text-muted-foreground">{trip.dates}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Book Flight', icon: Plane },
            { label: 'Find Hotel', icon: Hotel },
            { label: 'Plan Route', icon: MapPin },
            { label: 'Set Budget', icon: CreditCard }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button 
                key={index}
                onClick={() => setActiveTab('planatrip')}
                className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;