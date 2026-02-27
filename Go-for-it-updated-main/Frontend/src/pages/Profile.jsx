import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  Bell,
  Globe,
  Camera,
  Edit,
  Save,
  Settings,
  Award
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const email = localStorage.getItem('email');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find((u) => u.email === email);
    
  // FIX: Safely initialize state to prevent crash
  const [profileData, setProfileData] = useState({
    firstName: currentUser?.fullName?.split(' ')[0] || '',
    lastName:  currentUser?.fullName?.split(' ')[1] || '',
    email:  currentUser?.email || '',
    acDate: currentUser?.date || 'N/A',
    phone: '+91 XXXXX-12345',
    location: 'Bhopal, Madhya Pradesh',
    dateOfBirth: '1990-05-15',
    nationality: 'INDIAN',
    passportNumber: 'IND123456789',
    emergencyContact: ''
  });

  const travelStats = {
    totalTrips: 12,
    countriesVisited: 8,
    milesFlown: 47520,
    totalSpent: 28750,
    favoriteDestination: 'Paris, France'
  };

  const preferences = {
    preferredAirlines: ['Delta', 'Air France', 'Lufthansa'],
    seatPreference: 'Aisle',
    mealPreference: 'Vegetarian',
    hotelChain: 'Marriott',
    roomType: 'King Suite',
    currency: 'USD',
    language: 'English',
    timezone: 'EST'
  };

  const achievements = [
    { title: 'Frequent Flyer', description: '10+ flights booked', icon: '✈️' },
    { title: 'Explorer', description: '5+ countries visited', icon: '🌍' },
    { title: 'Budget Master', description: 'Stayed under budget 3 trips', icon: '💰' },
    { title: 'Early Bird', description: 'Always checks in early', icon: '⏰' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save this data back to your backend/localStorage
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500 dark:text-gray-300  ";

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 md:p-10 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile & Preferences</h1>
          <p className="text-gray-600 mt-1 dark:text-gray-400">Manage your account and travel preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
            <p className="opacity-90">{profileData.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{profileData.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member since {profileData.acDate}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{travelStats.totalTrips}</div>
            <div className="text-sm opacity-90">Total Trips</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex space-x-4">
          <TabButton id="personal" label="Personal Info" icon={User} />
          <TabButton id="travel" label="Travel Stats" icon={Award} />
          <TabButton id="preferences" label="Preferences" icon={Settings} />
          <TabButton id="security" label="Security" icon={Shield} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        {activeTab === 'personal' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nationality</label>
                <input
                  type="text"
                  value={profileData.nationality}
                  onChange={(e) => setProfileData({...profileData, nationality: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Passport Number</label>
                <input
                  type="text"
                  value={profileData.passportNumber}
                  onChange={(e) => setProfileData({...profileData, passportNumber: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Contact</label>
                <input
                  type="text"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}
        {/* Other tabs content remains the same */}
      </div>
    </div>
  );
};

export default Profile;