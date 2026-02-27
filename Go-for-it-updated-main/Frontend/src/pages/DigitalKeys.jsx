
import React, { useState } from 'react';
import {
  KeyRound,
  Smartphone,
  Wifi,
  Shield,
  Clock,
  MapPin,
  QrCode,
  Battery,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const DigitalKeys = () => {
  const [selectedKey, setSelectedKey] = useState(null);

  const digitalKeys = [
    {
      id: 1,
      hotelName: 'Taj Hotel',
      roomNumber: '512',
      checkIn: 'Dec 15, 3:00 PM',
      checkOut: 'Dec 22, 11:00 AM',
      status: 'active',
      location: 'Mumbai, India',
      keyCode: 'HDL-512-A7B9',
      // batteryLevel: 85,
      lastUsed: '2 hours ago',
      features: ['Contactless Entry', 'Elevator Access', 'Pool Access', 'Gym Access']
    },
    {
      id: 2,
      hotelName: 'Courtyard Marriot',
      roomNumber: '1204',
      checkIn: 'Jan 10, 2:00 PM',
      checkOut: 'Jan 20, 12:00 PM',
      status: 'pending',
      location: 'Bhopal, Madhya Pradesh',
      keyCode: 'TBH-1204-C3F8',
      // batteryLevel: 92,
      lastUsed: 'Not activated',
      features: ['Smart Lock', 'Express Checkout', 'Concierge Access', 'Business Lounge']
    },
    {
      id: 3,
      hotelName: 'Alpine Resort',
      roomNumber: '308',
      checkIn: 'July 5, 4:00 PM',
      checkOut: 'July 12, 10:00 AM',
      status: 'expired',
      location: 'Swiss Alps',
      keyCode: 'AR-308-E2D1',
      batteryLevel: 0,
      lastUsed: '2 months ago',
      features: ['Ski Locker', 'Spa Access', 'Restaurant Priority']
    }
  ];

  const getStatusColor = (status) => {
    // Inverted colors for dark theme background (less saturation)
    switch (status) {
      case 'active': return 'bg-green-900/40 text-green-300';
      case 'pending': return 'bg-yellow-900/40 text-yellow-300';
      case 'expired': return 'bg-red-900/40 text-red-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      case 'expired': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    // 1. MAIN BACKGROUND: Set the entire page background to a dark color and text to white/light gray
    <div className="space-y-6 bg-gray-900 min-h-screen p-8 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Digital Hotel Keys</h1>
          <p className="text-gray-400 mt-1">Secure, contactless hotel access</p>
        </div>
        {/* ELEMENT: Inverted header info card colors */}
        <div className="bg-gray-800 px-4 py-2 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Shield className="w-4 h-4 text-green-400" />
            <span>All keys encrypted & secure</span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      {/* ELEMENT: Kept the gradient but ensured text is white */}
      <div className="bg-gradient-to-r from-blue-700 to-teal-700 rounded-xl p-6 text-white shadow-xl">
        <h2 className="text-xl font-semibold mb-4">How Digital Keys Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: Smartphone, title: 'Mobile App', desc: 'Keys delivered to your phone' },
            { icon: QrCode, title: 'QR Activation', desc: 'Scan to activate at hotel' },
            { icon: Wifi, title: 'Contactless Entry', desc: 'Tap phone to unlock doors' },
            { icon: Shield, title: 'Secure Access', desc: 'Encrypted & time-limited' }
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              // ELEMENT: Changed background to black/transparent on the gradient
              <div key={index} className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                <Icon className="w-8 h-8 mb-3 text-white" />
                <h3 className="font-medium mb-2">{step.title}</h3>
                <p className="text-sm opacity-80">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Keys Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {digitalKeys.map((key) => {
          const StatusIcon = getStatusIcon(key.status);
          
          return (
            <div 
              key={key.id} 
              // ELEMENT: Card background changed to a lighter dark gray
              className={`bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedKey === key.keyCode
                  ? 'border-blue-500 shadow-blue-500/30' // Highlight color
                  : 'border-gray-700 hover:border-gray-600 hover:shadow-xl'
              }`}
              onClick={() => setSelectedKey(selectedKey === key.keyCode ? null : key.keyCode)}
            >
              {/* Key Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {/* Icon Gradient remains vibrant for contrast */}
                    <div className={`w-12 h-12 ${
                      key.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      key.status === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    } rounded-xl flex items-center justify-center`}>
                      <KeyRound className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{key.hotelName}</h3>
                      <p className="text-sm text-gray-400">Room {key.roomNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* ICON: Adjusted icon color for visibility */}
                    <StatusIcon className={`w-5 h-5 ${
                       key.status === 'active' ? 'text-green-400' :
                       key.status === 'pending' ? 'text-yellow-400' :
                       'text-red-400'
                    }`} />
                    {/* ELEMENT: Status badge uses inverted colors */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(key.status)}`}>
                      {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Location and Dates */}
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{key.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Check-in: {key.checkIn}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Check-out: {key.checkOut}</span>
                  </div>
                </div>
              </div>

              {/* Key Details */}
              <div className="p-6">
                {/* Battery and Usage */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {/* ICON: Battery icon color adjusted for dark BG */}
                    <Battery className={`w-4 h-4 ${
                      key.batteryLevel > 50 ? 'text-green-400' :
                      key.batteryLevel > 20 ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                    <span className="text-sm text-gray-400">Battery: {key.batteryLevel}%</span>
                  </div>
                  <span className="text-sm text-gray-400">Last used: {key.lastUsed}</span>
                </div>

                {/* Key Code */}
                {/* ELEMENT: Key code background is slightly lighter than card background */}
                <div className="bg-gray-700 rounded-lg p-3 mb-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Digital Key Code</p>
                      <p className="font-mono text-sm font-medium text-white">{key.keyCode}</p>
                    </div>
                    <QrCode className="w-8 h-8 text-gray-500" />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Access Features:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {key.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-6">
                  {key.status === 'active' ? (
                    <>
                      {/* BUTTON: Blue primary action button */}
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                        Use Key
                      </button>
                      {/* BUTTON: Secondary action button, dark theme style */}
                      <button className="flex-1 bg-gray-700 text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors duration-200 border border-gray-600">
                        Share Access
                      </button>
                    </>
                  ) : key.status === 'pending' ? (
                    // BUTTON: Pending action button
                    <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors duration-200">
                      Activate Key
                    </button>
                  ) : (
                    // BUTTON: Expired/Disabled button
                    <button className="w-full bg-gray-700 text-gray-500 py-2 px-4 rounded-lg text-sm font-medium cursor-not-allowed border border-gray-600">
                      Key Expired
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Info */}
      {/* ELEMENT: Security Info card uses a contrasting dark gray */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Security & Privacy</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-gray-300 mb-2">End-to-End Encryption</h3>
            <p className="text-sm text-gray-400">All digital keys use AES-256 encryption for maximum security</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-300 mb-2">Time-Limited Access</h3>
            <p className="text-sm text-gray-400">Keys automatically expire after checkout for enhanced security</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-300 mb-2">Offline Capable</h3>
            <p className="text-sm text-gray-400">Keys work without internet connection for reliable access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalKeys;