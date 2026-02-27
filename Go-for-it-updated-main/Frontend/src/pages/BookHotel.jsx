import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import Footer from "@/pages/Footer";
import { format, addDays } from "date-fns";
import {
  BedDouble,
  Calendar as CalendarIcon,
  Users,
  Search,
  ChevronRight,
} from "lucide-react";

// --- Sub-components (MmtLuxeSelection, OffersSection) remain the same ---
const MmtLuxeSelection = () => (
    <div className="text-center my-12">
        <p className="text-sm text-muted-foreground">INTRODUCING</p>
        <h2 className="text-3xl font-bold mb-6">MMT Luxe Selections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden bg-card/50 border-border/50"><img src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg" alt="Luxe Properties" className="w-full h-40 object-cover"/><CardContent className="p-4"><h3 className="font-semibold">Luxe Properties</h3><p className="text-xs text-muted-foreground">Regal stay brands</p></CardContent></Card>
            <Card className="overflow-hidden bg-card/50 border-border/50"><img src="https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg" alt="Luxe Villas" className="w-full h-40 object-cover"/><CardContent className="p-4"><h3 className="font-semibold">Luxe Villas</h3><p className="text-xs text-muted-foreground">Private stays with superlative experiences</p></CardContent></Card>
            <Card className="overflow-hidden bg-card/50 border-border/50"><img src="https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg" alt="Luxe International" className="w-full h-40 object-cover"/><CardContent className="p-4"><h3 className="font-semibold">Luxe International</h3><p className="text-xs text-muted-foreground">Curated international properties</p></CardContent></Card>
        </div>
    </div>
);

const OffersSection = () => (
    <div className="my-12">
        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Offers</h2><Button variant="link">View All <ChevronRight className="h-4 w-4 ml-1"/></Button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/50 border-border/50 p-4"><h3 className="font-semibold">Grab UP TO 40% OFF* on Hotels</h3><p className="text-xs text-muted-foreground">Valid on select Indian hotels.</p><Button variant="link" className="p-0 h-auto mt-2">Book Now</Button></Card>
             <Card className="bg-card/50 border-border/50 p-4"><h3 className="font-semibold">Up to 30% OFF on Homestays</h3><p className="text-xs text-muted-foreground">Explore unique & cozy homestays.</p><Button variant="link" className="p-0 h-auto mt-2">Book Now</Button></Card>
            <Card className="bg-card/50 border-border/50 p-4"><h3 className="font-semibold">Say WAY TO ALL TRAVEL PLANS</h3><p className="text-xs text-muted-foreground">With RuPay on Flights & Hotels</p><Button variant="link" className="p-0 h-auto mt-2">View Details</Button></Card>
            <Card className="bg-card/50 border-border/50 p-4"><h3 className="font-semibold">The Lalit Hotels: Special Offer</h3><p className="text-xs text-muted-foreground">Exclusive deals on luxury stays.</p><Button variant="link" className="p-0 h-auto mt-2">Book Now</Button></Card>
        </div>
    </div>
);


// --- MAIN PAGE COMPONENT ---
const BookHotel = () => {
    const [destination, setDestination] = useState("Goa");
    const [dateRange, setDateRange] = useState({ from: new Date(), to: addDays(new Date(), 2) });
    // --- UPDATED GUESTS STATE ---
    const [guests, setGuests] = useState({ rooms: 1, adults: 2, kids: 0 });
    const [priceRange, setPriceRange] = useState([20000]);
    const navigate = useNavigate();

    // --- NEW HANDLERS for automatic room calculation and kids ---
    const handleAdultsChange = (e) => {
        const newAdults = parseInt(e.target.value, 10) || 1;
        const newRooms = Math.ceil(newAdults / 2);
        setGuests(prev => ({ ...prev, adults: newAdults, rooms: newRooms }));
    };

    const handleKidsChange = (e) => {
        const newKids = parseInt(e.target.value, 10) || 0;
        setGuests(prev => ({ ...prev, kids: newKids }));
    };

    const handleSearch = () => {
        const queryParams = new URLSearchParams({
            destination,
            checkin: format(dateRange.from, 'yyyy-MM-dd'),
            checkout: format(dateRange.to, 'yyyy-MM-dd'),
            rooms: guests.rooms,
            adults: guests.adults,
            kids: guests.kids, // Add kids to search query
            maxPrice: priceRange[0]
        }).toString();
        
        navigate(`/book-hotel/results?${queryParams}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <Card className="bg-gradient-card border-border/50 shadow-lg">
                        <CardHeader>
                             <div className="flex items-center space-x-2 mb-4"><BedDouble className="h-6 w-6 text-primary"/><CardTitle className="text-2xl">Hotel Booking</CardTitle></div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="md:col-span-2"><Label htmlFor="destination">City, Property Name or Location</Label><Input id="destination" placeholder="e.g., Goa" value={destination} onChange={(e) => setDestination(e.target.value)} /></div>
                                <div><Label>Check-in & Check-out</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} /></PopoverContent></Popover></div>
                                
                                {/* --- UPDATED ROOMS & GUESTS SECTION --- */}
                                <div>
                                    <Label>Rooms & Guests</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <Users className="mr-2 h-4 w-4" />
                                                <span>
                                                    {guests.rooms} Room, {guests.adults} Adults
                                                    {guests.kids > 0 && `, ${guests.kids} ${guests.kids > 1 ? 'Kids' : 'Kid'}`}
                                                </span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-4 space-y-4">
                                            <div>
                                                <Label>Rooms</Label>
                                                <Input type="number" value={guests.rooms} readOnly disabled title="Rooms are automatically calculated" className="bg-muted/50 cursor-not-allowed" />
                                            </div>
                                             <div>
                                                <Label>Adults</Label>
                                                <Input type="number" value={guests.adults} onChange={handleAdultsChange} min="1"/>
                                            </div>
                                            <div>
                                                <Label>Kids (Below 18)</Label>
                                                <Input type="number" value={guests.kids} onChange={handleKidsChange} min="0"/>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div><Label>Price Per Night: ₹{priceRange[0].toLocaleString()}</Label><Slider defaultValue={[20000]} max={50000} step={1000} onValueChange={setPriceRange}/></div>
                            <Button size="lg" className="w-full text-xl py-7 bg-gradient-hero hover:opacity-90" onClick={handleSearch}><Search className="mr-2 h-6 w-6"/>Search</Button>
                        </CardContent>
                    </Card>

                    <MmtLuxeSelection />
                    <OffersSection />
                    
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookHotel;