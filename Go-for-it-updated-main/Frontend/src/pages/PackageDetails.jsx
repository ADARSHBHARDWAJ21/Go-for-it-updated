// src/pages/PackageDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packageData, trekkingPackages, religiousPackages, adventurePackages } from '@/lib/packagedata.js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/pages/Footer";
import { useBooking } from "@/components/context/BookingContext";
import { Calendar, Users, Wallet, Download } from 'lucide-react'; // Import Download icon
import { Label } from '@/components/ui/label';

const PackageDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { initiateBooking } = useBooking();

    const [pack, setPack] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState("5");
    const [travelers, setTravelers] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    // Resolve package by slug (e.g., rajasthan-desert-safari) or numeric id
    useEffect(() => {
        const slugify = (str = '') => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const all = [
            ...packageData.map(p => ({...p})),
            ...trekkingPackages.map(p => ({...p})),
            ...religiousPackages.map(p => ({...p})),
            ...adventurePackages.map(p => ({...p})),
        ];
        const found = all.find(p => {
            const titleSlug = p.title ? slugify(p.title) : '';
            const nameSlug = p.name ? slugify(p.name) : '';
            return String(p.id) === id || titleSlug === id || nameSlug === id;
        });
        if (found) setPack({
            name: found.title,
            description: found.description,
            image: found.image,
            // Provide a simple durations map compatible with existing UI
            durations: { '5': { days: 5, price: Number(String(found.price).replace(/[^0-9]/g, '')) || 15000 }, '7': { days: 7, price: (Number(String(found.price).replace(/[^0-9]/g, '')) || 15000) * 1.3 } },
            itinerary: [
                { day: 1, title: 'Arrival & Check-in', description: 'Arrive, transfer to hotel and rest.' },
                { day: 2, title: 'Sightseeing', description: 'Guided city tour and local experiences.' },
                { day: 3, title: 'Leisure & Shopping', description: 'Free time and optional activities.' },
            ]
        });
        else setPack(null);
    }, [id]);

    useEffect(() => {
        if (pack) {
            setTotalPrice(pack.durations[selectedDuration].price * travelers);
        }
    }, [selectedDuration, travelers, pack]);

    const handlePayNow = () => {
        if (!pack) return;
        
        const subtotal = totalPrice;
        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        const bookingData = {
            destination: pack.name,
            duration: `${pack.durations[selectedDuration].days} Days`,
            travelers: `${travelers} Traveler(s)`,
            flight: null,
            hotel: null,
            subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
            gst: `₹${gst.toFixed(2).toLocaleString('en-IN')}`,
            total: `₹${total.toFixed(2).toLocaleString('en-IN')}`,
        };
        initiateBooking(bookingData);
        navigate('/payment');
    };

    // NEW FUNCTION: Handles the itinerary download
    const handleDownloadItinerary = () => {
        if (!pack) return;

        let content = `Trip Itinerary: ${pack.name}\n`;
        content += `===================================\n\n`;
        content += `${pack.description}\n\n`;
        content += `Duration: ${pack.durations[selectedDuration].days} Days\n`;
        content += `Travelers: ${travelers}\n\n`;
        
        pack.itinerary.forEach(day => {
            content += `Day ${day.day}: ${day.title}\n`;
            content += `   - ${day.description}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GoForIt_Itinerary_${pack.name.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!pack) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Package not found or loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Itinerary Details */}
                    <div className="lg:col-span-2">
                        <img src={pack.image} alt={pack.name} className="w-full h-80 object-cover rounded-lg mb-6" />
                        <h1 className="text-4xl font-bold gradient-text">{pack.name}</h1>
                        <p className="text-muted-foreground mt-2 mb-6">{pack.description}</p>
                        
                        <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                        <div className="space-y-4">
                            {pack.itinerary.map((day) => (
                                <div key={day.day} className="flex items-start space-x-4">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">{day.day}</div>
                                        <div className="h-full border-l-2 border-dashed border-border flex-grow"></div>
                                    </div>
                                    <div className="pb-4 flex-1">
                                        <h3 className="font-semibold">{day.title}</h3>
                                        <p className="text-muted-foreground text-sm">{day.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking & Price Card */}
                    <aside className="lg:col-span-1">
                        <Card className="bg-card/50 sticky top-24">
                            <CardHeader>
                                <CardTitle>Book Your Trip</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label>Duration</Label>
                                    <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">{pack.durations["5"].days} Days</SelectItem>
                                            <SelectItem value="7">{pack.durations["7"].days} Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Travelers</Label>
                                    <Select value={String(travelers)} onValueChange={(val) => setTravelers(Number(val))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <SelectItem key={num} value={String(num)}>{num} {num > 1 ? 'Travelers' : 'Traveler'}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Price per person</span>
                                        <span>₹{pack.durations[selectedDuration].price.toLocaleString('en-IN')}</span>
                                    </div>
                                     <div className="flex justify-between font-semibold">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                {/* NEW: Button group for actions */}
                                <div className="flex flex-col space-y-2">
                                    <Button size="lg" className="w-full bg-gradient-hero hover:opacity-90" onClick={handlePayNow}>
                                        <Wallet className="mr-2 h-5 w-5"/>
                                        Pay Now
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full" onClick={handleDownloadItinerary}>
                                        <Download className="mr-2 h-5 w-5"/>
                                        Download Itinerary
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PackageDetails;