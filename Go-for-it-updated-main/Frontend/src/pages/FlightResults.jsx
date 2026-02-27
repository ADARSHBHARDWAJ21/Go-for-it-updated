import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { format, addDays, startOfToday, subDays, parseISO, isValid } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "@/components/context/BookingContext";
import { useAuth } from "@/components/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/pages/Footer";
import { Plane, Loader2, Lock, ArrowRightLeft, Calendar as CalendarIcon, Search, Users, MinusCircle, PlusCircle, ArrowRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import axios from 'axios'; // Import axios for API calls

// --- MOCK DATA & CONFIG (can be removed if backend is fully functional) ---
const airlineLogos = { "IndiGo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/InterGlobe_Aviation_logo.svg/250px-InterGlobe_Aviation_logo.svg.png", "Vistara": "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Vistara_logo.svg/250px-Vistara_logo.svg.png", "Air India": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/Air_India_logo.svg/250px-Air_India_logo.svg.png", "Air India Express": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Air_India_Express_logo.svg/250px-Air_India_Express_logo.svg.png", "SpiceJet": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/SpiceJet_logo.svg/250px-SpiceJet_logo.svg.png", "Akasa Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Akasa_Air_logo.svg/250px-Akasa_Air_logo.svg.png", };

// --- SUB-COMPONENTS ---
const OneWayFlightCard = ({ flight, onSelect, passengers }) => (
    <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img src={"https://upload.wikimedia.org/wikipedia/commons/0/02/Airplane_silhouette.svg"} className="h-6 w-6 opacity-70" />
                <div>
                    <h3 className="font-semibold">{flight.airline} {flight.flightNumber}</h3>
                    <p className="text-sm text-muted-foreground">{flight.departureTime} → {flight.arrivalTime} • {flight.duration} • {flight.stops === 0 ? 'Non‑stop' : `${flight.stops} stop`}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xl font-bold">₹{Number(flight.price || 0).toLocaleString('en-IN')}</div>
                <Button className="mt-2" onClick={() => onSelect(flight)}>Select</Button>
            </div>
        </CardContent>
    </Card>
);

const RoundTripFlightCard = ({ flight, isSelected, onSelect }) => (
    <Card className={`bg-card/50 border ${isSelected ? 'border-primary' : 'border-border/50'}`}> 
        <CardContent className="p-4 flex items-center justify-between">
            <div>
                <h4 className="font-semibold">{flight.airline} {flight.flightNumber}</h4>
                <p className="text-sm text-muted-foreground">{flight.departureTime} → {flight.arrivalTime} • {flight.duration}</p>
            </div>
            <div className="text-right">
                <div className="font-bold">₹{Number(flight.price || 0).toLocaleString('en-IN')}</div>
                <Button variant={isSelected ? 'secondary' : 'default'} className="mt-2" onClick={() => onSelect(flight)}>{isSelected ? 'Selected' : 'Choose'}</Button>
            </div>
        </CardContent>
    </Card>
);

const PassengerSelector = ({ passengers, setPassengers, travelClass, setTravelClass }) => (
    <div className="flex items-center gap-2">
        <Select value={String(passengers.adults)} onValueChange={(v) => setPassengers({ ...passengers, adults: Number(v) })}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Adults" /></SelectTrigger>
            <SelectContent>{[1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n} Adult{n>1?'s':''}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={travelClass} onValueChange={setTravelClass}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Class" /></SelectTrigger>
            <SelectContent>
                {['ECONOMY','PREMIUM_ECONOMY','BUSINESS','FIRST'].map(c => <SelectItem key={c} value={c}>{c.replace('_',' ')}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
);

const FlightFilterSidebar = ({ tripType, filters, setFilters }) => (
    <Card className="bg-card/50 border-border/50 sticky top-24">
        <CardHeader><CardTitle className="text-lg">Filters</CardTitle></CardHeader>
        <CardContent>
            <Label className="text-xs">Max Price</Label>
            <Slider defaultValue={filters.priceRange} max={100000} step={1000} onValueChange={(v)=>setFilters({ ...filters, priceRange: v })} />
            <div className="mt-4">
                <Label className="text-xs">Stops</Label>
                <RadioGroup value={filters.stops} onValueChange={(v)=>setFilters({ ...filters, stops: v })} className="mt-2">
                    <div className="flex items-center gap-2"><RadioGroupItem value="all" id="stops-all"/><Label htmlFor="stops-all">All</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="nonstop" id="stops-ns"/><Label htmlFor="stops-ns">Non‑stop</Label></div>
                </RadioGroup>
            </div>
        </CardContent>
    </Card>
);

const FlightSearchBar = ({ from, to, departureDate, returnDate, tripType, passengers, travelClass, onSearch }) => (
    <Card className="bg-card/50 border-border/50 mb-6">
        <CardContent className="p-4 flex flex-wrap gap-2 items-center">
            <Input className="w-44" value={from} onChange={(e)=>onSearch({ from: e.target.value })} placeholder="From (IATA)" />
            <Input className="w-44" value={to} onChange={(e)=>onSearch({ to: e.target.value })} placeholder="To (IATA)" />
            <Popover>
                <PopoverTrigger asChild><Button variant="outline" className="w-48 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{format(departureDate,'yyyy-MM-dd')}</Button></PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={departureDate} onSelect={(d)=>d && onSearch({ departure: d })} /></PopoverContent>
            </Popover>
            {tripType === 'roundTrip' && (
                <Popover>
                    <PopoverTrigger asChild><Button variant="outline" className="w-48 justify-start"><CalendarIcon className="mr-2 h-4 w-4" />{format(returnDate,'yyyy-MM-dd')}</Button></PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={returnDate} onSelect={(d)=>d && onSearch({ return: d })} /></PopoverContent>
                </Popover>
            )}
            <PassengerSelector passengers={passengers} setPassengers={(p)=>onSearch({ passengers: p })} travelClass={travelClass} setTravelClass={(c)=>onSearch({ travelClass: c })} />
            <Button size="lg" onClick={()=>onSearch({})}><Search className="w-4 h-4 mr-2"/>Search</Button>
        </CardContent>
    </Card>
);


const FlightResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { initiateBooking } = useBooking();
    const { user } = useAuth();
    
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    // State is derived from URL parameters, providing a single source of truth
    const from = searchParams.get('from') || "New Delhi";
    const to = searchParams.get('to') || "Mumbai";
    const departureDate = parseISO(searchParams.get('departure') || new Date().toISOString());
    const returnDate = parseISO(searchParams.get('return') || new Date().toISOString());
    const tripType = searchParams.get('tripType') || "oneWay";
    const passengers = useMemo(() => ({ adults: parseInt(searchParams.get('adults'), 10) || 1, children: parseInt(searchParams.get('children'), 10) || 0, infants: parseInt(searchParams.get('infants'), 10) || 0 }), [searchParams]);
    const travelClass = searchParams.get('travelClass') || 'ECONOMY';

    // Local state for results and UI
    const [allFlights, setAllFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [isSearching, setIsSearching] = useState(true);
    const [filters, setFilters] = useState({ stops: 'all', priceRange: [50000], airlines: [] });
    const [sortBy, setSortBy] = useState('cheapest');

    // Function to update the URL when a new search is performed
    const handleSearch = useCallback((searchData = {}) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(searchData).forEach(([key, value]) => {
            if (key === 'passengers') {
                newParams.set('adults', value.adults);
                newParams.set('children', value.children);
                newParams.set('infants', value.infants);
            } else if (value instanceof Date) {
                newParams.set(key, format(value, 'yyyy-MM-dd'));
            } else {
                newParams.set(key, value);
            }
        });
        navigate(`?${newParams.toString()}`, { replace: true });
    }, [navigate, searchParams]);

    // This useEffect hook now fetches data from your backend API
    useEffect(() => {
        const fetchFlights = async () => {
            setIsSearching(true);
            setAllFlights([]);
            setReturnFlights([]);
            setSelectedOutbound(null);
            setSelectedReturn(null);

            try {
                // Fetch Onward Flights
                const onwardPayload = { from, to, departure: format(departureDate, 'yyyy-MM-dd'), adults: passengers.adults, children: passengers.children, infants: passengers.infants, travelClass };
                const onwardResponse = await axios.post('http://localhost:5000/api/flights/search', onwardPayload);
                setAllFlights(onwardResponse.data || []);

                // Fetch Return Flights if it's a round trip
                if (tripType === 'roundTrip') {
                    const returnPayload = { ...onwardPayload, from: to, to: from, departure: format(returnDate, 'yyyy-MM-dd') };
                    const returnResponse = await axios.post('http://localhost:5000/api/flights/search', returnPayload);
                    setReturnFlights(returnResponse.data || []);
                }

            } catch (error) {
                console.error("Failed to fetch flights from backend", error);
                // Optionally, you can add a user-facing error message here
            } finally {
                setIsSearching(false);
            }
        };

        fetchFlights();
    }, [location.search]); // This is the crucial dependency array
    
    // Filtering and Sorting Logic
    const applyFiltersAndSort = (flights) => { /* ... filtering logic can go here ... */ return flights; };
    const finalOutboundFlights = useMemo(() => applyFiltersAndSort([...allFlights]), [allFlights, filters, sortBy]);
    const finalReturnFlights = useMemo(() => applyFiltersAndSort([...returnFlights]), [returnFlights, filters, sortBy]);

    // Booking Logic
    const handleBookNow = () => { /* ... booking logic ... */ };
    const roundTripTotal = useMemo(() => ((selectedOutbound?.price || 0) + (selectedReturn?.price || 0)) * passengers.adults, [selectedOutbound, selectedReturn, passengers.adults]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <div className="container mx-auto px-4 py-24">
                <FlightSearchBar 
                    from={from} to={to} departureDate={departureDate} returnDate={returnDate}
                    tripType={tripType} passengers={passengers} travelClass={travelClass}
                    onSearch={handleSearch}
                />
                
                {isSearching ? (
                     <div className="text-center py-20"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary"/><p className="mt-4 text-muted-foreground">Finding the best flights for you...</p></div>
                ) : (
                    <>
                        {/* You can re-add the DateScroller and Sort Buttons here if needed */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <aside className="hidden lg:block lg:col-span-1">
                                <FlightFilterSidebar tripType={tripType} filters={filters} setFilters={setFilters} />
                            </aside>
                            <main className="lg:col-span-3 space-y-6">
                                {tripType === "oneWay" ? (
                                    <div className="space-y-4">
                                        {finalOutboundFlights.length > 0 ? (
                                            finalOutboundFlights.map(flight => 
                                                <OneWayFlightCard key={flight.id} flight={flight} onSelect={handleBookNow} passengers={passengers} />
                                            )
                                        ) : ( <Card className="text-center p-8 bg-card/50"><CardTitle>No Flights Found</CardTitle></Card> )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex justify-between items-baseline mb-2"><h3 className="text-lg font-semibold">{from} <ArrowRight className="inline-block h-4 w-4"/> {to}</h3><span className="text-sm text-muted-foreground">{format(departureDate, 'E, dd MMM')}</span></div>
                                            <ScrollArea className="h-[70vh] pr-4"><div className="space-y-2">{finalOutboundFlights.map(flight => <RoundTripFlightCard key={flight.id} flight={flight} isSelected={selectedOutbound?.id === flight.id} onSelect={setSelectedOutbound} />)}</div></ScrollArea>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-baseline mb-2"><h3 className="text-lg font-semibold">{to} <ArrowRight className="inline-block h-4 w-4"/> {from}</h3><span className="text-sm text-muted-foreground">{format(returnDate, 'E, dd MMM')}</span></div>
                                            <ScrollArea className="h-[70vh] pr-4"><div className="space-y-2">{finalReturnFlights.map(flight => <RoundTripFlightCard key={flight.id} flight={flight} isSelected={selectedReturn?.id === flight.id} onSelect={setSelectedReturn} />)}</div></ScrollArea>
                                        </div>
                                    </div>
                                )}
                            </main>
                        </div>
                    </>
                )}
            </div>
            {tripType === 'roundTrip' && !isSearching && (
                 <div className="sticky bottom-0 z-10 mt-8 bg-card/80 backdrop-blur-sm border-t border-border/50">
                    <div className="container mx-auto p-4 flex justify-between items-center">
                        <div className="flex gap-6 items-center">
                            {selectedOutbound && <div><p className="text-xs text-muted-foreground">Departure</p><div className="flex items-center gap-2"><img src={airlineLogos[selectedOutbound.airline]} className="h-5 w-auto" /><span>{selectedOutbound.departureTime}</span></div></div>}
                            {selectedReturn && <div><p className="text-xs text-muted-foreground">Return</p><div className="flex items-center gap-2"><img src={airlineLogos[selectedReturn.airline]} className="h-5 w-auto" /><span>{selectedReturn.departureTime}</span></div></div>}
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-xl">₹{roundTripTotal.toLocaleString('en-IN')}</p>
                             <p className="text-xs text-muted-foreground">Total for {passengers.adults + passengers.children} travelers</p>
                        </div>
                        <Button size="lg" disabled={!selectedOutbound || !selectedReturn} onClick={handleBookNow}>
                            <Lock className="w-4 h-4 mr-2" /> Book Now
                        </Button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default FlightResults;