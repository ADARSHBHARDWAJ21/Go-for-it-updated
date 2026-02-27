import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Sparkles,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Navigation,
  Camera,
  Coffee,
  Utensils
} from 'lucide-react';

const Itinerary = () => {
  const [selectedTrip, setSelectedTrip] = useState('udaipur');

  const trips = [
    { id: 'udaipur', name: 'Udaipur Vibe', dates: '5 Days' },
    { id: 'goa', name: 'Goa Explorer', dates: '11 Days' }
  ];

  const itineraryData = {
    udaipur: [
      {
        day: 1,
        activities: [
          {
            id: 1,
            time: '10:00 AM',
            title: 'Visit Amber Fort, Jaipur',
            type: 'activity',
            duration: '3 hours',
            location: 'Rajasthan',
            notes: 'Explore the rich history and architecture.'
          },
          {
            id: 2,
            time: '1:00 PM',
            title: 'Lunch at Sheesh Mahal',
            type: 'food',
            duration: '1.5 hours',
            location: 'Local Area',
            notes: 'Enjoy a royal dining experience.'
          },
          {
            id: 3,
            time: '3:00 PM',
            title: 'Hot Air Ballooning in Jaipur',
            type: 'activity',
            duration: '2 hours',
            location: 'Varies',
            notes: 'Get a bird\'s eye view of the Pink City.'
          },
          {
            id: 4,
            time: '7:00 PM',
            title: 'Dinner at Laxmi Misthan Bhandar',
            type: 'food',
            duration: '2 hours',
            location: 'Hotel Area',
            notes: 'Savor authentic Rajasthani sweets and snacks.'
          }
        ]
      },
      {
        day: 2,
        activities: [
          {
            id: 5,
            time: '9:00 AM',
            title: 'Explore Mehrangarh Fort, Jodhpur',
            type: 'activity',
            duration: '3 hours',
            location: 'Jodhpur',
            notes: 'Discover the majestic fort and its museum.'
          },
          {
            id: 6,
            time: '1:00 PM',
            title: 'Try Cultural Puppet Show',
            type: 'activity',
            duration: '1 hour',
            location: 'Jodhpur',
            notes: 'Experience the local art and culture.'
          },
          {
            id: 7,
            time: '4:00 PM',
            title: 'Shop at Johari Bazaar',
            type: 'activity',
            duration: '2 hours',
            location: 'Jaipur',
            notes: 'Shop for traditional jewelry and textiles.'
          }
        ]
      }
    ],
    goa: [
      {
        day: 1,
        activities: [
          {
            id: 8,
            time: '10:00 AM',
            title: 'Arrival at Dabolim Airport',
            type: 'transport',
            duration: '45 min',
            location: 'GOI Airport',
            notes: 'Pre-booked taxi to hotel.'
          },
          {
            id: 9,
            time: '2:00 PM',
            title: 'Relax at Baga Beach',
            type: 'activity',
            duration: '3 hours',
            location: 'Baga Beach',
            notes: 'Enjoy the sun, sand, and sea.'
          }
        ]
      }
    ]
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'transport': return Navigation;
      case 'accommodation': return MapPin;
      case 'food': return Utensils;
      case 'activity': return Camera;
      default: return MapPin;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'transport': return 'from-blue-500 to-blue-600';
      case 'accommodation': return 'from-teal-500 to-teal-600';
      case 'food': return 'from-orange-500 to-orange-600';
      case 'activity': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const currentItinerary = itineraryData[selectedTrip] || [];

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Itinerary Planner</h1>
          <p className="text-gray-300 mt-1">Personalized day-by-day travel plans</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Generate with AI</span>
          </button>
          <button className="bg-gray-800 border border-gray-700 text-gray-200 px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Activity</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-300" />
          <span className="font-medium text-gray-200">Select Trip:</span>
          <div className="flex space-x-2">
            {trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => setSelectedTrip(trip.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedTrip === trip.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {trip.name}
                <span className="ml-2 text-xs opacity-75">{trip.dates}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {currentItinerary.map((dayPlan) => (
          <div key={dayPlan.day} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Day {dayPlan.day} in Rajasthan</h2>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {dayPlan.activities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  const isLast = index === dayPlan.activities.length - 1;
                  
                  return (
                    <div key={activity.id} className="relative">
                      {!isLast && (
                        <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                      )}
                      
                      <div className="flex items-start space-x-4 group">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center shadow-sm z-10`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">{activity.time}</span>
                        </div>

                        <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{activity.title}</h3>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{activity.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{activity.location}</span>
                                </div>
                              </div>
                              {activity.notes && (
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/50 p-2 rounded-lg">
                                  💡 {activity.notes}
                                </p>
                              )}
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-xl font-semibold">AI Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-medium mb-2">Weather Optimized</h3>
            <p className="text-sm opacity-90">Indoor activities scheduled during rain forecast</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-medium mb-2">Budget Friendly</h3>
            <p className="text-sm opacity-90">Free walking tours and affordable dining options</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="font-medium mb-2">Time Efficient</h3>
            <p className="text-sm opacity-90">Grouped activities by location to minimize travel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;