 
import React, { useState } from 'react';
import {
  Bell,
  Plane,
  Hotel,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Settings,
  Filter
} from 'lucide-react';

// Removed : React.FC
const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'flight',
      priority: 'high',
      title: 'Flight Delay Alert',
      message: 'Your flight AF123 to Paris has been delayed by 45 minutes. New departure: 11:15 AM',
      timestamp: '5 minutes ago',
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'hotel',
      priority: 'medium',
      title: 'Digital Key Ready',
      message: 'Your digital key for Hotel de Louvre is now active. Check-in starts at 3:00 PM.',
      timestamp: '1 hour ago',
      read: false,
      actionRequired: false
    },
    {
      id: 3,
      type: 'reminder',
      priority: 'medium',
      title: 'Check-in Reminder',
      message: 'Don\'t forget to check in for your flight 24 hours before departure (Tomorrow at 10:30 AM).',
      timestamp: '2 hours ago',
      read: true,
      actionRequired: true
    },
    {
      id: 4,
      type: 'activity',
      priority: 'low',
      title: 'Weather Update',
      message: 'Rain expected in Paris tomorrow. Indoor activities recommended for your itinerary.',
      timestamp: '3 hours ago',
      read: true,
      actionRequired: false
    },
    {
      id: 5,
      type: 'budget',
      priority: 'medium',
      title: 'Budget Alert',
      message: 'You\'ve used 70% of your Paris trip budget. $1,020 remaining.',
      timestamp: '1 day ago',
      read: true,
      actionRequired: false
    },
    {
      id: 6,
      type: 'system',
      priority: 'low',
      title: 'Itinerary Updated',
      message: 'AI has optimized your Day 2 itinerary based on weather conditions and traffic.',
      timestamp: '2 days ago',
      read: true,
      actionRequired: false
    }
  ]);

  // Removed type annotation (type: string)
  const getTypeIcon = (type) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Hotel;
      case 'reminder': return Clock;
      case 'activity': return MapPin;
      case 'budget': return AlertTriangle;
      case 'system': return Info;
      default: return Bell;
    }
  };

  // Removed type annotations (priority: string, read: boolean)
  const getPriorityColor = (priority, read) => {
    if (read) return 'border-l-gray-700';
    
    // Adjusted border color for high contrast on dark background
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-700';
    }
  };

  // Removed type annotation (type: string)
  const getTypeColor = (type) => {
    switch (type) {
      case 'flight': return 'from-blue-500 to-blue-600';
      case 'hotel': return 'from-teal-500 to-teal-600';
      case 'reminder': return 'from-orange-500 to-orange-600';
      case 'activity': return 'from-green-500 to-green-600';
      case 'budget': return 'from-red-500 to-red-600';
      case 'system': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Removed type annotation (id: number)
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Removed type annotation (id: number)
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'action') return notif.actionRequired;
    if (filter !== 'all') return notif.type === filter;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'action', label: 'Action Required' },
    { value: 'flight', label: 'Flights' },
    { value: 'hotel', label: 'Hotels' },
    { value: 'reminder', label: 'Reminders' }
  ];

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setFilter(id)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
        filter === id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600' // Dark theme button style
      }`}
    >
      {label}
    </button>
  );

  return (
    // 1. MAIN BACKGROUND: Set to gray-900 and default text to light gray
    <div className="space-y-6 bg-gray-900 min-h-screen p-8 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">
            Stay updated with real-time travel alerts and reminders
            {unreadCount > 0 && (
              // Adjusted badge for dark theme contrast
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/40 text-red-300 border border-red-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          {/* Secondary Button - Dark Theme Style */}
          <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2 border border-gray-600">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          {/* Primary Button */}
          <button 
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filters (Card Style) */}
      {/* 2. CARD BACKGROUND: Set to gray-800 and border to gray-700 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-gray-300">Filter:</span>
          <div className="flex space-x-2 flex-wrap">
            {filterOptions.map((option) => (
              <TabButton key={option.value} id={option.value} label={option.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => {
          const Icon = getTypeIcon(notification.type);
          
          return (
            <div
              key={notification.id}
              // 2. CARD BACKGROUND: Set to gray-800, using different shading for unread/read state
              className={`bg-gray-800 rounded-xl shadow-lg border-l-4 ${getPriorityColor(notification.priority, notification.read)} transition-all duration-200 border border-gray-700 hover:border-gray-600 ${
                !notification.read ? 'bg-gray-700/50' : '' // Slightly lighter background for unread
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Icon - Colors are dynamic and look good on dark/light backgrounds */}
                    <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(notification.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`text-lg font-semibold ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                          {notification.title}
                        </h3>
                        {notification.actionRequired && (
                           // Adjusted badge for dark theme contrast
                          <span className="px-2 py-1 bg-orange-900/40 text-orange-300 text-xs font-medium rounded border border-orange-800">
                            Action Required
                          </span>
                        )}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className={`mb-3 ${notification.read ? 'text-gray-400' : 'text-gray-300'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{notification.timestamp}</span>
                        
                        <div className="flex items-center space-x-2">
                          {notification.actionRequired && (
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200">
                              Take Action
                            </button>
                          )}
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              // Link/Action color adjusted for dark theme
                              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-500 hover:text-gray-300 p-1 rounded transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State (Card Style) */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No notifications found</h3>
          <p className="text-gray-400">
            {filter === 'unread' ? "You're all caught up!" : "Try adjusting your filter criteria"}
          </p>
        </div>
      )}

      {/* Notification Settings (Gradient Style) */}
      {/* 3. GRADIENT SECTION: Used the same dark gradient and black/transparent inner card */}
      <div className="bg-gradient-to-r from-blue-700 to-teal-700 rounded-xl p-6 text-white shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
            <h3 className="font-medium mb-2">🔔 Real-time Alerts</h3>
            <p className="text-sm opacity-80">Get instant notifications for flight changes and important updates</p>
          </div>
          <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
            <h3 className="font-medium mb-2">📧 Email Digest</h3>
            <p className="text-sm opacity-80">Receive daily summaries of your travel schedule and reminders</p>
          </div>
          <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
            <h3 className="font-medium mb-2">🤖 Smart Reminders</h3>
            <p className="text-sm opacity-80">AI-powered suggestions for check-ins, bookings, and activities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;