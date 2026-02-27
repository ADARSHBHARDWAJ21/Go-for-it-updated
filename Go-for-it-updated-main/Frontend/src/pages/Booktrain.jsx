// src/pages/BookTrain.jsx

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/pages/Footer";
import {
  Train,
  ArrowRightLeft,
  Calendar as CalendarIcon,
  Search,
  Ticket,
  Map,
  Sparkles
} from "lucide-react";

const indianCities = ["New Delhi", "Kanpur", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur", "Ahmedabad", "Goa"];
const trainClasses = ["All Class", "Sleeper (SL)", "AC 3 Tier (3A)", "AC 2 Tier (2A)", "AC First Class (1A)"];

const OfferCard = ({ title, description, code, href }) => (
    <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 flex items-center justify-between">
            <div>
                <p className="font-bold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
                {code && <p className="text-xs mt-2">Code: <span className="font-semibold text-primary">{code}</span></p>}
            </div>
            <Button asChild variant="outline">
                <a href={href}>Book Now</a>
            </Button>
        </CardContent>
    </Card>
);


const BookTrain = () => {
    const [from, setFrom] = useState("New Delhi");
    const [to, setTo] = useState("Kanpur");
    const [travelDate, setTravelDate] = useState(addDays(new Date(), 7));
    const [selectedClass, setSelectedClass] = useState("All Class");
    const [bookingMode, setBookingMode] = useState("bookTickets");
    const navigate = useNavigate(); // Initialize navigate

    // Function to handle the search button click
    const handleSearch = () => {
        if (!from || !to || !travelDate) {
            // Add some validation if needed
            return;
        }

        const queryParams = new URLSearchParams({
            from,
            to,
            date: format(travelDate, 'yyyy-MM-dd'),
            class: selectedClass
        }).toString();

        navigate(`/book-train/results?${queryParams}`);
    };


    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <Card className="bg-gradient-card border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center space-x-2 mb-4">
                                <Train className="h-6 w-6 text-primary"/>
                                <CardTitle className="text-2xl">Train Ticket Booking</CardTitle>
                            </div>
                            <RadioGroup defaultValue="bookTickets" onValueChange={setBookingMode} className="flex space-x-6">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bookTickets" id="book" />
                                    <Label htmlFor="book">Book Train Tickets</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pnrStatus" id="pnr" />
                                    <Label htmlFor="pnr">Check PNR Status</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="liveStatus" id="live" />
                                    <Label htmlFor="live">Live Train Status</Label>
                                </div>
                            </RadioGroup>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 items-end">
                                {/* From/To Inputs */}
                                <div className="md:col-span-4 grid grid-cols-2 gap-2 items-center relative">
                                    <div>
                                        <Label htmlFor="from">From</Label>
                                        <Select value={from} onValueChange={setFrom}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent>{indianCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="to">To</Label>
                                        <Select value={to} onValueChange={setTo}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent>{indianCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                     <Button variant="ghost" size="icon" className="absolute left-1/2 top-1/2 -translate-x-1/2 mt-3 bg-background border rounded-full h-8 w-8" onClick={() => { setFrom(to); setTo(from); }}><ArrowRightLeft className="w-4 h-4 text-muted-foreground"/></Button>
                                </div>

                                {/* Travel Date */}
                                <div className="md:col-span-2">
                                    <Label>Travel Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {travelDate ? format(travelDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={travelDate} onSelect={setTravelDate} initialFocus/>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Class */}
                                <div className="md:col-span-2">
                                    <Label>Class</Label>
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>{trainClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                
                                {/* Search Button */}
                                <div className="md:col-span-2">
                                    <Button size="lg" className="w-full bg-gradient-hero hover:opacity-90" onClick={handleSearch}>
                                        <Search className="mr-2 h-5 w-5"/>
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Offers Section */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center"><Sparkles className="h-6 w-6 mr-2 text-travel-gold"/>Offers</h2>
                            <Button variant="link">View All</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <OfferCard title="Festive Deals: Up to 15% OFF" description="On buses, cabs & trains!" code="MMTFESTIVE" href="#" />
                            <OfferCard title="Aadhaar-based Authentication" description="New mandatory rule for IRCTC bookings." href="#" />
                            <OfferCard title="Avoid Diwali Waitlists" description="High seat availability forecast." href="#" />
                            <OfferCard title="Seat Availability Forecast" description="Find sold-out alerts for train bookings." href="#" />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookTrain;