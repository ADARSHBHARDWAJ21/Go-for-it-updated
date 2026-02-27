import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format, addDays } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/pages/Footer";
import { Plane, ArrowRightLeft, Calendar as CalendarIcon, Search, Users, MinusCircle, PlusCircle } from "lucide-react";

const indianCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Ahmedabad", "Goa"];

const OfferCard = ({ title, description }) => (
    <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
            <p className="font-bold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Button variant="link" className="p-0 h-auto mt-2">Book Now</Button>
        </CardContent>
    </Card>
);

const PassengerSelector = ({ passengers, setPassengers }) => {
    const updateCount = (type, delta) => {
        setPassengers(prev => {
            let newCount = prev[type] + delta;
            if (type === 'adults' && newCount < 1) newCount = 1; // Must be at least 1 adult
            if (type !== 'adults' && newCount < 0) newCount = 0; // Children/infants can be 0
            
            const newState = { ...prev, [type]: newCount };
            
            // Rule: Infants cannot be more than adults
            if (newState.infants > newState.adults) {
                newState.infants = newState.adults;
            }
            return newState;
        });
    };

    return (
        <PopoverContent className="w-80" align="start">
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div><p className="font-medium">Adults</p><p className="text-xs text-muted-foreground">12+ years</p></div>
                    <div className="flex items-center gap-2"><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCount('adults', -1)}><MinusCircle className="h-4 w-4" /></Button><span className="w-8 text-center font-bold">{passengers.adults}</span><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCount('adults', 1)}><PlusCircle className="h-4 w-4" /></Button></div>
                </div>
                <div className="flex items-center justify-between">
                    <div><p className="font-medium">Children</p><p className="text-xs text-muted-foreground">2-12 years</p></div>
                    <div className="flex items-center gap-2"><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCount('children', -1)}><MinusCircle className="h-4 w-4" /></Button><span className="w-8 text-center font-bold">{passengers.children}</span><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCount('children', 1)}><PlusCircle className="h-4 w-4" /></Button></div>
                </div>
                <div className="flex items-center justify-between">
                    <div><p className="font-medium">Infants</p><p className="text-xs text-muted-foreground">Under 2 years</p></div>
                    <div className="flex items-center gap-2"><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCount('infants', -1)}><MinusCircle className="h-4 w-4" /></Button><span className="w-8 text-center font-bold">{passengers.infants}</span><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCount('infants', 1)}><PlusCircle className="h-4 w-4" /></Button></div>
                </div>
                <p className="text-xs text-muted-foreground pt-2 border-t">Note: Number of infants cannot exceed the number of adults.</p>
            </div>
        </PopoverContent>
    );
};

const BookFlight = () => {
    const [from, setFrom] = useState("Delhi");
    const [to, setTo] = useState("Mumbai");
    const [departureDate, setDepartureDate] = useState(addDays(new Date(), 7));
    const [returnDate, setReturnDate] = useState(addDays(new Date(), 14));
    const [tripType, setTripType] = useState("oneWay");
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const navigate = useNavigate();

    const handleSearch = () => {
        const queryParams = new URLSearchParams({ from, to, tripType, departure: format(departureDate, 'yyyy-MM-dd'), adults: passengers.adults, children: passengers.children, infants: passengers.infants });
        if (tripType === 'roundTrip' && returnDate) {
            queryParams.set('return', format(returnDate, 'yyyy-MM-dd'));
        }
        navigate(`/book-flight/results?${queryParams.toString()}`);
    };

    const passengerText = () => {
        let text = `${passengers.adults} Adult${passengers.adults > 1 ? 's' : ''}`;
        if (passengers.children > 0) text += `, ${passengers.children} Child${passengers.children > 1 ? 'ren' : ''}`;
        if (passengers.infants > 0) text += `, ${passengers.infants} Infant${passengers.infants > 1 ? 's' : ''}`;
        return text;
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <Card className="bg-gradient-card border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center space-x-2 mb-4"><Plane className="h-6 w-6 text-primary"/><CardTitle className="text-2xl">Book Flights</CardTitle></div>
                            <RadioGroup value={tripType} onValueChange={setTripType} className="flex space-x-6"><div className="flex items-center space-x-2"><RadioGroupItem value="oneWay" id="oneWay" /><Label htmlFor="oneWay">One Way</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="roundTrip" id="roundTrip" /><Label htmlFor="roundTrip">Round Trip</Label></div></RadioGroup>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid grid-cols-2 gap-2 items-center relative">
                                    <div><Label htmlFor="from">From</Label><Select value={from} onValueChange={setFrom}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{indianCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                                    <div><Label htmlFor="to">To</Label><Select value={to} onValueChange={setTo}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{indianCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                                    <Button variant="ghost" size="icon" className="absolute left-1/2 top-1/2 -translate-x-1/2 mt-3 bg-background border rounded-full h-8 w-8" onClick={() => { setFrom(to); setTo(from); }}><ArrowRightLeft className="w-4 h-4 text-muted-foreground"/></Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Departure</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus/></PopoverContent></Popover></div>
                                    <div><Label>Return</Label><Popover><PopoverTrigger asChild disabled={tripType !== 'roundTrip'}><Button variant="outline" className="w-full justify-start text-left font-normal disabled:opacity-50"><CalendarIcon className="mr-2 h-4 w-4" />{returnDate && tripType === 'roundTrip' ? format(returnDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus/></PopoverContent></Popover></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Passengers & Class</Label>
                                    <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal"><Users className="mr-2 h-4 w-4" /><span>{passengerText()}</span></Button></PopoverTrigger><PassengerSelector passengers={passengers} setPassengers={setPassengers} /></Popover>
                                </div>
                            </div>
                            <Button size="lg" className="w-full text-lg py-6 bg-gradient-hero hover:opacity-90" onClick={handleSearch}><Search className="mr-2 h-5 w-5"/>Search</Button>
                        </CardContent>
                    </Card>
                    <div className="mt-12"><h2 className="text-2xl font-bold mb-6">Offers for You</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><OfferCard title="Festive Deals: Up to 15% OFF" description="On domestic and international flights!" /><OfferCard title="Student Special: Extra Baggage" description="Fly with more for less. Valid with student ID." /></div></div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookFlight;