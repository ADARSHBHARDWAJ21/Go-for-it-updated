import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Header from "@/components/Header";
import Footer from "@/pages/Footer";
import { format, parseISO, addDays } from "date-fns";
import { Loader2, Star, MapPin, Sparkles, Calendar as CalendarIcon, ArrowRightLeft } from "lucide-react";

// --- MOCK DATA & HELPERS (THIS WAS MISSING) ---
const generateMockHotels = (destination) => {
    const hotels = [
        { name: "Estrela Do Mar Beach Resort", rating: 4.4, reviews: 2322, price: 5164, images: ["https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg", "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"] },
        { name: "Summit Calangute Resort & Spa", rating: 4.2, reviews: 4147, price: 4145, images: ["https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg", "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg"] },
        { name: "SinQ Beach Resort", rating: 4.1, reviews: 2960, price: 2360, images: ["https://images.pexels.com/photos/594077/pexels-photo-594077.jpeg", "https://images.pexels.com/photos/1458457/pexels-photo-1458457.jpeg"] }
    ];
    return Array(30).fill(0).map((_, i) => ({ ...hotels[i % hotels.length], id: i, star: Math.floor(Math.random() * 3) + 3 }));
};

const filterOptions = {
    starCategory: [{ id: '5star', label: '5 Star' }, { id: '4star', label: '4 Star' }, { id: '3star', label: '3 Star' }],
    userRating: [{ id: 'excellent', label: 'Excellent: 4.5+' }, { id: 'verygood', label: 'Very Good: 4.0+' }, { id: 'good', label: 'Good: 3.0+' }],
    propertyType: [ { id: 'apartment', label: 'Apartment' }, { id: 'villa', label: 'Villa' }, { id: 'hotel', label: 'Hotel' }, { id: 'homestay', label: 'Homestay' }, { id: 'resort', label: 'Resort' }],
};
// ----------------------------------------------------

// --- SUB-COMPONENTS ---
const HotelResultCard = ({ hotel, onViewPrices }) => (
    <Card className="bg-card/50 border-border/50 flex flex-col md:flex-row">
        <div className="md:w-1/3"><Carousel className="w-full"><CarouselContent>{hotel.images.map((img, index) => (<CarouselItem key={index}><img src={img} alt={`${hotel.name} view ${index + 1}`} className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-r-none" /></CarouselItem>))}</CarouselContent><CarouselPrevious className="left-2" /><CarouselNext className="right-2" /></Carousel></div>
        <div className="md:w-2/3 flex flex-col justify-between p-4">
            <div><h3 className="text-xl font-bold">{hotel.name}</h3><div className="flex items-center text-sm text-yellow-400 my-1">{Array(hotel.star).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div><p className="text-xs text-muted-foreground">Candolim, Goa</p></div>
            <div className="flex justify-between items-end mt-4">
                <div><span className="inline-block bg-green-900/50 text-green-300 text-xs font-semibold px-2 py-1 rounded">{hotel.rating} Very Good</span><p className="text-xs text-muted-foreground mt-1">{hotel.reviews.toLocaleString()} Ratings</p></div>
                <div className="text-right"><p className="text-2xl font-bold text-primary">₹{hotel.price.toLocaleString()}</p><p className="text-xs text-muted-foreground">+ ₹{(hotel.price * 0.18).toLocaleString()} taxes & fees per night</p><Button className="mt-2" onClick={() => onViewPrices(hotel.id)}>View Prices</Button></div>
            </div>
        </div>
    </Card>
);

const FilterSidebar = () => (
    <Card className="bg-card/50 sticky top-24">
        <CardHeader><CardTitle className="flex justify-between items-center"><span>Filters</span> <Button variant="link" className="p-0 h-auto text-xs">Clear All</Button></CardTitle></CardHeader>
        <CardContent>
            <Accordion type="multiple" defaultValue={['price', 'star', 'rating', 'property']} className="w-full">
                 <AccordionItem value="star"><AccordionTrigger className="font-semibold text-sm">Star Category</AccordionTrigger><AccordionContent className="pt-2 space-y-2">{filterOptions.starCategory.map(opt => (<div key={opt.id} className="flex items-center space-x-2"><Checkbox id={opt.id} /><Label htmlFor={opt.id} className="font-normal text-muted-foreground">{opt.label}</Label></div>))}</AccordionContent></AccordionItem>
                <AccordionItem value="rating"><AccordionTrigger className="font-semibold text-sm">User Rating</AccordionTrigger><AccordionContent className="pt-2 space-y-2">{filterOptions.userRating.map(opt => (<div key={opt.id} className="flex items-center space-x-2"><Checkbox id={opt.id} /><Label htmlFor={opt.id} className="font-normal text-muted-foreground">{opt.label}</Label></div>))}</AccordionContent></AccordionItem>
                <AccordionItem value="property"><AccordionTrigger className="font-semibold text-sm">Property Type</AccordionTrigger><AccordionContent className="pt-2 space-y-2">{filterOptions.propertyType.map(opt => (<div key={opt.id} className="flex items-center space-x-2"><Checkbox id={opt.id} /><Label htmlFor={opt.id} className="font-normal text-muted-foreground">{opt.label}</Label></div>))}</AccordionContent></AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
);

// --- MAIN COMPONENT ---
const HotelResults = () => {
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('popular');
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    
    const [destination, setDestination] = useState(searchParams.get('destination') || "Goa");
    const [dateRange, setDateRange] = useState({ from: searchParams.get('checkin') ? parseISO(searchParams.get('checkin')) : new Date(), to: searchParams.get('checkout') ? parseISO(searchParams.get('checkout')) : addDays(new Date(), 2), });
    const [roomsAndGuests, setRoomsAndGuests] = useState(`${searchParams.get('rooms') || 1} Room, ${searchParams.get('adults') || 2} Adults`);

    useEffect(() => {
        const fetchHotels = async () => {
            const savedState = sessionStorage.getItem('hotelSearchState');
            if (savedState) {
                const { destination, dateRange, roomsAndGuests, results } = JSON.parse(savedState);
                setDestination(destination);
                setDateRange({ from: parseISO(dateRange.from), to: parseISO(dateRange.to) });
                setRoomsAndGuests(roomsAndGuests);
                setHotels(results);
                setIsLoading(false);
                sessionStorage.removeItem('hotelSearchState');
                return;
            }

            try {
                setIsLoading(true);
                const params = new URLSearchParams({
                    destination,
                    checkin: format(dateRange.from, 'yyyy-MM-dd'),
                    checkout: format(dateRange.to, 'yyyy-MM-dd'),
                    adults: (roomsAndGuests.match(/\d+/g) || [1,2])[1]
                });
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/hotels/search?${params.toString()}`);
                const data = await res.json();
                if (data?.success && Array.isArray(data.data)) {
                    setHotels(data.data);
                } else {
                    setHotels(generateMockHotels(destination));
                }
            } catch (e) {
                setHotels(generateMockHotels(destination));
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotels();
    }, [searchParams]);
    
    const handleSearch = () => {
        const [rooms, adults] = roomsAndGuests.match(/\d+/g) || [1, 2];
        const queryParams = new URLSearchParams({ destination, checkin: format(dateRange.from, 'yyyy-MM-dd'), checkout: format(dateRange.to, 'yyyy-MM-dd'), rooms, adults, maxPrice: 20000 }).toString();
        navigate(`/book-hotel/results?${queryParams}`);
    };

    const handleViewPrices = (hotelId) => {
        const searchState = {
            destination,
            dateRange: { from: dateRange.from.toISOString(), to: dateRange.to.toISOString() },
            roomsAndGuests,
            results: hotels,
        };
        sessionStorage.setItem('hotelSearchState', JSON.stringify(searchState));
        navigate(`/hotel/${hotelId}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1"><FilterSidebar /></aside>
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="bg-card/50 border-border/50">
                            <CardContent className="p-4 flex flex-wrap items-center gap-2">
                                <div className="flex-grow"><Input placeholder="City, Area or Property" value={destination} onChange={e => setDestination(e.target.value)} /></div>
                                <div className="flex-grow"><Popover><PopoverTrigger asChild><Button variant={"outline"} className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} /></PopoverContent></Popover></div>
                                <div className="flex-grow"><Input value={roomsAndGuests} onChange={e => setRoomsAndGuests(e.target.value)} /></div>
                                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSearch}>Search</Button>
                            </CardContent>
                        </Card>
                        <div className="space-y-4">
                            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="/book-hotel">Hotels and more in {destination}</BreadcrumbLink></BreadcrumbItem></BreadcrumbList></Breadcrumb>
                            <div className="flex gap-4">
                                <Card className="bg-card/50 p-2 w-48 hidden md:block"><div className="bg-muted h-full w-full rounded-md flex items-center justify-center"><Button variant="outline"><MapPin className="w-4 h-4 mr-2"/>Explore on Map</Button></div></Card>
                                <div className="flex-1"><h2 className="text-2xl font-bold">{hotels.length} Properties in {destination}</h2><Button variant="link" className="p-0 h-auto text-primary"><Sparkles className="w-4 h-4 mr-1"/>Explore Travel Tips</Button></div>
                            </div>
                            <Card className="bg-card/50"><CardContent className="p-2 flex items-center gap-2"><span className="text-sm font-semibold pl-2">Sort By</span><Button variant={sortBy === 'popular' ? 'secondary' : 'ghost'} onClick={() => setSortBy('popular')}>Popular</Button><Button variant={sortBy === 'rating' ? 'secondary' : 'ghost'} onClick={() => setSortBy('rating')}>User Rating (Highest First)</Button><Button variant={sortBy === 'price_desc' ? 'secondary' : 'ghost'} onClick={() => setSortBy('price_desc')}>Price (Highest First)</Button><Button variant={sortBy === 'price_asc' ? 'secondary' : 'ghost'} onClick={() => setSortBy('price_asc')}>Price (Lowest First)</Button></CardContent></Card>
                        </div>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-96"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
                        ) : (
                            <div className="space-y-4">
                                {hotels.map(hotel => <HotelResultCard key={hotel.id} hotel={hotel} onViewPrices={handleViewPrices} />)}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HotelResults;