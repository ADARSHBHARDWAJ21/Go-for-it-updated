// src/pages/TrainBookingPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/pages/Footer";
import { Train, ArrowRight, UserPlus, Gift, Plane, IndianRupee } from "lucide-react";
import { format } from 'date-fns';

const TrainBookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [cancellationOption, setCancellationOption] = useState("payFee");
    const [irctcUsername, setIrctcUsername] = useState("");
    const [irctcPassword, setIrctcPassword] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [state, setState] = useState("");
    const [confirmDetails, setConfirmDetails] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setBookingDetails({
            trainNumber: params.get('trainNumber'),
            trainName: params.get('trainName'),
            from: params.get('from'),
            to: params.get('to'),
            depTime: params.get('depTime'),
            arrTime: params.get('arrTime'),
            travelDate: params.get('travelDate'),
            class: params.get('class'),
            price: parseFloat(params.get('price')),
            availability: params.get('availability'),
        });
        setLoading(false);
    }, [location.search]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!bookingDetails) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <p>No booking details found. Please go back and select a train.</p>
                <Button onClick={() => navigate('/book-train/results')}>Go to Train Results</Button>
            </div>
        );
    }

    // Mock pricing calculation
    const baseFare = bookingDetails.price;
    const taxes = 0.05 * baseFare; // 5% tax
    const convenienceFee = 50;
    const totalPayable = baseFare + taxes + convenienceFee;

    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
        "Uttarakhand", "West Bengal"
    ];

    const handlePayment = () => {
        // Implement your payment gateway integration here
        // For now, we'll just log and simulate success
        alert(`Initiating payment for ₹${totalPayable.toFixed(2)} for ${bookingDetails.trainName}... (Simulated Payment Success)`);
        console.log("Booking Details:", bookingDetails);
        console.log("IRCTC Username:", irctcUsername);
        console.log("Mobile:", mobileNumber, "Email:", email);
        // Redirect to a confirmation page or dashboard
        navigate('/dashboard/bookings'); 
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-24 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Booking Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Train Info Card */}
                        <Card className="bg-gradient-card border-border/50 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Train className="h-6 w-6 text-primary"/>
                                        <CardTitle className="text-xl">{bookingDetails.trainName} ({bookingDetails.trainNumber})</CardTitle>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <span className="font-semibold text-foreground">{bookingDetails.class}</span> | <span className={`${bookingDetails.availability.startsWith('AVAILABLE') ? 'text-green-500' : 'text-yellow-500'}`}>{bookingDetails.availability}</span>
                                    </div>
                                </div>
                                <CardDescription className="flex items-center justify-between">
                                    <span>{format(new Date(bookingDetails.travelDate), 'EEE, dd MMM yyyy')}</span>
                                    <span className="flex items-center">
                                        <span className="font-semibold text-foreground">{bookingDetails.depTime} {bookingDetails.from}</span>
                                        <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                                        <span className="font-semibold text-foreground">{bookingDetails.arrTime} {bookingDetails.to}</span>
                                    </span>
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Cancellation Option */}
                        <Card className="bg-card/50 border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Cancellation Options</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={cancellationOption} onValueChange={setCancellationOption} className="space-y-4">
                                    <div className="flex items-start space-x-4 p-3 rounded-lg border border-border/50 bg-muted/20">
                                        <RadioGroupItem value="fullRefund" id="fullRefund" className="mt-1" />
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="fullRefund" className="text-base font-semibold">
                                                Get full ticket refund on Cancellation
                                            </Label>
                                            <p className="text-sm text-muted-foreground">Just ₹275 per person. <span className="text-primary cursor-pointer">Know More</span></p>
                                            <p className="text-xs text-yellow-500 flex items-center">
                                                <Plane className="h-3 w-3 mr-1"/> Zero charges when the ticket is cancelled
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 p-3 rounded-lg border border-border/50 bg-muted/20">
                                        <RadioGroupItem value="payFee" id="payFee" className="mt-1" />
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="payFee" className="text-base font-semibold">
                                                Pay fee on cancellation
                                            </Label>
                                            <p className="text-sm text-muted-foreground">As per IRCTC & Railway cancellation rules</p>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Add Traveller & Preferences */}
                        <Card className="bg-card/50 border-border/50 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Add Travellers & Preferences</CardTitle>
                                    <Button variant="outline" size="sm"><UserPlus className="h-4 w-4 mr-2"/> Add Traveller</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input placeholder="Name" />
                                <Input placeholder="Age" type="number" />
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* IRCTC Account Details */}
                        <Card className="bg-card/50 border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">IRCTC Account Details</CardTitle>
                                <CardDescription>Why is this required? Your IRCTC credentials are required to book your tickets.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="irctcUsername" className="mb-2 block">IRCTC Username</Label>
                                    <Input id="irctcUsername" value={irctcUsername} onChange={(e) => setIrctcUsername(e.target.value)} placeholder="Enter your IRCTC Username" />
                                </div>
                                <div>
                                    <Label htmlFor="irctcPassword" className="mb-2 block">IRCTC Password</Label>
                                    <Input id="irctcPassword" type="password" value={irctcPassword} onChange={(e) => setIrctcPassword(e.target.value)} placeholder="Enter your IRCTC Password" />
                                    <Button variant="link" className="px-0 pt-2 text-primary">Get New Password</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="bg-card/50 border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                                <CardDescription>Your ticket details will be sent here.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" className="mb-2 block">Email</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                                </div>
                                <div>
                                    <Label htmlFor="mobile" className="mb-2 block">Mobile Number</Label>
                                    <Input id="mobile" type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="Enter your mobile number" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Offers & Discounts */}
                        <Card className="bg-card/50 border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Offers & Discounts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between border-b border-dashed pb-4">
                                    <div>
                                        <p className="font-semibold">MMTFIRSTFLIGHT</p>
                                        <p className="text-sm text-muted-foreground">Get Rs. 500 instant off.</p>
                                    </div>
                                    <Button variant="outline" className="text-primary">Login to avail</Button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input placeholder="Have a coupon code?" className="flex-grow" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}/>
                                    <Button>Apply</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Preferences */}
                        <Card className="bg-card/50 border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Additional Preferences</CardTitle>
                                <CardDescription>Optional</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="state" className="mb-2 block">Your State <span className="text-muted-foreground">(Required for GST purposes if your hotel/hostel has a GSTIN and if you claim GST from your guest profile.)</span></Label>
                                    <Select value={state} onValueChange={setState}>
                                        <SelectTrigger><SelectValue placeholder="Select the State" /></SelectTrigger>
                                        <SelectContent>
                                            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="confirmDetails" checked={confirmDetails} onCheckedChange={setConfirmDetails} />
                                    <Label htmlFor="confirmDetails" className="text-sm font-normal text-muted-foreground">
                                        I confirm that all details given above are correct.
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Travel Advisory */}
                        <Card className="bg-card/50 border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Travel Advisory</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Please read health advisories by relevant authorities. <span className="text-primary cursor-pointer">Know more</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    By proceeding with the booking, I confirm that I have read and accept the <span className="text-primary cursor-pointer">Cancellation & Refund Policy</span>, <span className="text-primary cursor-pointer">Privacy Policy</span>, <span className="text-primary cursor-pointer">User Agreement</span> and <span className="text-primary cursor-pointer">Terms of Service</span>.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Price Details & Payment */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-card/50 border-border/50 shadow-lg sticky top-24">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Price Details</CardTitle>
                                    <div className="flex items-center text-sm text-primary">
                                        <Gift className="h-4 w-4 mr-1"/> Login
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center text-muted-foreground text-sm">
                                    <span>Base Fare</span>
                                    <span>₹{baseFare.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-muted-foreground text-sm">
                                    <span>Taxes & Fees</span>
                                    <span>₹{taxes.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-muted-foreground text-sm">
                                    <span>Convenience Fee</span>
                                    <span>₹{convenienceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-border/50">
                                    <span>Total Payable</span>
                                    <span className="text-primary flex items-center"><IndianRupee className="h-4 w-4 mr-1"/>{totalPayable.toFixed(2)}</span>
                                </div>
                                <Button 
                                    className="w-full bg-gradient-hero hover:opacity-90 mt-6" 
                                    size="lg"
                                    onClick={handlePayment}
                                    disabled={!confirmDetails || !irctcUsername || !irctcPassword || !mobileNumber || !email || !state} // Basic validation
                                >
                                    PAY & BOOK NOW
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Login/Signup Prompt */}
                        <Card className="bg-card/50 border-border/50 shadow-sm">
                            <CardContent className="p-4 text-center space-y-2">
                                <p className="text-sm font-semibold">Sign in or Login</p>
                                <p className="text-xs text-muted-foreground">Unlock more savings & benefits</p>
                                <div className="flex items-center justify-center text-xs text-green-500">
                                    <Checkbox checked disabled className="mr-2 border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"/>
                                    <span>Manage booking in MyTrips</span>
                                </div>
                                <div className="flex items-center justify-center text-xs text-green-500">
                                    <Checkbox checked disabled className="mr-2 border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"/>
                                    <span>Refund faster when ticket is cancelled</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TrainBookingPage;