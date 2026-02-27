import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAuth } from "@/components/context/AuthContext";
import { useBooking } from "@/components/context/BookingContext";
import Header from "@/components/Header";
import Footer from "@/pages/Footer";
// --- THIS IS THE CORRECTED IMPORT LINE ---
import { Star, MapPin, Check, ChevronRight, Loader2 } from 'lucide-react';

// --- EXPANDED MOCK DATA with the bug fix ---
const mockHotelDatabase = {
    "0": {
        id: "0",
        name: "Estrela Do Mar Beach Resort - A Beach Property",
        location: "Calangute, North Goa",
        rating: 4.0,
        reviews: 7324,
        images: [
            "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
            "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
            "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
            "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg"
        ],
        amenities: ["Wifi", "Restaurant", "Bar", "Kids Play Area", "24-hour Room Service", "Vehicle Rentals"],
        rooms: [
            { id: 'r1', name: "Grand Swiss wooden cottage", price: 22125, originalPrice: 24000, images: ["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg", "https://images.pexels.com/photos/1458457/pexels-photo-1458457.jpeg"], size: "250 sq.ft", bed: "1 Queen Bed", amenities: ["Ironing Board", "Daily Housekeeping", "Bathroom", "24-hour in-room dining", "Laundry Service", "Air Conditioning"] },
            { id: 'r2', name: "Room with Private Balcony", price: 23196, originalPrice: 25500, images: ["https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg", "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg"], size: "344 sq.ft", bed: "1 King Bed", amenities: ["Garden View", "Bathtub", "Free Wi-Fi", "Mini Bar", "Electronic Safe", "Television"] },
        ]
    }
};

// --- THIS IS THE FIX ---
// Populate the rest of the mock database after the initial object is created
for (let i = 1; i < 30; i++) {
    mockHotelDatabase[i.toString()] = { 
        ...mockHotelDatabase["0"], 
        id: i.toString(),
        // Make some data unique to show changes
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        reviews: Math.floor(Math.random() * 5000),
    };
}
// -----------------------


