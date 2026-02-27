import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/context/AuthContext";
import { useBooking } from "@/components/context/BookingContext";
import { useNavigate, useLocation } from "react-router-dom";
import itineraryService from "@/services/itineraryService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInCalendarDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Import cn utility
import {
    Send, Sparkles, Compass, Gem, PlusCircle, MapPin, Clock, Plane, Hotel, Edit, Calendar as CalendarIcon, Users, Utensils, Camera, MountainSnow, FerrisWheel, Briefcase, ShoppingCart, Drama, Ship, Palmtree, CheckCircle, Train, Mountain, Waves, Landmark,
    Link, Loader2
} from "lucide-react";

// --- Helper Functions ---
const isValidIndianDestination = (destination) => {
    if (!destination || destination.trim().length === 0) return false;
    
    // List of major Indian states, cities, and tourist destinations
    const indianDestinations = [
        // States
        'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 
        'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya pradesh', 
        'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 
        'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 
        'uttarakhand', 'west bengal',
        
        // Major Cities
        'mumbai', 'delhi', 'bangalore', 'hyderabad', 'ahmedabad', 'chennai', 'kolkata', 
        'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 
        'visakhapatnam', 'pimpri', 'patna', 'vadodara', 'ludhiana', 'agra', 'nashik', 
        'faridabad', 'meerut', 'rajkot', 'kalyan', 'vasai', 'varanasi', 'srinagar', 
        'aurangabad', 'noida', 'solapur', 'ranchi', 'howrah', 'coimbatore', 'raipur', 
        'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 
        'guwahati', 'chandigarh', 'tiruchirappalli', 'mysore', 'mangalore', 'kochi', 
        'bhubaneswar', 'amritsar', 'jalandhar', 'bathinda', 'patiala', 'ludhiana', 
        'mohali', 'panchkula', 'karnal', 'hisar', 'rohtak', 'gurgaon', 'faridabad', 
        'noida', 'ghaziabad', 'meerut', 'agra', 'kanpur', 'lucknow', 'varanasi', 
        'allahabad', 'bareilly', 'moradabad', 'aligarh', 'gorakhpur', 'saharanpur', 
        'noida', 'ghaziabad', 'meerut', 'agra', 'kanpur', 'lucknow', 'varanasi',
        
        // Popular Tourist Destinations
        'goa', 'rajasthan', 'kerala', 'himachal pradesh', 'kashmir', 'ladakh', 'manali', 
        'shimla', 'dharamshala', 'mcleod ganj', 'dalhousie', 'kullu', 'spiti', 'kinnaur', 
        'jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'bikaner', 'pushkar', 'mount abu', 
        'alleppey', 'munnar', 'thekkady', 'kochi', 'trivandrum', 'kumarakom', 'wayanad', 
        'coorg', 'mysore', 'hampi', 'badami', 'pattadakal', 'bijapur', 'gokarna', 
        'mumbai', 'pune', 'nashik', 'aurangabad', 'ajanta', 'ellora', 'lonavala', 
        'mahabaleshwar', 'panchgani', 'alibaug', 'ratnagiri', 'ganpatipule', 'tarkarli', 
        'delhi', 'agra', 'fatehpur sikri', 'mathura', 'vrindavan', 'haridwar', 'rishikesh', 
        'dehradun', 'mussoorie', 'nainital', 'ranikhet', 'almora', 'kausani', 'corbett', 
        'kolkata', 'darjeeling', 'kalimpong', 'gangtok', 'pelling', 'lachen', 'lachung', 
        'guwahati', 'kaziranga', 'manas', 'majuli', 'shillong', 'cherrapunji', 'mawlynnong', 
        'imphal', 'kohima', 'aizawl', 'agartala', 'itanagar', 'gangtok', 'leh', 'kargil', 
        'srinagar', 'gulmarg', 'pahalgam', 'sonamarg', 'yusmarg', 'kupwara', 'kishtwar',
        
        // Union Territories
        'delhi', 'chandigarh', 'puducherry', 'dadra and nagar haveli', 'daman and diu', 
        'lakshadweep', 'andaman and nicobar islands', 'jammu and kashmir', 'ladakh'
    ];
    
    const normalizedDestination = destination.toLowerCase().trim();
    
    // Check if destination contains any Indian location
    return indianDestinations.some(location => 
        normalizedDestination.includes(location) || location.includes(normalizedDestination)
    );
};

