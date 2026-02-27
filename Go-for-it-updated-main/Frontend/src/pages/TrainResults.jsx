import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/context/AuthContext";
import { useBooking } from "@/components/context/BookingContext";
import Header from "@/components/Header";
import Footer from "@/pages/Footer";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { Loader2, ArrowRight, Calendar as CalendarIcon, Search, AlertCircle, ArrowRightLeft, ChevronRight, Users } from "lucide-react";

// --- MOCK DATA & CONFIG ---
const generateMockTrains = (from, to, date) => {
    const baseTrains = [ { id: 1, name: "Shram Shakti Exp (12452)", departureTime: "17:30", arrivalTime: "05:15", duration: "11h 45m", from: "NDLS", to: "CNB", fares: { "2A": 1527, "3A": 1086, "SL": 409, "EC": 2099 } }, { id: 2, name: "Vande Bharat Exp (22436)", departureTime: "06:00", arrivalTime: "10:00", duration: "4h 00m", from: "NDLS", to: "CNB", fares: { "EC": 1500, "CC": 900 } }, { id: 3, name: "Prayagraj Exp (12418)", departureTime: "21:00", arrivalTime: "06:30", duration: "09h 30m", from: "NDLS", to: "CNB", fares: { "1A": 2000, "2A": 1300, "3A": 850, "SL": 350 } }, { id: 4, name: "Shiv Ganga Exp (12560)", departureTime: "20:05", arrivalTime: "05:00", duration: "08h 55m", from: "NDLS", to: "CNB", fares: { "2A": 1400, "3A": 950, "SL": 380 } }, { id: 5, name: "Gomti Exp (12420)", departureTime: "12:20", arrivalTime: "21:30", duration: "09h 10m", from: "NDLS", to: "CNB", fares: { "CC": 700, "2S": 250 } }, ];
    return Array(15).fill(0).map((_, i) => ({ ...baseTrains[i % baseTrains.length], id: `T${i + 1}`, availableSeats: { "1A": Math.floor(Math.random() * 20), "2A": Math.floor(Math.random() * 50), "3A": Math.floor(Math.random() * 100), "SL": Math.floor(Math.random() * 200), "EC": Math.floor(Math.random() * 30), "CC": Math.floor(Math.random() * 60), "2S": Math.floor(Math.random() * 150) }, }));
};
const filterOptions = { quickFilters: [ { id: 'early_morning', label: 'Early Morning', count: 20 }, { id: 'late_night', label: 'Late Night', count: 15 }, { id: 'travel_insurance', label: 'Travel Insurance', count: 30 }, { id: 'arrival_before_6am', label: 'Arrival before 6 AM', count: 12 }, ], ticketType: [ { id: 'free_cancellation', label: 'Free Cancellation', count: 8 }, { id: 'date_change', label: 'Date Change', count: 5 }, ], quota: [ { id: 'general', label: 'General Quota', count: 64 }, { id: 'tatkal', label: 'Tatkal', count: 4 }, { id: 'ladies', label: 'Ladies', count: 3 }, ], journeyClasses: [ { id: '1a', label: '1st AC - 1A', count: 12 }, { id: '2a', label: '2nd AC - 2A', count: 23 }, { id: '3a', label: '3rd AC - 3A', count: 45 }, { id: 'sl', label: 'Sleeper - SL', count: 67 }, { id: 'ec', label: 'Exec. Chair Car - EC', count: 8 }, { id: 'cc', label: 'AC Chair Car - CC', count: 15 }, { id: '2s', label: '2nd Sitting - 2S', count: 40 }, ], trainTypes: [ { id: 'shatabdi', label: 'Shatabdi', count: 5 }, { id: 'rajdhani', label: 'Rajdhani', count: 3 }, { id: 'duronto', label: 'Duronto', count: 2 }, { id: 'garib_rath', label: 'Garib Rath', count: 1 }, { id: 'humsafar', label: 'Humsafar', count: 1 }, { id: 'vande_bharat', label: 'Vande Bharat', count: 1 }, ], stationsInDeparture: [ { id: 'ndls', label: 'NDLS, New Delhi', count: 22 }, { id: 'anvt', label: 'Anand Vihar Trm - ANVT', count: 7 }, { id: 'dli', label: 'Delhi - DLI', count: 8 }, ], stationsInArrival: [ { id: 'cnb', label: 'CNB, Kanpur Ctrl', count: 87 }, { id: 'gaya', label: 'Gaya Jn - GAYA', count: 5 }, ] };
const classNames = { "1A": "AC First Class", "2A": "AC 2 Tier", "3A": "AC 3 Tier", "SL": "Sleeper Class", "EC": "Exec. Chair Car", "CC": "AC Chair Car", "2S": "2nd Sitting" };