const HotelDetails = () => {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const { user } = useAuth();
    const { initiateBooking } = useBooking();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const hotelData = mockHotelDatabase[hotelId];
        setHotel(hotelData);
    }, [hotelId]);

    const handleBookNow = (room) => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }

        const bookingData = {
            destination: hotel.name,
            duration: `Room: ${room.name}`,
            travelers: '1 Room, 2 Adults',
            hotel: { name: hotel.name, price: `₹${room.price.toLocaleString()}`},
            subtotal: `₹${room.price.toLocaleString()}`,
            gst: `₹${(room.price * 0.18).toLocaleString('en-IN', {minimumFractionDigits: 2})}`,
            total: `₹${(room.price * 1.18).toLocaleString('en-IN', {minimumFractionDigits: 2})}`,
        };
        initiateBooking(bookingData);
        navigate('/payment');
    }

    if (!hotel) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const topRoom = hotel.rooms[0];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-24">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold">{hotel.name}</h1>
                    <div className="flex items-center text-yellow-400">{Array(Math.floor(hotel.rating)).fill(0).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}</div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96">
                            <div className="col-span-2 row-span-2"><img src={hotel.images[0]} className="rounded-lg h-full w-full object-cover" /></div>
                            <div><img src={hotel.images[1]} className="rounded-lg h-full w-full object-cover" /></div>
                            <div><img src={hotel.images[2]} className="rounded-lg h-full w-full object-cover" /></div>
                            <div className="relative">
                                <img src={hotel.images[3]} className="rounded-lg h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                    <Button variant="outline">View All Photos</Button>
                                </div>
                            </div>
                        </div>
                        <Card className="bg-card/50"><CardContent className="p-4"><Tabs defaultValue="highlights"><TabsList><TabsTrigger value="highlights">Property Highlights</TabsTrigger><TabsTrigger value="amenities">Activities & Nearby Attractions</TabsTrigger></TabsList></Tabs></CardContent></Card>
                        <Card className="bg-card/50">
                            <CardHeader><CardTitle>About Property</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Located steps away from Calangute Beach, the property offers a luxury stay experience with well-furnished rooms, exceptional amenities, and premium restaurants. <span className="text-primary font-semibold cursor-pointer">More</span></p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
                                    {hotel.amenities.map(amenity => <div key={amenity} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /><span>{amenity}</span></div>)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50"><CardContent className="p-4 flex justify-between items-center"><div><p className="font-semibold">Login to unlock deals & manage your bookings!</p></div><Button>Login Now</Button></CardContent></Card>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">Select Room</h2>
                            {hotel.rooms.map(room => (
                                <Card key={room.id} className="bg-card/50 overflow-hidden">
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                        <div className="md:col-span-1">
                                            <Carousel><CarouselContent>{room.images.map((img, i) => <CarouselItem key={i}><img src={img} className="w-full h-48 object-cover"/></CarouselItem>)}</CarouselContent><CarouselPrevious className="left-2"/><CarouselNext className="right-2"/></Carousel>
                                            <div className="p-4 border-t border-border/50"><h4 className="font-bold">{room.name}</h4><p className="text-xs text-muted-foreground mt-2">{room.size} | {room.bed}</p><div className="grid grid-cols-2 gap-1 mt-2 text-xs">{room.amenities.map(am => <span key={am} className="flex items-center gap-1"><ChevronRight className="w-3 h-3"/>{am}</span>)}</div></div>
                                        </div>
                                        <div className="md:col-span-2 border-l border-border/50">
                                            <CardContent className="p-6 h-full flex flex-col justify-between">
                                                <div><h4 className="font-semibold">Room with Breakfast</h4><ul className="text-sm text-green-400 list-disc list-inside mt-2 space-y-1"><li>Lounge Access</li><li>Enjoy Live Music</li><li>Breakfast Included</li><li className="text-red-400">Non-Refundable</li></ul></div>
                                                <div className="flex justify-between items-end mt-4">
                                                    <div><p className="text-sm text-muted-foreground line-through">₹{room.originalPrice.toLocaleString()}</p><p className="text-2xl font-bold">₹{room.price.toLocaleString()}</p><p className="text-xs text-muted-foreground">+ ₹{(room.price * 0.18).toLocaleString()} taxes & fees</p></div>
                                                    <Button size="lg" onClick={() => handleBookNow(room)}>Select Room</Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <Card className="bg-card/50"><CardContent className="p-4"><h4 className="font-semibold">{topRoom.name}</h4><ul className="text-xs text-muted-foreground list-disc list-inside mt-2"><li>No meals included</li><li>Non-Refundable</li></ul><p className="text-2xl font-bold mt-2">₹{topRoom.price.toLocaleString()}</p><Button className="w-full mt-2" onClick={() => handleBookNow(topRoom)}>Book This Now</Button></CardContent></Card>
                            <Card className="bg-card/50"><CardContent className="p-4 flex items-center gap-4"><div className="bg-green-600 text-white font-bold p-2 rounded-md text-lg">{hotel.rating}</div><div><p className="font-semibold">Very Good</p><p className="text-xs text-muted-foreground">({hotel.reviews.toLocaleString()} ratings)</p></div></CardContent></Card>
                            <Card className="bg-card/50"><CardContent className="p-4"><div className="h-24 bg-muted rounded-md mb-2"></div><p className="font-semibold">{hotel.location}</p><p className="text-xs text-muted-foreground">About a minute walk to Calangute Beach</p></CardContent></Card>
                            <Card className="bg-blue-900/20 border-blue-500/30 text-blue-300"><CardContent className="p-4"><p className="font-semibold text-sm">Limited Time Offer</p><p className="text-xs">Special discount available on this property.</p></CardContent></Card>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HotelDetails;