// --- Mock Data and other functions ---
const destinationsData = {
    "rajasthan": {
        name: "Royal Rajasthan",
        sightseeing: ["City Palace, Udaipur", "Amber Fort, Jaipur", "Hawa Mahal, Jaipur", "Mehrangarh Fort, Jodhpur", "Jaisalmer Fort", "Umaid Bhawan Palace", "Lake Pichola"],
        dining: ["Spice Court", "Chokhi Dhani", "Laxmi Misthan Bhandar", "Gypsy Dining Hall", "On The Rocks", "Sheesh Mahal"],
        activities: ["Desert Safari in Jaisalmer", "Hot Air Ballooning in Jaipur", "Ziplining at Mehrangarh", "Cultural Puppet Show", "Boating on Lake Pichola"],
        shopping: ["Johari Bazaar", "Bapu Bazaar", "Sadar Bazaar"]
    },
    "kerala": {
        name: "Kerala Backwaters & Hills",
        sightseeing: ["Fort Kochi", "Chinese Fishing Nets", "Munnar Tea Gardens", "Periyar National Park", "Mattupetty Dam"],
        dining: ["Kashi Art Cafe", "Dal Roti", "The Rice Boat", "Saravana Bhavan", "Grand Pavilion"],
        activities: ["Backwater Houseboat Cruise", "Kathakali Performance", "Spice Plantation Tour", "Ayurvedic Massage", "Elephant Junction"],
        shopping: ["Lulu Mall", "Jew Town", "Local Spice Markets"]
    },
    "goa": {
        name: "Goa Beach Paradise",
        sightseeing: ["Basilica of Bom Jesus", "Fort Aguada", "Dudhsagar Falls", "Old Goa Churches"],
        dining: ["Britto's at Baga", "Thalassa, Vagator", "Martin's Corner, Betalbatim", "Fisherman's Wharf", "Curlies Beach Shack"],
        activities: ["Water Sports at Baga Beach", "Dolphin Sighting Trip", "Scuba Diving at Grande Island", "Visit a Spice Farm", "Casino Royale"],
        shopping: ["Anjuna Flea Market", "Calangute Market Square", "Saturday Night Market"]
    },
    "himachal": {
        name: "Himachal Mountain Escape",
        sightseeing: ["Hadimba Temple, Manali", "Solang Valley", "Rohtang Pass", "Jakhoo Temple, Shimla", "The Ridge, Shimla"],
        dining: ["Johnson's Cafe", "Cafe Simla Times", "The Corner House", "Dylan's Toasted and Roasted"],
        activities: ["Paragliding in Solang", "River Rafting in Kullu", "Trekking to Triund", "Toy Train Ride in Shimla"],
        shopping: ["Mall Road, Shimla", "Old Manali Market"]
    },
    "varanasi": {
        name: "Spiritual Varanasi",
        sightseeing: ["Kashi Vishwanath Temple", "Dashashwamedh Ghat", "Sarnath", "Manikarnika Ghat"],
        dining: ["Kashi Chaat Bhandar", "Deena Chaat Bhandar", "Blue Lassi"],
        activities: ["Ganga Aarti Ceremony", "Sunrise Boat Ride", "Walking tour of the Ghats"],
        shopping: ["Thatheri Bazar", "Godowlia Market"]
    },
    "default": {
        name: "Awesome Trip",
        sightseeing: ["Historic Landmark", "Famous Museum", "Scenic Viewpoint", "Botanical Gardens"],
        dining: ["Top Rated Local Restaurant", "Quaint Cafe", "Fine Dining Experience", "Street Food Tour"],
        activities: ["Guided City Tour", "Cooking Class", "River Cruise", "Hiking Trail"],
        shopping: ["Main Shopping Street", "Local Artisan Market"]
    }
};
const activityIcons = {
    transport: { icon: Plane, color: "text-blue-400" },
    accommodation: { icon: Hotel, color: "text-purple-400" },
    sightseeing: { icon: Camera, color: "text-pink-400" },
    dining: { icon: Utensils, color: "text-orange-400" },
    activity: { icon: FerrisWheel, color: "text-teal-400" },
    shopping: { icon: ShoppingCart, color: "text-yellow-400" },
    entertainment: { icon: Drama, color: "text-red-400" },
    default: { icon: MapPin, color: "text-gray-400" },
};
const packageData = {
    cultural: [
        { id: 'c1', name: 'Golden Triangle Odyssey', image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Explore the iconic cities of Delhi, Agra, and Jaipur.', durations: [{ days: 5, price: '₹35,000' }, { days: 7, price: '₹45,000' }] },
        { id: 'c2', name: 'Colors of Rajasthan', image: 'https://images.pexels.com/photos/3579181/pexels-photo-3579181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Experience the royal heritage of Udaipur and Jodhpur.', durations: [{ days: 4, price: '₹30,000' }, { days: 6, price: '₹42,000' }] },
        { id: 'c3', name: 'South India Temple Tour', image: 'https://images.pexels.com/photos/14875323/pexels-photo-14875323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Visit the magnificent temples of Madurai and Thanjavur.', durations: [{ days: 6, price: '₹48,000' }] },
    ],
    adventure: [
        { id: 'a1', name: 'Himalayan High', image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Trekking and paragliding in Manali and Solang Valley.', durations: [{ days: 6, price: '₹40,000' }, { days: 8, price: '₹55,000' }] },
        { id: 'a2', name: 'Rishikesh River Rush', image: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'White water rafting and bungee jumping.', durations: [{ days: 4, price: '₹28,000' }] },
        { id: 'a3', name: 'Scuba in Andaman', image: 'https://images.pexels.com/photos/1473199/pexels-photo-1473199.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Explore the underwater world of the Andaman Islands.', durations: [{ days: 5, price: '₹58,000' }] },
    ],
    hiddenGems: [
        { id: 'hg1', name: 'Meghalaya\'s Wonders', image: 'https://images.pexels.com/photos/16842516/pexels-photo-16842516/free-photo-of-a-waterfall-in-a-jungle.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Discover living root bridges and serene lakes.', durations: [{ days: 7, price: '₹60,000' }] },
        { id: 'hg2', name: 'Hampi\'s Boulders', image: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Explore the ancient ruins and unique landscape of Hampi.', durations: [{ days: 4, price: '₹32,000' }] },
        { id: 'hg3', name: 'Spiti Valley Expedition', image: 'https://images.pexels.com/photos/11189809/pexels-photo-11189809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'A road trip through the cold desert mountains.', durations: [{ days: 8, price: '₹75,000' }] },
    ],
    religious: [
        { id: 'r1', name: 'Varanasi Spiritual Sojourn', image: 'https://images.pexels.com/photos/3889868/pexels-photo-3889868.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Experience the Ganga Aarti and ancient temples of Kashi.', durations: [{ days: 4, price: '₹25,000' }] },
        { id: 'r2', name: 'Golden Temple & Amritsar', image: 'https://images.pexels.com/photos/975382/pexels-photo-975382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'A journey of peace to the Golden Temple and Wagah Border.', durations: [{ days: 4, price: '₹22,000' }] },
        { id: 'r3', name: 'Char Dham Yatra', image: 'https://images.pexels.com/photos/1608111/pexels-photo-1608111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'A pilgrimage to the four holy sites in Uttarakhand.', durations: [{ days: 8, price: '₹80,000' }] },
    ],
};
const getRandomElement = (arr, used = new Set()) => {
    if (arr.length === 0) return null;
    if (used.size >= arr.length) used.clear();
    let element;
    do {
        element = arr[Math.floor(Math.random() * arr.length)];
    } while (used.has(element));
    used.add(element);
    return element;
};
const parsePrice = (priceString = "") => {
    return Number(priceString.replace(/[^0-9]/g, ''));
};
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Helper function to add time to a date
const addTimeToDate = (date, timeString) => {
    try {
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;
        
        const newDate = new Date(date);
        newDate.setHours(hour24, minutes, 0, 0);
        return newDate;
    } catch (error) {
        console.error('Error adding time to date:', error);
        return new Date(date); // Return original date as fallback
    }
};

// Helper function to add hours to a date
const addHoursToDate = (date, hours) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
};

// Helper function to get arrival time from flight/train
const getArrivalTime = (departureTime, duration) => {
    try {
        // Handle different time formats
        let time, period;
        if (departureTime.includes(' - ')) {
            // Format: "2:00 PM - 4:00 PM"
            [time, period] = departureTime.split(' - ')[0].split(' ');
        } else {
            // Format: "2:00 PM"
            [time, period] = departureTime.split(' ');
        }
        
        const [hours, minutes] = time.split(':').map(Number);
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;
        
        // Parse duration (e.g., "2h 15m" or "6h")
        const durationMatch = duration.match(/(\d+)h(?:\s*(\d+)m)?/);
        const durationHours = parseInt(durationMatch?.[1]) || 0;
        const durationMinutes = parseInt(durationMatch?.[2]) || 0;
        
        const totalMinutes = hour24 * 60 + minutes + durationHours * 60 + durationMinutes;
        const arrivalHour24 = Math.floor(totalMinutes / 60) % 24;
        const arrivalMinutes = totalMinutes % 60;
        
        const arrivalPeriod = arrivalHour24 >= 12 ? 'PM' : 'AM';
        const displayHour = arrivalHour24 === 0 ? 12 : arrivalHour24 > 12 ? arrivalHour24 - 12 : arrivalHour24;
        
        return `${displayHour}:${arrivalMinutes.toString().padStart(2, '0')} ${arrivalPeriod}`;
    } catch (error) {
        console.error('Error calculating arrival time:', error);
        return "4:00 PM"; // Default fallback
    }
};

// Rich mock data for editor when AI doesn't provide choices
const buildMockFlights = (prefix) => {
    const airlines = ['IndiGo', 'Vistara', 'Air India', 'SpiceJet', 'Akasa Air'];
    const classes = ['Economy', 'Premium Economy', 'Business'];
    const gen = (startHour, label) => Array.from({ length: 5 }, (_, i) => {
        const depH = (startHour + i) % 24;
        const arrH = (depH + 2) % 24;
        const dep = `${String(depH).padStart(2,'0')}:00`;
        const arr = `${String(arrH).padStart(2,'0')}:05`;
        const airline = airlines[i % airlines.length];
        const cls = classes[i % classes.length];
        const base = 3800 + i * 450 + (cls === 'Business' ? 4000 : cls === 'Premium Economy' ? 1500 : 0);
        return { id: `${prefix}-${label}-${i+1}`, airline, time: `${dep} - ${arr}`, duration: '2h 5m', class: cls, price: `₹${base.toLocaleString('en-IN')}` };
    });
    return {
        earlyMorning: gen(5, 'early'),
        morning: gen(8, 'morning'),
        afternoon: gen(13, 'afternoon'),
        evening: gen(18, 'evening'),
        midnight: gen(0, 'midnight'),
        lateNight: gen(22, 'latenight'),
    };
};

const mockTravelData = {
    flights: buildMockFlights('dep'),
    returnFlights: buildMockFlights('ret'),
    trains: Array.from({ length: 5 }, (_, i) => ({
        id: `t${i+1}`,
        name: ['Shatabdi Express', 'Rajdhani Express', 'Duronto Express', 'Tejas Express', 'Gatimaan Express'][i],
        time: `${String(6+i).padStart(2,'0')}:00 - ${String(12+i).padStart(2,'0')}:00`,
        duration: `${6+i}h`,
        class: ['AC Chair Car', 'AC 3 Tier', 'AC 2 Tier', 'Sleeper', 'First AC'][i],
        availability: i % 2 === 0 ? 'Available' : 'WL 12',
        price: `₹${(900 + i*250).toLocaleString('en-IN')}`
    })),
    returnTrains: Array.from({ length: 5 }, (_, i) => ({
        id: `rt${i+1}`,
        name: ['Shatabdi Express', 'Rajdhani Express', 'Duronto Express', 'Tejas Express', 'Gatimaan Express'][i],
        time: `${String(7+i).padStart(2,'0')}:00 - ${String(13+i).padStart(2,'0')}:00`,
        duration: `${6+i}h`,
        class: ['AC Chair Car', 'AC 3 Tier', 'AC 2 Tier', 'Sleeper', 'First AC'][i],
        availability: i % 2 === 0 ? 'Available' : 'WL 9',
        price: `₹${(950 + i*250).toLocaleString('en-IN')}`
    })),
    hotels: {
        luxury: Array.from({ length: 5 }, (_, i) => ({ id: `h5-${i+1}`, name: `5★ Grand ${i+1}`, rating: '4.8', amenities: 'Wi‑Fi, AC, Pool, Spa', price: `₹${(7500 + i*800).toLocaleString('en-IN')}` })),
        midRange: Array.from({ length: 5 }, (_, i) => ({ id: `h3-${i+1}`, name: `3★ Comfort ${i+1}`, rating: '4.0', amenities: 'Wi‑Fi, AC, Restaurant', price: `₹${(3200 + i*300).toLocaleString('en-IN')}` })),
        budget: Array.from({ length: 5 }, (_, i) => ({ id: `h1-${i+1}`, name: `2★ Budget ${i+1}`, rating: '3.2', amenities: 'Wi‑Fi', price: `₹${(1500 + i*200).toLocaleString('en-IN')}` })),
    }
};

const normalizeFlightBuckets = (data, fallback = {}) => {
    if (!data) return fallback;

    if (Array.isArray(data)) {
        return data.length ? { anytime: data } : fallback;
    }

    if (typeof data === 'object') {
        const normalized = Object.entries(data).reduce((acc, [key, value]) => {
            if (Array.isArray(value)) {
                if (value.length) acc[key] = value;
            } else if (value && typeof value === 'object') {
                acc[key] = [value];
            }
            return acc;
        }, {});

        return Object.keys(normalized).length ? normalized : fallback;
    }

    return fallback;
};

const TripPlannerSection = () => {
    const [activeTab, setActiveTab] = useState("planner");
    const [generatedItinerary, setGeneratedItinerary] = useState(null);
    const [isEditingItinerary, setIsEditingItinerary] = useState(false);
    const [isViewingPackage, setIsViewingPackage] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedDurations, setSelectedDurations] = useState({});
    const [editorActiveTab, setEditorActiveTab] = useState('flights');
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [pendingItinerary, setPendingItinerary] = useState(null);
    const [pendingTripDetails, setPendingTripDetails] = useState(null);
    const [date, setDate] = useState(null);
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
    const [tripDetails, setTripDetails] = useState({
        destination: "",
        duration: "",
        budget: "",
        adults: 1,
        children: 0,
        departureAirport: "",
        departureStation: "",
        preferences: ""
    });
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [selectedReturnTrain, setSelectedReturnTrain] = useState(null);
    const [transportMode, setTransportMode] = useState('flight');
    const [returnTransportMode, setReturnTransportMode] = useState('flight');
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const { user } = useAuth();
    const { initiateBooking } = useBooking();
    const navigate = useNavigate();
    const location = useLocation();

    const durationDays = useMemo(() => {
        if (date?.from && date?.to) {
            // +1 to include the start day
            return differenceInCalendarDays(date.to, date.from) + 1;
        }
        return null;
    }, [date]);

    // **FIX:** This useEffect now handles both setting and clearing the duration
    useEffect(() => {
        setTripDetails(prev => ({
            ...prev,
            duration: durationDays ? `${durationDays} days` : ''
        }));
    }, [durationDays]);

    // Validate total travelers don't exceed 15
    useEffect(() => {
        const totalTravelers = tripDetails.adults + tripDetails.children;
        if (totalTravelers > 15) {
            toast({
                title: "Traveler Limit Exceeded",
                description: "Maximum 15 travelers allowed. Please adjust the number of adults and children.",
                variant: "destructive",
            });
        }
    }, [tripDetails.adults, tripDetails.children, toast]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const destinationFromUrl = params.get('destination');
        if (destinationFromUrl) {
            const decodedDestination = decodeURIComponent(destinationFromUrl);
            const destinationMapping = {
                "Kerala Backwaters": "Kerala",
                "Rajasthan Desert Safari": "Rajasthan",
                "Himachal Mountain Retreat": "Himachal",
                "Goa Beach Paradise": "Goa"
            };
            setTripDetails(prev => ({
                ...prev,
                destination: destinationMapping[decodedDestination] || decodedDestination
            }));
        }
    }, [location.search]);

    // Auto-generate itinerary after login if there are pending trip details
    useEffect(() => {
        if (user && pendingTripDetails && !generatedItinerary) {
            generateItineraryAfterLogin();
        }
    }, [user, pendingTripDetails, generatedItinerary]);

    // Load pending trip details from localStorage after login/navigation
    useEffect(() => {
        if (!pendingTripDetails) {
            const stored = localStorage.getItem('pendingTripDetails');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setPendingTripDetails(parsed);
                    if (parsed?.dateRange?.from && parsed?.dateRange?.to) {
                        setDate({ from: new Date(parsed.dateRange.from), to: new Date(parsed.dateRange.to) });
                    }
                } catch {}
            }
        }
    }, [pendingTripDetails]);

    const generateItinerary = async () => {
        setIsGenerating(true);
        // Close the date popover to prevent overlapping
        setIsDatePopoverOpen(false);

        if (!tripDetails.destination || !tripDetails.duration) {
            toast({
                title: "Missing Information",
                description: "Please enter a destination and select date range.",
                variant: "destructive",
            });
            setIsGenerating(false);
            return;
        }

        // Validate destination is in India
        if (!isValidIndianDestination(tripDetails.destination)) {
            toast({
                title: "Invalid Destination",
                description: "Please enter a valid destination within India.",
                variant: "destructive",
            });
            setIsGenerating(false);
            return;
        }

        const numDays = parseInt(tripDetails.duration.split(' ')[0], 10);
        
        // Check if trip duration exceeds 15 days
        if (numDays > 15) {
            toast({
                title: "Trip Duration Limit Exceeded",
                description: "Maximum trip duration allowed is 15 days. Please select a shorter duration.",
                variant: "destructive",
            });
            setIsGenerating(false);
            return;
        }

        // Check if total travelers exceed 15
        const totalTravelers = tripDetails.adults + tripDetails.children;
        if (totalTravelers > 15) {
            toast({
                title: "Traveler Limit Exceeded",
                description: "Maximum 15 travelers allowed. Please adjust the number of adults and children.",
                variant: "destructive",
            });
            setIsGenerating(false);
            return;
        }

        // Check if user is logged in for AI generation
        if (!user) {
            // Persist trip details + date range and redirect to login
            const resumeData = {
                ...tripDetails,
                dateRange: {
                    from: date?.from ? format(date.from, 'yyyy-MM-dd') : null,
                    to: date?.to ? format(date.to, 'yyyy-MM-dd') : null,
                },
            };
            localStorage.setItem('pendingTripDetails', JSON.stringify(resumeData));
            setPendingTripDetails(resumeData);
            setIsGenerating(false);
            navigate('/login', { state: { from: { pathname: '/', search: '?showItinerary=true' } } });
            return;
        }

        try {
            console.log('Starting AI itinerary generation...');
            
            // Prepare trip details for AI
            const aiTripDetails = {
                destination: tripDetails.destination,
                duration: tripDetails.duration,
                budget: tripDetails.budget,
                adults: tripDetails.adults,
                children: tripDetails.children,
                departureAirport: tripDetails.departureAirport,
                departureStation: tripDetails.departureStation,
                preferences: tripDetails.preferences,
                startDate: date?.from ? format(date.from, 'yyyy-MM-dd') : null,
                endDate: date?.to ? format(date.to, 'yyyy-MM-dd') : null
            };

            // Generate itinerary using AI
            const aiResponse = await itineraryService.generateItinerary(aiTripDetails);
            
            console.log('AI itinerary generated successfully:', aiResponse);

            // Handle both string (text) and object responses from AI
            let itinerary;
            if (typeof aiResponse === 'string') {
                // If AI returns plain text, create structured object with trip details and mock data
                itinerary = {
                    destination: tripDetails.destination,
                    duration: tripDetails.duration,
                    budget: tripDetails.budget,
                    aiText: aiResponse, // Store the AI-generated text
                    days: mockTravelData.days || [], // Use mock days structure
                    ...mockTravelData // Include all mock data
                };
            } else if (aiResponse && typeof aiResponse === 'object') {
                // If AI returns structured object, use it directly
                itinerary = {
                    ...aiResponse,
                    // Ensure all required fields exist
                    destination: aiResponse.destination || tripDetails.destination,
                    duration: aiResponse.duration || tripDetails.duration,
                    budget: aiResponse.budget || tripDetails.budget,
                    days: aiResponse.days || []
                };
            } else {
                // Fallback: create basic structure
                itinerary = {
                    destination: tripDetails.destination,
                    duration: tripDetails.duration,
                    budget: tripDetails.budget,
                    days: []
                };
            }

            // Merge in rich mock data if API omitted sections
            const mergedFlights = normalizeFlightBuckets(itinerary.transportation?.flights, mockTravelData.flights);
            const mergedReturnFlights = normalizeFlightBuckets(itinerary.transportation?.returnFlights, mockTravelData.returnFlights);
            const mergedTrains = itinerary.transportation?.trains?.length ? itinerary.transportation.trains : mockTravelData.trains;
            const mergedReturnTrains = itinerary.transportation?.returnTrains?.length ? itinerary.transportation.returnTrains : mockTravelData.returnTrains;
            const mergedHotels = itinerary.accommodation || mockTravelData.hotels;
            
            // Ensure days array exists and has proper structure
            if (!itinerary.days || !Array.isArray(itinerary.days) || itinerary.days.length === 0) {
                itinerary.days = mockTravelData.days || [];
            } else {
                // Add dates to each day if not present
                const startDateObj = date?.from ? new Date(date.from) : (itinerary.startDate ? new Date(itinerary.startDate) : null);
                
                itinerary.days = itinerary.days.map((day, index) => {
                    // Calculate date for this day if not provided
                    let dayDate = day.date;
                    if (!dayDate && startDateObj) {
                        const currentDate = new Date(startDateObj);
                        currentDate.setDate(startDateObj.getDate() + (day.day - 1));
                        dayDate = currentDate.toISOString().split('T')[0];
                    }
                    
                    return {
                        ...day,
                        date: dayDate,
                        alternatives: day.alternatives || [],
                        activities: (day.activities || []).map(activity => ({
                            ...activity,
                            duration: activity.duration || '2 hours' // Default duration if not provided
                        }))
                    };
                });
            }

            // Build final itinerary structure
            itinerary = {
                ...itinerary,
                destination: itinerary.destination || tripDetails.destination,
                duration: itinerary.duration || tripDetails.duration,
                budget: itinerary.budget || tripDetails.budget,
                transportation: {
                    flights: mergedFlights,
                    returnFlights: mergedReturnFlights,
                    trains: mergedTrains,
                    returnTrains: mergedReturnTrains,
                },
                accommodation: mergedHotels,
                // Also expose top-level fields for the editor UI
                flights: mergedFlights,
                returnFlights: mergedReturnFlights,
                trains: mergedTrains,
                returnTrains: mergedReturnTrains,
                hotels: mergedHotels
            };

            // Set default selections from merged data
            const defaultFlight = mergedFlights?.afternoon?.[0] || mergedFlights?.morning?.[0] || mergedFlights?.evening?.[0] || mergedFlights?.earlyMorning?.[0];
            const defaultReturnFlight = mergedReturnFlights?.afternoon?.[0] || mergedReturnFlights?.morning?.[0] || mergedReturnFlights?.evening?.[0] || mergedReturnFlights?.lateNight?.[0];
            const defaultHotel = mergedHotels?.midRange?.[0] || mergedHotels?.budget?.[0] || mergedHotels?.luxury?.[0];
            const defaultTrain = mergedTrains?.[0];
            const defaultReturnTrain = mergedReturnTrains?.[0];
            const defaultTransportMode = 'flight';
            const defaultReturnTransportMode = 'flight';

            if (user) {
                setGeneratedItinerary(itinerary);
                setSelectedFlight(defaultFlight);
                setSelectedReturnFlight(defaultReturnFlight);
                setSelectedHotel(defaultHotel);
                setSelectedTrain(defaultTrain);
                setSelectedReturnTrain(defaultReturnTrain);
                setTransportMode(defaultTransportMode);
                setReturnTransportMode(defaultReturnTransportMode);
                console.log('AI Itinerary set for logged in user');
            } else {
                const fullItineraryData = {
                    itinerary,
                    tripDetails,
                    selectedFlight: defaultFlight,
                    selectedReturnFlight: defaultReturnFlight,
                    selectedHotel: defaultHotel,
                    selectedTrain: defaultTrain,
                    selectedReturnTrain: defaultReturnTrain,
                    transportMode: defaultTransportMode,
                    returnTransportMode: defaultReturnTransportMode
                };
                localStorage.setItem('pendingItinerary', JSON.stringify(fullItineraryData));
                setPendingItinerary(itinerary);
                setShowAuthDialog(true);
            }
        } catch (error) {
            console.error('Error generating AI itinerary:', error);
            
            // Extract a user-friendly error message
            let errorMessage = error.message || "There was an error generating your itinerary. Please try again.";
            
            // If error message contains newlines or is too long, extract the first meaningful part
            if (errorMessage.includes('\n')) {
                const lines = errorMessage.split('\n');
                // Find the first line that's not empty and not a numbered instruction
                errorMessage = lines.find(line => 
                    line.trim() && 
                    !line.trim().match(/^\d+\./) && 
                    !line.trim().startsWith('Please:')
                ) || lines[0] || errorMessage;
            }
            
            // Truncate very long messages
            if (errorMessage.length > 200) {
                errorMessage = errorMessage.substring(0, 200) + '...';
            }
            
            toast({
                title: "Error Generating Itinerary",
                description: errorMessage,
                variant: "destructive",
            });
        }

        setIsGenerating(false);
    };

    // Function to generate itinerary after login
    const generateItineraryAfterLogin = async () => {
        if (!pendingTripDetails) return;
        
        setIsGenerating(true);
        
        try {
            console.log('Generating itinerary after login...');
            
            // Prepare trip details for AI
            const aiTripDetails = {
                destination: pendingTripDetails.destination,
                duration: pendingTripDetails.duration,
                budget: pendingTripDetails.budget,
                adults: pendingTripDetails.adults,
                children: pendingTripDetails.children,
                departureAirport: pendingTripDetails.departureAirport,
                departureStation: pendingTripDetails.departureStation,
                preferences: pendingTripDetails.preferences,
                startDate: pendingTripDetails?.dateRange?.from || (date?.from ? format(date.from, 'yyyy-MM-dd') : null),
                endDate: pendingTripDetails?.dateRange?.to || (date?.to ? format(date.to, 'yyyy-MM-dd') : null)
            };

            // Generate itinerary using AI
            const aiResponse = await itineraryService.generateItinerary(aiTripDetails);
            
            console.log('AI itinerary generated successfully after login:', aiResponse);

            // Handle both string (text) and object responses from AI
            let itinerary;
            if (typeof aiResponse === 'string') {
                // If AI returns plain text, create structured object with trip details and mock data
                itinerary = {
                    destination: pendingTripDetails.destination,
                    duration: pendingTripDetails.duration,
                    budget: pendingTripDetails.budget,
                    aiText: aiResponse, // Store the AI-generated text
                    days: mockTravelData.days || [], // Use mock days structure
                    ...mockTravelData // Include all mock data
                };
            } else if (aiResponse && typeof aiResponse === 'object') {
                // If AI returns structured object, use it directly
                itinerary = {
                    ...aiResponse,
                    // Ensure all required fields exist
                    destination: aiResponse.destination || pendingTripDetails.destination,
                    duration: aiResponse.duration || pendingTripDetails.duration,
                    budget: aiResponse.budget || pendingTripDetails.budget,
                    days: aiResponse.days || []
                };
            } else {
                // Fallback: create basic structure
                itinerary = {
                    destination: pendingTripDetails.destination,
                    duration: pendingTripDetails.duration,
                    budget: pendingTripDetails.budget,
                    days: []
                };
            }

            // Merge in rich mock data if API omitted sections
            const mergedFlights = normalizeFlightBuckets(itinerary.transportation?.flights, mockTravelData.flights);
            const mergedReturnFlights = normalizeFlightBuckets(itinerary.transportation?.returnFlights, mockTravelData.returnFlights);
            const mergedTrains = itinerary.transportation?.trains?.length ? itinerary.transportation.trains : mockTravelData.trains;
            const mergedReturnTrains = itinerary.transportation?.returnTrains?.length ? itinerary.transportation.returnTrains : mockTravelData.returnTrains;
            const mergedHotels = itinerary.accommodation || mockTravelData.hotels;
            
            // Ensure days array exists and has proper structure
            if (!itinerary.days || !Array.isArray(itinerary.days) || itinerary.days.length === 0) {
                itinerary.days = mockTravelData.days || [];
            } else {
                // Add dates to each day if not present
                const startDateObj = date?.from ? new Date(date.from) : (pendingTripDetails?.dateRange?.from ? new Date(pendingTripDetails.dateRange.from) : (itinerary.startDate ? new Date(itinerary.startDate) : null));
                
                itinerary.days = itinerary.days.map((day, index) => {
                    // Calculate date for this day if not provided
                    let dayDate = day.date;
                    if (!dayDate && startDateObj) {
                        const currentDate = new Date(startDateObj);
                        currentDate.setDate(startDateObj.getDate() + (day.day - 1));
                        dayDate = currentDate.toISOString().split('T')[0];
                    }
                    
                    return {
                        ...day,
                        date: dayDate,
                        alternatives: day.alternatives || [],
                        activities: (day.activities || []).map(activity => ({
                            ...activity,
                            duration: activity.duration || '2 hours' // Default duration if not provided
                        }))
                    };
                });
            }

            // Build final itinerary structure
            itinerary = {
                ...itinerary,
                destination: itinerary.destination || pendingTripDetails.destination,
                duration: itinerary.duration || pendingTripDetails.duration,
                budget: itinerary.budget || pendingTripDetails.budget,
                transportation: {
                    flights: mergedFlights,
                    returnFlights: mergedReturnFlights,
                    trains: mergedTrains,
                    returnTrains: mergedReturnTrains,
                },
                accommodation: mergedHotels,
                // Also expose top-level fields for the editor UI
                flights: mergedFlights,
                returnFlights: mergedReturnFlights,
                trains: mergedTrains,
                returnTrains: mergedReturnTrains,
                hotels: mergedHotels
            };

            // Set default selections from merged data
            const defaultFlight = mergedFlights?.afternoon?.[0] || mergedFlights?.morning?.[0] || mergedFlights?.evening?.[0] || mergedFlights?.earlyMorning?.[0];
            const defaultReturnFlight = mergedReturnFlights?.afternoon?.[0] || mergedReturnFlights?.morning?.[0] || mergedReturnFlights?.evening?.[0] || mergedReturnFlights?.lateNight?.[0];
            const defaultHotel = mergedHotels?.midRange?.[0] || mergedHotels?.budget?.[0] || mergedHotels?.luxury?.[0];
            const defaultTrain = mergedTrains?.[0];
            const defaultReturnTrain = mergedReturnTrains?.[0];
            const defaultTransportMode = 'flight';
            const defaultReturnTransportMode = 'flight';

            setGeneratedItinerary(itinerary);
            setSelectedFlight(defaultFlight);
            setSelectedReturnFlight(defaultReturnFlight);
            setSelectedHotel(defaultHotel);
            setSelectedTrain(defaultTrain);
            setSelectedReturnTrain(defaultReturnTrain);
            setTransportMode(defaultTransportMode);
            setReturnTransportMode(defaultReturnTransportMode);
            
            // Clear pending data
            setPendingTripDetails(null);
            localStorage.removeItem('pendingTripDetails');
            setShowAuthDialog(false);
            
            toast({
                title: "Itinerary Generated!",
                description: "Your AI-powered itinerary has been created successfully.",
            });
            
        } catch (error) {
            console.error('Error generating itinerary after login:', error);
            
            // Extract a user-friendly error message
            let errorMessage = error.message || "There was an error generating your itinerary. Please try again.";
            
            // If error message contains newlines or is too long, extract the first meaningful part
            if (errorMessage.includes('\n')) {
                const lines = errorMessage.split('\n');
                errorMessage = lines.find(line => 
                    line.trim() && 
                    !line.trim().match(/^\d+\./) && 
                    !line.trim().startsWith('Please:')
                ) || lines[0] || errorMessage;
            }
            
            // Truncate very long messages
            if (errorMessage.length > 200) {
                errorMessage = errorMessage.substring(0, 200) + '...';
            }
            
            toast({
                title: "Error Generating Itinerary",
                description: errorMessage,
                variant: "destructive",
            });
        }
        
        setIsGenerating(false);
    };

    // Function to regenerate itinerary with customizations
    const regenerateItinerary = async (customizations = {}) => {
        if (!generatedItinerary) return;

        setIsGenerating(true);
        
        try {
            console.log('Regenerating itinerary with customizations...');
            
            const modifications = {
                preferences: customizations.preferences || tripDetails.preferences,
                startDate: customizations.startDate || (date?.from ? format(date.from, 'yyyy-MM-dd') : null),
                endDate: customizations.endDate || (date?.to ? format(date.to, 'yyyy-MM-dd') : null)
            };

            const newItinerary = await itineraryService.regenerateItinerary(
                generatedItinerary, 
                modifications, 
                customizations
            );
            
            console.log('Itinerary regenerated successfully:', newItinerary);
            
            // Update the generated itinerary
            setGeneratedItinerary(newItinerary);
            
            toast({
                title: "Itinerary Updated",
                description: "Your itinerary has been regenerated with the new preferences.",
            });
            
        } catch (error) {
            console.error('Error regenerating itinerary:', error);
            
            // Extract a user-friendly error message
            let errorMessage = error.message || "There was an error updating your itinerary. Please try again.";
            
            // If error message contains newlines or is too long, extract the first meaningful part
            if (errorMessage.includes('\n')) {
                const lines = errorMessage.split('\n');
                errorMessage = lines.find(line => 
                    line.trim() && 
                    !line.trim().match(/^\d+\./) && 
                    !line.trim().startsWith('Please:')
                ) || lines[0] || errorMessage;
            }
            
            // Truncate very long messages
            if (errorMessage.length > 200) {
                errorMessage = errorMessage.substring(0, 200) + '...';
            }
            
            toast({
                title: "Error Updating Itinerary",
                description: errorMessage,
                variant: "destructive",
            });
        }
        
        setIsGenerating(false);
    };
    
    const totalPrice = useMemo(() => {
        if (!generatedItinerary) return { subtotal: 0, gst: 0, total: 0, departureCost: 0, returnCost: 0, hotelCost: 0, roomsRequired: 0 };
    
        const numAdults = tripDetails.adults || 1;
        const numChildren = tripDetails.children || 0;
        const totalTravelers = numAdults + numChildren;
        const numDays = generatedItinerary.duration ? parseInt(generatedItinerary.duration.split(' ')[0], 10) : 1;
    
        // Calculate departure transport cost (per person)
        let departureCost = 0;
        if (transportMode === 'flight' && selectedFlight) {
            departureCost = parsePrice(selectedFlight.price) * totalTravelers;
        } else if (transportMode === 'train' && selectedTrain) {
            departureCost = parsePrice(selectedTrain.price) * totalTravelers;
        }
    
        // Calculate return transport cost (per person)
        let returnCost = 0;
        if (returnTransportMode === 'flight' && selectedReturnFlight) {
            returnCost = parsePrice(selectedReturnFlight.price) * totalTravelers;
        } else if (returnTransportMode === 'train' && selectedReturnTrain) {
            returnCost = parsePrice(selectedReturnTrain.price) * totalTravelers;
        }
    
        // Calculate hotel rooms required (2 adults + 2 children per room)
        const roomsRequired = Math.ceil((numAdults + Math.ceil(numChildren / 2)) / 2);
        const hotelCost = selectedHotel ? parsePrice(selectedHotel.price) * numDays * roomsRequired : 0;
    
        const subtotal = departureCost + returnCost + hotelCost;
        const gst = subtotal * 0.18;
        const total = subtotal + gst;
    
        return { subtotal, gst, total, departureCost, returnCost, hotelCost, roomsRequired, totalTravelers };
      }, [selectedFlight, selectedReturnFlight, selectedHotel, selectedTrain, selectedReturnTrain, transportMode, returnTransportMode, generatedItinerary, tripDetails.adults, tripDetails.children]);

      const openEditor = (tab) => {
        setEditorActiveTab(tab);
        setIsEditingItinerary(true);
      }
      const handleBookNow = () => {
        const bookingData = {
          destination: generatedItinerary.destination,
          duration: generatedItinerary.duration,
          adults: tripDetails.adults,
          children: tripDetails.children,
          totalTravelers: totalPrice.totalTravelers,
          roomsRequired: totalPrice.roomsRequired,
          departureFlight: transportMode === 'flight' ? selectedFlight : null,
          departureTrain: transportMode === 'train' ? selectedTrain : null,
          returnFlight: returnTransportMode === 'flight' ? selectedReturnFlight : null,
          returnTrain: returnTransportMode === 'train' ? selectedReturnTrain : null,
          hotel: selectedHotel,
          departureCost: formatCurrency(totalPrice.departureCost),
          returnCost: formatCurrency(totalPrice.returnCost),
          hotelCost: formatCurrency(totalPrice.hotelCost),
          subtotal: formatCurrency(totalPrice.subtotal),
          gst: formatCurrency(totalPrice.gst),
          total: formatCurrency(totalPrice.total),
        };
        initiateBooking(bookingData);
        navigate('/payment');
      };
      const handleViewPackage = (pkg) => {
          const duration = selectedDurations[pkg.id] || pkg.durations[0];
          const destinationKey = pkg.name.split(' ')[0].toLowerCase();
          const itineraryData = destinationsData[destinationKey] || destinationsData.default;
    
          const days = Array.from({ length: duration.days }, (_, i) => ({
            day: i + 1,
            city: itineraryData.name,
            activities: [
                { time: "10:00 AM", title: `Visit ${getRandomElement(itineraryData.sightseeing)}`, type: "sightseeing"},
                { time: "1:00 PM", title: `Lunch at ${getRandomElement(itineraryData.dining)}`, type: "dining"},
                { time: "3:00 PM", title: getRandomElement(itineraryData.activities), type: "activity"},
                { time: "7:00 PM", title: `Dinner`, type: "dining"},
            ]
          }));
          
          setSelectedPackage({ ...pkg, selectedDuration: duration, itinerary: {days} });
          setIsViewingPackage(true);
      }
      const AuthDialog = () => (
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center gradient-text">
                Login Required for AI Itinerary
              </DialogTitle>
              <DialogDescription className="text-center text-muted-foreground pt-2">
                AI-powered itinerary generation requires login. Your trip details will be saved and the itinerary will be generated automatically after you log in.
              </DialogDescription>
            </DialogHeader>
            
            {pendingTripDetails && (
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">Your Trip Details:</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Destination:</span> {pendingTripDetails.destination}</p>
                  <p><span className="font-medium">Duration:</span> {pendingTripDetails.duration}</p>
                  <p><span className="font-medium">Budget:</span> {pendingTripDetails.budget}</p>
                  <p><span className="font-medium">Travelers:</span> {pendingTripDetails.adults} adults, {pendingTripDetails.children} children</p>
                  {pendingTripDetails.preferences && (
                    <p><span className="font-medium">Preferences:</span> {pendingTripDetails.preferences}</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-col space-y-2 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/login', { state: { from: { pathname: '/', search: '?showItinerary=true' } } })}
                className="bg-gradient-hero hover:opacity-90"
              >
                Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/signup', { state: { from: { pathname: '/', search: '?showItinerary=true' } } })}
              >
                Sign Up
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
      const ItineraryEditor = () => (
        <Dialog open={isEditingItinerary} onOpenChange={setIsEditingItinerary}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customize Your Trip</DialogTitle>
              <DialogDescription>Select flights, hotels, and activities that best suit your travel style.</DialogDescription>
            </DialogHeader>
            
            <Tabs value={editorActiveTab} onValueChange={setEditorActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="flights">Departure Flights</TabsTrigger>
                <TabsTrigger value="trains">Departure Trains</TabsTrigger>
                <TabsTrigger value="returnFlights">Arrival Flights</TabsTrigger>
                <TabsTrigger value="returnTrains">Arrival Trains</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="flights" className="space-y-4">
                {Object.entries(generatedItinerary?.flights || {}).map(([timeOfDay, flights]) => (
                    <div key={timeOfDay}>
                        <h3 className="text-lg font-semibold capitalize mb-2">{timeOfDay.replace(/([A-Z])/g,' $1').trim()} Departure Flights</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Travel Date: {date?.from ? format(date.from, "MMM dd, yyyy") : "Not selected"}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {flights.map((flight) => (
                                <Card key={flight.id} onClick={() => { setSelectedFlight(flight); setTransportMode('flight'); }} className={`cursor-pointer hover:shadow-lg transition-all ${selectedFlight?.id === flight.id && transportMode === 'flight' ? 'ring-2 ring-primary border-primary' : ''}`}>
                                    <CardContent className="p-4 relative">
                                        {selectedFlight?.id === flight.id && transportMode === 'flight' && <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">{flight.airline}</span>
                                            <Plane className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">{flight.time} • {flight.duration}</p>
                                        <p className="text-sm text-foreground">{flight.class}</p>
                                        <p className="text-lg font-bold text-primary mt-1">{flight.price} per person</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
              </TabsContent>
    
              <TabsContent value="trains" className="space-y-4">
                <h3 className="text-lg font-semibold">Departure Train Options</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Travel Date: {date?.from ? format(date.from, "MMM dd, yyyy") : "Not selected"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(generatedItinerary?.trains || []).map((train) => (
                        <Card key={train.id} onClick={() => { setSelectedTrain(train); setTransportMode('train'); }} className={`cursor-pointer hover:shadow-lg transition-all ${selectedTrain?.id === train.id && transportMode === 'train' ? 'ring-2 ring-primary border-primary' : ''}`}>
                            <CardContent className="p-4 relative">
                                {selectedTrain?.id === train.id && transportMode === 'train' && <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">{train.name}</span>
                                    <Train className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">{train.time} • {train.duration}</p>
                                <p className="text-xs text-foreground">{train.class} • {train.availability || 'Available'}</p>
                                <p className="text-lg font-bold text-primary mt-1">{train.price} per person</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="returnFlights" className="space-y-4">
                {Object.entries(generatedItinerary?.returnFlights || {}).map(([timeOfDay, flights]) => (
                    <div key={timeOfDay}>
                        <h3 className="text-lg font-semibold capitalize mb-2">{timeOfDay.replace(/([A-Z])/g,' $1').trim()} Arrival Flights</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Arrival Date: {date?.to ? format(date.to, "MMM dd, yyyy") : "Not selected"}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {flights.map((flight) => (
                                <Card key={flight.id} onClick={() => { setSelectedReturnFlight(flight); setReturnTransportMode('flight'); }} className={`cursor-pointer hover:shadow-lg transition-all ${selectedReturnFlight?.id === flight.id && returnTransportMode === 'flight' ? 'ring-2 ring-primary border-primary' : ''}`}>
                                    <CardContent className="p-4 relative">
                                        {selectedReturnFlight?.id === flight.id && returnTransportMode === 'flight' && <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">{flight.airline}</span>
                                            <Plane className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">{flight.time} • {flight.duration}</p>
                                        <p className="text-sm text-foreground">{flight.class}</p>
                                        <p className="text-lg font-bold text-primary mt-1">{flight.price} per person</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
              </TabsContent>
              
              <TabsContent value="returnTrains" className="space-y-4">
                <h3 className="text-lg font-semibold">Arrival Train Options</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Arrival Date: {date?.to ? format(date.to, "MMM dd, yyyy") : "Not selected"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(generatedItinerary?.returnTrains || []).map((train) => (
                        <Card key={train.id} onClick={() => { setSelectedReturnTrain(train); setReturnTransportMode('train'); }} className={`cursor-pointer hover:shadow-lg transition-all ${selectedReturnTrain?.id === train.id && returnTransportMode === 'train' ? 'ring-2 ring-primary border-primary' : ''}`}>
                            <CardContent className="p-4 relative">
                                {selectedReturnTrain?.id === train.id && returnTransportMode === 'train' && <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">{train.name}</span>
                                    <Train className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">{train.time} • {train.duration}</p>
                                <p className="text-xs text-foreground">{train.class} • {train.availability || 'Available'}</p>
                                <p className="text-lg font-bold text-primary mt-1">{train.price} per person</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="hotels" className="space-y-4">
                {Object.entries(generatedItinerary?.hotels || {}).map(([category, hotels]) => (
                    <div key={category}>
                        <h3 className="text-lg font-semibold capitalize mb-2">{category.replace(/([A-Z])/g, ' $1').trim()} Hotels</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {hotels.map((hotel) => (
                                <Card key={hotel.id} onClick={() => setSelectedHotel(hotel)} className={`cursor-pointer hover:shadow-lg transition-all ${selectedHotel?.id === hotel.id ? 'ring-2 ring-primary border-primary' : ''}`}>
                                    <CardContent className="p-4 relative">
                                        {selectedHotel?.id === hotel.id && <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">{hotel.name}</span>
                                            <Hotel className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">Rating: {hotel.rating}/5</p>
                                        <p className="text-xs text-muted-foreground">{hotel.amenities}</p>
                                        <p className="text-lg font-bold text-primary mt-1">{hotel.price}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
              </TabsContent>
              
              <TabsContent value="activities" className="space-y-4">
                <h3 className="text-lg font-semibold">Customize Your Activities</h3>
                {generatedItinerary?.days.map((day, dayIndex) => (
                  <Card key={dayIndex}>
                    <CardHeader>
                      <CardTitle className="text-lg">Day {day.day} - {day.city}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-center justify-between p-3 bg-card/80 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{activity.time}</span>
                              <span className="text-muted-foreground">{activity.title}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditingItinerary(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditingItinerary(false)}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
      const PackageItineraryViewer = () => (
        <Dialog open={isViewingPackage} onOpenChange={setIsViewingPackage}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedPackage?.name}</DialogTitle>
                    <DialogDescription>
                        {selectedPackage?.selectedDuration.days} Day Itinerary
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto pr-4 space-y-6">
                    {selectedPackage?.itinerary.days.map((day) => (
                         <Card key={day.day} className="bg-card/50 border-border/50 overflow-hidden">
                         <CardHeader className="bg-secondary/30 p-4">
                           <CardTitle className="flex items-center space-x-3 text-lg">
                             <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                 <CalendarIcon className="w-5 h-5" />
                             </div>
                                <span className="text-foreground">Day {day.day} in {day.city}</span>
                           </CardTitle>
                         </CardHeader>
                         <CardContent className="p-4 md:p-6">
                           <div className="relative pl-6">
                             <div className="absolute left-0 top-0 h-full w-0.5 bg-border/50 ml-[11px] rounded"></div>
                             {day.activities.map((activity, actIndex) => {
                                 const { icon: Icon, color } = activityIcons[activity.type] || activityIcons.default;
                                 return (
                                   <div key={actIndex} className="relative flex items-start space-x-6 mb-8 last:mb-0">
                                     <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center -translate-x-1/2 bg-background rounded-full border-2 border-secondary">
                                         <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                                     </div>
                                     <div className="pt-1.5">
                                       <p className="text-xs font-semibold text-muted-foreground w-20">{activity.time}</p>
                                     </div>
                                     <div className="flex-1 -mt-1">
                                         <div className="flex items-center gap-2">
                                             <Icon className={`w-5 h-5 ${color}`} />
                                             <p className="font-semibold text-foreground">{activity.title}</p>
                                         </div>
                                     </div>
                                   </div>
                                 );
                             })}
                           </div>
                         </CardContent>
                       </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
      )
      const PackageCard = ({ pkg }) => {
        const [travelers, setTravelers] = useState(1);
        const selectedDuration = selectedDurations[pkg.id] || pkg.durations[0];
        
        const packageTotalPrice = useMemo(() => {
            const pricePerPerson = parsePrice(selectedDuration.price);
            return pricePerPerson * travelers;
        }, [selectedDuration, travelers]);
    
        const handlePackageBookNow = () => {
            const bookingData = {
              destination: pkg.name,
              duration: `${selectedDuration.days} days`,
              travelers: `${travelers} ${travelers > 1 ? 'people' : 'person'}`,
              flight: null,
              train: null,
              hotel: null,
              subtotal: formatCurrency(packageTotalPrice),
              gst: formatCurrency(packageTotalPrice * 0.18),
              total: formatCurrency(packageTotalPrice * 1.18),
            };
            initiateBooking(bookingData);
            navigate('/payment');
          };
    
        return (
            <Card className="bg-card/50 border-border/50 overflow-hidden flex flex-col">
                <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover"/>
                <CardHeader>
                    <CardTitle>{pkg.name}</CardTitle>
                    <CardDescription className="h-12">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end space-y-4 p-4">
                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div>
                            <Label className="text-xs text-muted-foreground">Duration</Label>
                            <Select 
                                defaultValue={JSON.stringify(pkg.durations[0])}
                                onValueChange={(value) => {
                                    setSelectedDurations(prev => ({ ...prev, [pkg.id]: JSON.parse(value) }))
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {pkg.durations.map(d => (
                                        <SelectItem key={d.days} value={JSON.stringify(d)}>{d.days} Days</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Per Person</p>
                            <p className="font-semibold text-foreground">{selectedDuration.price}</p>
                        </div>
                    </div>
                    
                    <div>
                        <Label htmlFor={`travelers-${pkg.id}`} className="text-xs text-muted-foreground">Travelers</Label>
                         <Select
                            value={String(travelers)}
                            onValueChange={(value) => setTravelers(Number(value))}
                        >
                            <SelectTrigger id={`travelers-${pkg.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <SelectItem key={num} value={String(num)}>{num} {num > 1 ? 'people' : 'person'}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                     <div className="text-center pt-2">
                        <p className="text-muted-foreground text-sm">Total Price (excl. GST)</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(packageTotalPrice)}</p>
                    </div>
    
                    <div className="flex gap-2 pt-2">
                        <Button className="w-full" variant="outline" onClick={() => handleViewPackage(pkg)}>
                            View Itinerary
                        </Button>
                        
                       <Button className="w-full bg-gradient-hero hover:opacity-90" onClick={handlePackageBookNow}>
                            Book Now
                        </Button>
                      
                    </div>
                </CardContent>
            </Card>
        )
      }
    
      return (
        <section id="trip-planner" className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                Hey, I'm your personal{" "}
                <span className="gradient-text">Trip Planner</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Tell me what you want, and I'll handle the rest. Flights, Hotels,
                Trip Planner - all in seconds.
              </p>
            </div>
    
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="planner">Trip Planner</TabsTrigger>
                <TabsTrigger value="cultural">Cultural</TabsTrigger>
                <TabsTrigger value="adventure">Adventure</TabsTrigger>
                <TabsTrigger value="hiddenGems">Hidden Gems</TabsTrigger>
                <TabsTrigger value="religious">Religious</TabsTrigger>
              </TabsList>
    
              <TabsContent value="planner" className="space-y-8">
                {!generatedItinerary ? (
                  <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader>
                      <CardTitle>Plan Your Perfect Trip</CardTitle>
                      <CardDescription>Fill in the details below to get a customized itinerary.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="destination">Destination (India Only)</Label>
                          <Input
                            id="destination"
                            type="text"
                            placeholder="Enter any destination in India (e.g., Mumbai, Goa, Kerala, Rajasthan...)"
                            value={tripDetails.destination}
                            onChange={(e) => setTripDetails({...tripDetails, destination: e.target.value})}
                            className="w-full"
                          />
                          {tripDetails.destination && !isValidIndianDestination(tripDetails.destination) && (
                            <p className="text-sm text-red-500 mt-1">
                              Please enter a valid destination within India
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Dates</Label>
                          <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                              <PopoverTrigger asChild>
                                  <Button
                                      variant={"outline"}
                                      className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !date && "text-muted-foreground"
                                      )}
                                  >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {date?.from ? (
                                          date.to ? (
                                              <>
                                                  {format(date.from, "LLL dd, y")} -{" "}
                                                  {format(date.to, "LLL dd, y")}
                                              </>
                                          ) : (
                                              format(date.from, "LLL dd, y")
                                          )
                                      ) : (
                                          <span>Pick a date range</span>
                                      )}
                                  </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                      initialFocus
                                      mode="range"
                                      defaultMonth={date?.from}
                                      selected={date}
                                      onSelect={setDate}
                                      numberOfMonths={2}
                                      disabled={(date) => {
                                          if (!date?.from) return false;
                                          const maxDate = new Date(date.from);
                                          maxDate.setDate(maxDate.getDate() + 15);
                                          return date > maxDate;
                                      }}
                                  />
                              </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label htmlFor="budget">Budget Range</Label>
                          <Select value={tripDetails.budget} onValueChange={(value) => setTripDetails({...tripDetails, budget: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="₹15,000 - ₹30,000">₹15,000 - ₹30,000</SelectItem>
                              <SelectItem value="₹30,000 - ₹60,000">₹30,000 - ₹60,000</SelectItem>
                              <SelectItem value="₹60,000 - ₹1,00,000">₹60,000 - ₹1,00,000</SelectItem>
                              <SelectItem value="₹1,00,000+">₹1,00,000+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="departureAirport">Departure Airport (Nearest)</Label>
                          <Select value={tripDetails.departureAirport} onValueChange={(value) => setTripDetails({ ...tripDetails, departureAirport: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select nearest airport" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "DEL - Delhi (IGI)",
                                "BOM - Mumbai (CSMIA)",
                                "BLR - Bengaluru (KIA)",
                                "MAA - Chennai (MAA)",
                                "HYD - Hyderabad (RGIA)",
                                "GOI - Goa (MOPA/Dabolim)",
                                "AMD - Ahmedabad",
                                "PNQ - Pune",
                                "JAI - Jaipur",
                                "ATQ - Amritsar",
                                "LKO - Lucknow",
                              ].map((ap) => (
                                <SelectItem key={ap} value={ap}>{ap}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="adults">Number of Adults</Label>
                          <Select value={String(tripDetails.adults)} onValueChange={(value) => setTripDetails({...tripDetails, adults: parseInt(value)})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select adults" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                                <SelectItem key={num} value={String(num)}>{num} {num === 1 ? 'Adult' : 'Adults'}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="departureStation">Departure Railway Station (Nearest)</Label>
                          <Select value={tripDetails.departureStation} onValueChange={(value) => setTripDetails({ ...tripDetails, departureStation: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select nearest station" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "NDLS - New Delhi",
                                "HWH - Howrah Junction",
                                "CSTM - Mumbai CSMT",
                                "SBC - KSR Bengaluru",
                                "MAS - Chennai Central",
                                "PNBE - Patna Junction",
                                "LKO - Lucknow NR",
                                "ADI - Ahmedabad Jn",
                                "JP - Jaipur",
                                "ASR - Amritsar Jn",
                              ].map((st) => (
                                <SelectItem key={st} value={st}>{st}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="children">Number of Children (Under 18)</Label>
                          <Select value={String(tripDetails.children)} onValueChange={(value) => setTripDetails({...tripDetails, children: parseInt(value)})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select children" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => i).map(num => (
                                <SelectItem key={num} value={String(num)}>{num} {num === 1 ? 'Child' : num === 0 ? 'No Children' : 'Children'}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="preferences">Special Preferences</Label>
                        <Textarea
                          id="preferences"
                          placeholder="e.g., interested in history, prefer spicy food, etc."
                          value={tripDetails.preferences}
                          onChange={(e) => setTripDetails({...tripDetails, preferences: e.target.value})}
                        />
                      </div>
                      <Button 
                        onClick={generateItinerary} 
                        className="w-full bg-gradient-hero hover:opacity-90"
                        disabled={!tripDetails.destination || !tripDetails.duration || isGenerating || (tripDetails.destination && !isValidIndianDestination(tripDetails.destination))}
                      >
                        {isGenerating ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-5 w-5" />
                        )}
                        {isGenerating ? "Generating..." : user ? "Generate AI Itinerary" : "Login to Generate AI Itinerary"}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-bold gradient-text">{generatedItinerary.destination}</h3>
                        <p className="text-muted-foreground">{generatedItinerary.duration} • {generatedItinerary.budget}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => openEditor('flights')}>
                          <Edit className="mr-2 h-4 w-4" />
                          Customize
                        </Button>
                        <Button onClick={() => setGeneratedItinerary(null)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Plan a New Trip
                        </Button>
                      </div>
                    </div>

                    {/* Display AI-generated text if available */}
                    {generatedItinerary.aiText && (
                      <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI-Generated Itinerary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                            {generatedItinerary.aiText}
                          </div>
                        </CardContent>
                      </Card>
                    )}
    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      <div className="lg:col-span-2 space-y-6">
                        {generatedItinerary.days && generatedItinerary.days.length > 0 ? (
                          <>
                          {generatedItinerary.days.map((day) => (
                          <Card key={day.day} className="bg-card/50 border-border/50 overflow-hidden">
                            <CardHeader className="bg-secondary/30 p-4">
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-lg">
                                  <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                      <CalendarIcon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <span className="text-foreground">Day {day.day} in {day.city}</span>
                                    {day.date && (
                                      <p className="text-sm text-muted-foreground font-normal mt-1">
                                        {format(new Date(day.date), "EEEE, MMMM dd, yyyy")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                              <div className="relative pl-6">
                                <div className="absolute left-0 top-0 h-full w-0.5 bg-border/50 ml-[11px] rounded"></div>
                                {day.activities.map((activity, actIndex) => {
                                    const { icon: Icon, color } = activityIcons[activity.type] || activityIcons.default;
                                    return (
                                      <div key={actIndex} className="relative flex items-start space-x-6 mb-8 last:mb-0">
                                        <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center -translate-x-1/2 bg-background rounded-full border-2 border-secondary z-10">
                                            <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                                        </div>
                                        <div className="pt-1.5 flex flex-col items-center min-w-[80px]">
                                          <p className="text-xs font-semibold text-muted-foreground">{activity.time}</p>
                                          {day.date && (
                                            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                                              {format(new Date(day.date), "MMM dd")}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex-1 -mt-1 bg-card/30 rounded-lg p-4 border border-border/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`p-1.5 rounded-lg ${color.includes('text-') ? 'bg-primary/10' : 'bg-secondary/20'}`}>
                                                  <Icon className={`w-4 h-4 ${color}`} />
                                                </div>
                                                <p className="font-semibold text-foreground">{activity.title}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 mt-2 ml-7 text-sm text-muted-foreground">
                                              {activity.location && (
                                                <div className="flex items-center gap-1">
                                                  <MapPin className="w-3.5 h-3.5" />
                                                  <span>{activity.location}</span>
                                                </div>
                                              )}
                                              {activity.duration && (
                                                <div className="flex items-center gap-1">
                                                  <Clock className="w-3.5 h-3.5" />
                                                  <span>{activity.duration}</span>
                                                </div>
                                              )}
                                            </div>
                                            {activity.notes && (
                                              <p className="text-sm text-muted-foreground mt-2 ml-7 italic">{activity.notes}</p>
                                            )}
                                        </div>
                                      </div>
                                    );
                                })}
                              </div>
                               <div className="mt-6 border-t border-border/50 pt-4">
                                    <h4 className="font-semibold text-foreground mb-3">Alternatives & Suggestions</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {day.alternatives.map((alt, altIndex) => {
                                            const { icon: Icon, color } = activityIcons[alt.type] || activityIcons.default;
                                            return (
                                                <div key={altIndex} className="flex items-center text-sm p-2 rounded-md bg-secondary/20">
                                                    <Icon className={`w-4 h-4 mr-2 shrink-0 ${color}`} />
                                                    <span className="text-muted-foreground">{alt.title}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                               </div>
                            </CardContent>
                          </Card>
                          ))}
                          </>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-card/50 border-border/50">
                              <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('flights')}>
                                  <Plane className="mr-2 h-4 w-4" />
                                  Departure Flights
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('trains')}>
                                  <Train className="mr-2 h-4 w-4" />
                                  Departure Trains
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('returnFlights')}>
                                  <Plane className="mr-2 h-4 w-4" />
                                  Arrival Flights
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('returnTrains')}>
                                  <Train className="mr-2 h-4 w-4" />
                                  Arrival Trains
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('hotels')}>
                                  <Hotel className="mr-2 h-4 w-4" />
                                  Reserve Hotels
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('activities')}>
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  Add Activities
                                </Button>
                              </CardContent>
                            </Card>
    
                            <Card className="bg-card/50 border-border/50">
                              <CardHeader>
                                <CardTitle className="text-lg">Trip Summary</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Duration:</span>
                                        <span className="font-medium text-foreground">{generatedItinerary.duration}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Adults:</span>
                                        <span className="font-medium text-foreground">{tripDetails.adults}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Children:</span>
                                        <span className="font-medium text-foreground">{tripDetails.children}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Travelers:</span>
                                        <span className="font-medium text-foreground">{totalPrice.totalTravelers}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Rooms Required:</span>
                                        <span className="font-medium text-foreground">{totalPrice.roomsRequired}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Departure:</span>
                                        <span className="font-medium text-foreground">{formatCurrency(totalPrice.departureCost)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Arrival:</span>
                                        <span className="font-medium text-foreground">{formatCurrency(totalPrice.returnCost)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Hotel ({totalPrice.roomsRequired} rooms):</span>
                                        <span className="font-medium text-foreground">{formatCurrency(totalPrice.hotelCost)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border/50 pt-2">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="font-medium text-foreground">{formatCurrency(totalPrice.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">GST (18%):</span>
                                        <span className="font-medium text-foreground">{formatCurrency(totalPrice.gst)}</span>
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-lg border-t border-border/50 pt-2 mt-2">
                                        <span className="text-foreground">Total Price:</span>
                                        <span className="text-primary">{formatCurrency(totalPrice.total)}</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-gradient-hero hover:opacity-90" onClick={handleBookNow}>
                                  Book Now
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
    
                      {generatedItinerary.days && generatedItinerary.days.length > 0 && (
                        <div className="space-y-6 lg:sticky top-24">
                          <Card className="bg-card/50 border-border/50">
                            <CardHeader>
                              <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('flights')}>
                                <Plane className="mr-2 h-4 w-4" />
                                Departure Flights
                              </Button>
                              <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('trains')}>
                                <Train className="mr-2 h-4 w-4" />
                                Departure Trains
                              </Button>
                              <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('returnFlights')}>
                                <Plane className="mr-2 h-4 w-4" />
                                Arrival Flights
                              </Button>
                              <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('returnTrains')}>
                                <Train className="mr-2 h-4 w-4" />
                                Arrival Trains
                              </Button>
                              <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('hotels')}>
                                <Hotel className="mr-2 h-4 w-4" />
                                Reserve Hotels
                              </Button>
                              <Button variant="outline" className="w-full justify-start" onClick={() => openEditor('activities')}>
                                <Briefcase className="mr-2 h-4 w-4" />
                                Add Activities
                              </Button>
                            </CardContent>
                          </Card>
    
                          <Card className="bg-card/50 border-border/50">
                            <CardHeader>
                              <CardTitle className="text-lg">Trip Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                      <span className="text-muted-foreground">Duration:</span>
                                      <span className="font-medium text-foreground">{generatedItinerary.duration}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-muted-foreground">Adults:</span>
                                      <span className="font-medium text-foreground">{tripDetails.adults}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-muted-foreground">Children:</span>
                                      <span className="font-medium text-foreground">{tripDetails.children}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-muted-foreground">Total Travelers:</span>
                                      <span className="font-medium text-foreground">{totalPrice.totalTravelers}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-muted-foreground">Rooms Required:</span>
                                      <span className="font-medium text-foreground">{totalPrice.roomsRequired}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-muted-foreground">Departure:</span>
                                      <span className="font-medium text-foreground">{formatCurrency(totalPrice.departureCost)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-muted-foreground">Arrival:</span>
                                      <span className="font-medium text-foreground">{formatCurrency(totalPrice.returnCost)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-muted-foreground">Hotel ({totalPrice.roomsRequired} rooms):</span>
                                      <span className="font-medium text-foreground">{formatCurrency(totalPrice.hotelCost)}</span>
                                  </div>
                                  <div className="flex justify-between border-t border-border/50 pt-2">
                                      <span className="text-muted-foreground">Subtotal:</span>
                                      <span className="font-medium text-foreground">{formatCurrency(totalPrice.subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-muted-foreground">GST (18%):</span>
                                      <span className="font-medium text-foreground">{formatCurrency(totalPrice.gst)}</span>
                                  </div>
                                  <div className="flex justify-between items-center font-bold text-lg border-t border-border/50 pt-2 mt-2">
                                      <span className="text-foreground">Total Price:</span>
                                      <span className="text-primary">{formatCurrency(totalPrice.total)}</span>
                                  </div>
                              </div>
                              <Button className="w-full bg-gradient-hero hover:opacity-90" onClick={handleBookNow}>
                                Book Now
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
    
              {/* Other Tabs Content */}
               <TabsContent value="cultural">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packageData.cultural.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                    </div>
                </TabsContent>
                <TabsContent value="adventure">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packageData.adventure.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                    </div>
                </TabsContent>
                <TabsContent value="hiddenGems">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packageData.hiddenGems.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                    </div>
                </TabsContent>
                <TabsContent value="religious">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packageData.religious.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                    </div>
                </TabsContent>
    
            </Tabs>
            <ItineraryEditor />
            <PackageItineraryViewer />
          </div>
        </section>
      );
};

export default TripPlannerSection;
