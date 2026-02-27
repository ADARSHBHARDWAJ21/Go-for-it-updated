import {
  Plane,
  Hotel,
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import React, { useState } from 'react';

const Booking = ({ setActiveTab }) => { // Accept setActiveTab as a prop
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const bookings = [
    {
      id: 1,
      type: 'flight',
      title: 'Flight to Paris',
      details: 'Delhi Intwenational Airport (DIA) → Paris (CDG)',
      date: 'Dec 15, 2024',
      time: '10:30 AM',
      status: 'confirmed',
      price: '₹ 81,457',
      passengers: 2
    },
    {
      id: 2,
      type: 'hotel',
      title: 'Hotel de Louvre',
      details: 'Deluxe Suite, 3 nights',
      date: 'Dec 15-22, 2024',
      time: 'Check-in 3:00 PM',
      status: 'confirmed',
      price: '₹68,277/night',
      passengers: 2
    },
    {
      id: 3,
      type: 'car',
      title: 'Car Rental',
      details: 'BMW 3 Series, 7 days',
      date: 'Dec 15-22, 2024',
      time: 'Pick-up 9:00 AM',
      status: 'pending',
      price: '₹37,000',
      passengers: 2
    },
    {
      id: 4,
      type: 'activity',
      title: 'Eiffel Tower Tour',
      details: 'Skip-the-line tickets',
      date: 'Dec 16, 2024',
      time: '2:00 PM',
      status: 'confirmed',
      price: '₹10,000',
      passengers: 2
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Hotel;
      case 'car': return Car;
      case 'activity': return MapPin;
      default: return MapPin;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'flight': return 'from-blue-500 to-blue-600';
      case 'hotel': return 'from-teal-500 to-teal-600';
      case 'car': return 'from-orange-500 to-orange-600';
      case 'activity': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = activeFilter === 'all' || booking.type === activeFilter;
    const matchesSearch = booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'flight', label: 'Flights' },
    { value: 'hotel', label: 'Hotels' },
    { value: 'car', label: 'Car Rentals' },
    { value: 'activity', label: 'Activities' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage all your travel reservations</p>
        </div>
        <button 
          onClick={() => setActiveTab('planatrip')}
          className="bg-gradient-to-r from-blue-600 to-teal-600 text-primary-foreground px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Booking</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => {
          const Icon = getTypeIcon(booking.type);
          
          return (
            <div key={booking.id} className="bg-card rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden group">
              {/* Header */}
              <div className={`h-2 bg-gradient-to-r ${getTypeColor(booking.type)}`}></div>
              
              <div className="p-6">
                {/* Type Icon and Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(booking.type)} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                {/* Booking Details */}
                <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {booking.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{booking.details}</p>

                {/* Date and Time */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{booking.passengers} passengers</span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xl font-bold text-foreground">{booking.price}</span>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                    <button className="text-muted-foreground hover:text-foreground text-sm font-medium">
                      Modify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No bookings found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Booking;