// --- SUB-COMPONENTS ---
const TrainCard = ({ train, searchStateToPreserve }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { initiateBooking } = useBooking();
    const [selectedClass, setSelectedClass] = useState(null);
    const [travelerCount, setTravelerCount] = useState(1);

    const totalPrice = useMemo(() => {
        if (!selectedClass) return 0;
        return train.fares[selectedClass] * travelerCount;
    }, [selectedClass, travelerCount, train.fares]);

    const handleBookNow = () => {
        if (!selectedClass) return;
        if (!user) {
            sessionStorage.setItem('trainSearchState', JSON.stringify(searchStateToPreserve));
            navigate('/login', { state: { from: location } });
            return;
        }
        
        initiateBooking({
            destination: `Train: ${train.name}`,
            duration: `Class: ${classNames[selectedClass]}`,
            travelers: `${travelerCount} ${travelerCount > 1 ? 'Adults' : 'Adult'}`,
            train: { name: train.name, price: `₹${totalPrice.toLocaleString()}` },
            subtotal: `₹${totalPrice.toLocaleString()}`,
            gst: `₹${(totalPrice * 0.18).toLocaleString('en-IN', {minimumFractionDigits: 2})}`,
            total: `₹${(totalPrice * 1.18).toLocaleString('en-IN', {minimumFractionDigits: 2})}`,
        });
        navigate('/payment');
    };

    return (
        <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2"><h3 className="text-lg font-bold">{train.name}</h3><span className="text-sm text-muted-foreground">{train.duration}</span></div>
                <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex flex-col items-start"><span className="font-semibold">{train.departureTime}</span><span className="text-muted-foreground">{train.from}</span></div>
                    <ArrowRight className="w-5 h-5 text-primary" />
                    <div className="flex flex-col items-end"><span className="font-semibold">{train.arrivalTime}</span><span className="text-muted-foreground">{train.to}</span></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(train.fares).map(([classType, price]) => (
                        <div key={classType} onClick={() => setSelectedClass(classType)} className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${selectedClass === classType ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/50'}`}>
                            <p className="font-semibold">{classNames[classType] || classType}</p>
                            <p className="font-bold text-primary/80">₹{price.toLocaleString()}</p>
                            <p className={`text-xs ${train.availableSeats[classType] > 0 ? 'text-green-500' : 'text-yellow-500'}`}>{train.availableSeats[classType] > 0 ? `Available ${train.availableSeats[classType]}` : 'Waitlist'}</p>
                        </div>
                    ))}
                </div>
                {selectedClass && (
                    <div className="mt-4 pt-4 border-t border-dashed flex justify-between items-center">
                        <div className="flex items-end gap-4">
                            <div><p className="text-sm font-semibold">Selected: <span className="text-primary">{classNames[selectedClass]}</span></p><p className="text-lg font-bold">₹{totalPrice.toLocaleString()}</p></div>
                            <div><Label htmlFor={`travelers-${train.id}`} className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3"/>Travelers</Label><Select value={String(travelerCount)} onValueChange={(val) => setTravelerCount(Number(val))}><SelectTrigger id={`travelers-${train.id}`} className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{[1, 2, 3, 4, 5, 6].map(num => ( <SelectItem key={num} value={String(num)}>{num}</SelectItem> ))}</SelectContent></Select></div>
                        </div>
                        <Button onClick={handleBookNow} className="bg-gradient-hero hover:opacity-90">Book Now</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// THIS COMPONENT WAS MISSING FROM YOUR FILE
const FilterSection = ({ title, options, type = 'checkbox' }) => (
    <AccordionItem value={title.toLowerCase().replace(/\s/g, '-')}>
        <AccordionTrigger className="font-semibold text-base">{title}</AccordionTrigger>
        <AccordionContent className="pt-2 space-y-2">{type === 'checkbox' && options.map(opt => (<div key={opt.id} className="flex items-center space-x-2 justify-between"><div className="flex items-center space-x-2"><Checkbox id={opt.id} /><Label htmlFor={opt.id} className="font-normal text-muted-foreground">{opt.label}</Label></div><span className="text-muted-foreground text-sm">{opt.count}</span></div>))}{type === 'timeRange' && (<div className="grid grid-cols-2 gap-2">{options.map(opt => (<Button key={opt.id} variant="outline" className="flex flex-col h-auto p-3 text-left items-start"><span className="font-semibold">{opt.label}</span><span className="text-xs text-muted-foreground">{opt.time}</span></Button>))}</div>)}</AccordionContent>
    </AccordionItem>
);

// --- MAIN COMPONENT ---
const TrainResults = () => {
    const [trains, setTrains] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('availability');
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [fromCity, setFromCity] = useState(searchParams.get('from') || "NDLS, New Delhi");
    const [toCity, setToCity] = useState(searchParams.get('to') || "CNB, Kanpur");
    const [travelDate, setTravelDate] = useState(searchParams.get('date') ? parseISO(searchParams.get('date')) : new Date());
    const [trainClass, setTrainClass] = useState(searchParams.get('class') || "ALL");
    const dates = useMemo(() => { const baseDate = travelDate || new Date(); return Array(14).fill(0).map((_, i) => addDays(baseDate, i - 7)); }, [travelDate]);

    useEffect(() => {
        const savedState = sessionStorage.getItem('trainSearchState');
        if (savedState) {
            const { from, to, date, tClass, results } = JSON.parse(savedState);
            setFromCity(from);
            setToCity(to);
            setTravelDate(parseISO(date));
            setTrainClass(tClass);
            setTrains(results);
            setIsLoading(false);
            sessionStorage.removeItem('trainSearchState');
        } else {
            setIsLoading(true);
            const from = searchParams.get('from') || 'NDLS';
            const to = searchParams.get('to') || 'CNB';
            const date = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
            setFromCity(from);
            setToCity(to);
            setTravelDate(parseISO(date));
            setTimeout(() => { setTrains(generateMockTrains(from, to, date)); setIsLoading(false); }, 1500);
        }
    }, [searchParams]);

    const handleModifySearch = () => {
        const queryParams = new URLSearchParams({ from: fromCity.split(',')[0].trim(), to: toCity.split(',')[0].trim(), date: format(travelDate, 'yyyy-MM-dd'), class: trainClass }).toString();
        navigate(`/book-train/results?${queryParams}`);
    };
    const handleDateChange = (date) => {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set('date', format(date, 'yyyy-MM-dd'));
        navigate(`?${queryParams.toString()}`);
    };
    const sortedTrains = useMemo(() => {
        let sorted = [...trains];
        if (sortBy === 'travel_time') { sorted.sort((a, b) => (a.duration.localeCompare(b.duration))); } 
        else if (sortBy === 'departure') { sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime)); } 
        else if (sortBy === 'arrival') { sorted.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime)); }
        return sorted;
    }, [trains, sortBy]);

    const searchStateToPreserve = { from: fromCity, to: toCity, date: travelDate.toISOString(), tClass: trainClass, results: trains };
    
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-24">
                <div className="space-y-6">
                     <Card className="bg-card/50 border-border/50"><CardContent className="p-4 flex flex-wrap items-center gap-2"><div className="flex flex-col flex-grow min-w-[150px]"><Label htmlFor="fromCity" className="text-xs text-muted-foreground">FROM CITY</Label><Input id="fromCity" value={fromCity} onChange={e => setFromCity(e.target.value)} className="p-0 border-none h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" /></div><ArrowRightLeft className="w-5 h-5 text-primary cursor-pointer" onClick={() => { setFromCity(toCity); setToCity(fromCity); }}/><div className="flex flex-col flex-grow min-w-[150px]"><Label htmlFor="toCity" className="text-xs text-muted-foreground">TO CITY</Label><Input id="toCity" value={toCity} onChange={e => setToCity(e.target.value)} className="p-0 border-none h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" /></div><div className="flex flex-col flex-grow min-w-[150px]"><Label htmlFor="travelDate" className="text-xs text-muted-foreground">TRAVEL DATE</Label><Popover><PopoverTrigger asChild><Button variant={"ghost"} className="w-full justify-start text-left font-normal p-0 h-auto bg-transparent" id="travelDate"><CalendarIcon className="mr-2 h-4 w-4 hidden" />{travelDate ? format(travelDate, "E, dd MMM yy") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={travelDate} onSelect={setTravelDate} initialFocus /></PopoverContent></Popover></div><div className="flex flex-col flex-grow min-w-[100px]"><Label htmlFor="class" className="text-xs text-muted-foreground">CLASS</Label><Select value={trainClass} onValueChange={setTrainClass}><SelectTrigger className="w-full p-0 border-none h-auto bg-transparent focus:ring-0"><SelectValue placeholder="All Classes" /></SelectTrigger><SelectContent><SelectItem value="ALL">All Classes</SelectItem>{Object.keys(classNames).map(cls => (<SelectItem key={cls} value={cls}>{classNames[cls]}</SelectItem>))}</SelectContent></Select></div><Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleModifySearch}><Search className="w-4 h-4 mr-2"/>Search</Button></CardContent></Card>
                     <Card className="bg-card/50 border-border/50 p-2"><CardContent className="flex items-center p-0"><Carousel opts={{ align: "start" }} className="w-full"><CarouselContent className="-ml-2">{dates.map((date, index) => (<CarouselItem key={index} className="pl-2 basis-auto"><Button variant={isSameDay(date, travelDate) ? 'secondary' : 'ghost'} onClick={() => handleDateChange(date)} className="flex flex-col h-auto px-4 py-2"><span className="text-xs text-muted-foreground">{format(date, 'E, MMM dd')}</span><span className="font-semibold text-base">{format(date, 'dd')}</span></Button></CarouselItem>))}</CarouselContent><CarouselPrevious className="left-0" /><CarouselNext className="right-0" /></Carousel></CardContent></Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                           <Card className="bg-card/50">
                               <CardHeader><CardTitle className="flex justify-between items-center"><span>Filters</span> <Button variant="link" className="p-0 h-auto text-xs">Clear All</Button></CardTitle></CardHeader>
                               <CardContent>
                                   <ScrollArea className="h-[calc(100vh-18rem)]">
                                       <Accordion type="multiple" defaultValue={['quick-filters', 'journey-class-filters']} className="w-full pr-4">
                                           <FilterSection title="Quick Filters" options={filterOptions.quickFilters} /><FilterSection title="Ticket Type" options={filterOptions.ticketType} /><FilterSection title="Quota" options={filterOptions.quota} /><FilterSection title="Journey Class Filters" options={filterOptions.journeyClasses} /><FilterSection title="Train Types" options={filterOptions.trainTypes} /><FilterSection title="Stations in Delhi" options={filterOptions.stationsInDeparture} />
                                       </Accordion>
                                   </ScrollArea>
                               </CardContent>
                           </Card>
                        </div>
                    </aside>
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex justify-between items-center"><h2 className="text-xl font-bold">{sortedTrains.length} trains found</h2><div className="flex items-center gap-2 text-sm"><span className="font-semibold text-muted-foreground">Sort By:</span><Button variant={sortBy === 'availability' ? 'secondary' : 'ghost'} onClick={() => setSortBy('availability')} className="text-sm">Availability</Button><Button variant={sortBy === 'travel_time' ? 'secondary' : 'ghost'} onClick={() => setSortBy('travel_time')} className="text-sm">Travel Time</Button><Button variant={sortBy === 'departure' ? 'secondary' : 'ghost'} onClick={() => setSortBy('departure')} className="text-sm">Departure</Button><Button variant={sortBy === 'arrival' ? 'secondary' : 'ghost'} onClick={() => setSortBy('arrival')} className="text-sm">Arrival</Button></div></div>
                        <Card className="bg-blue-900/20 border-blue-500/30 text-blue-300"><CardContent className="p-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 flex-shrink-0" /><p className="text-sm">Get a Confirmed Ticket or 3X Refund with Alternate Trip. Look for the "Trip Guarantee" logo.</p></CardContent></Card>
                        {isLoading ? (<div className="flex justify-center items-center h-96"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>) : (sortedTrains.map(train => <TrainCard key={train.id} train={train} searchStateToPreserve={searchStateToPreserve} />))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TrainResults;