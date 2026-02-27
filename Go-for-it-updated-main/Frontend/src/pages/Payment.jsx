import React, { useState } from 'react';
import { useBooking } from '@/components/context/BookingContext';
import {
  CreditCard,
  Banknote,
  Upload,
  User,
  ShieldCheck,
  Plane,
  Hotel,
  QrCode,
  Lock,
  ArrowRight,
  Fingerprint,
  Train
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';


const Payment = () => {
  const [activeStep, setActiveStep] = useState('verification');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { bookingDetails } = useBooking();
  const navigate = useNavigate();

  // If user lands here directly without booking details, redirect them or show a message.
  if (!bookingDetails) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
            <Card className="max-w-lg text-center">
                <CardHeader>
                    <CardTitle className="gradient-text text-2xl">No Booking Details Found</CardTitle>
                    <CardDescription>It looks like you've landed here directly. Please start by planning a trip or selecting a package.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => navigate('/')} className="bg-gradient-hero hover:opacity-90">
                        Go to Homepage
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  const tripSummary = bookingDetails;

  const renderStepIndicator = () => (
    <div className="flex items-center w-full mb-12">
      <div className="flex-1">
        <div className={`flex items-center ${activeStep === 'verification' ? 'text-primary' : 'text-foreground'}`}>
          <ShieldCheck className="w-6 h-6 mr-2" />
          <span className="font-semibold">1. Verification</span>
        </div>
      </div>
      <div className="flex-1 border-t-2 border-dashed border-border mx-4"></div>
      <div className="flex-1">
        <div className={`flex items-center ${activeStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
          <CreditCard className="w-6 h-6 mr-2" />
          <span className="font-semibold">2. Payment</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold gradient-text">Complete Your Booking</h1>
          <p className="text-muted-foreground mt-2">Securely provide your details to finalize your purchase for {tripSummary.destination}.</p>
        </header>

        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeStep === 'verification' && (
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle>Traveler & Document Verification</CardTitle>
                  <CardDescription>Please provide the required documents for all travelers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold flex items-center"><User className="mr-2 h-4 w-4"/>Traveler 1 (Primary)</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name1">Full Name (as on ID)</Label>
                            <Input id="name1" placeholder="John Doe" />
                        </div>
                        <div>
                            <Label htmlFor="dob1">Date of Birth</Label>
                            <Input id="dob1" type="date" />
                        </div>
                        <div>
                            <Label htmlFor="id-type">ID Type</Label>
                            <Select>
                                <SelectTrigger id="id-type">
                                    <SelectValue placeholder="Select ID Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="dl">Driving License</SelectItem>
                                    <SelectItem value="voterid">Voter ID</SelectItem>
                                    <SelectItem value="pan">PAN Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="id-upload">Upload ID (PDF, JPG)</Label>
                            <div className="relative">
                                <Input id="id-upload" type="file" className="file:text-foreground pr-12"/>
                                <Upload className="absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                            </div>
                        </div>
                     </div>
                  </div>
                  
                  <Alert variant="default" className="bg-secondary/30 border-primary/20">
                    <Fingerprint className="h-4 w-4" />
                    <AlertTitle>Secure & Verified</AlertTitle>
                    <AlertDescription>
                      Your documents are encrypted and only used for verification purposes.
                    </AlertDescription>
                  </Alert>
                  <Button size="lg" className="w-full bg-gradient-hero hover:opacity-90" onClick={() => setActiveStep('payment')}>
                    Proceed to Payment <ArrowRight className="ml-2 h-4 w-4"/>
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeStep === 'payment' && (
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Choose your preferred payment method.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
                      <TabsTrigger value="upi">UPI</TabsTrigger>
                      <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
                    </TabsList>
                    <TabsContent value="card" className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="upi" className="mt-6 space-y-4">
                        <div>
                          <Label htmlFor="upiId">UPI ID</Label>
                          <Input id="upiId" placeholder="yourname@okhdfcbank" />
                        </div>
                        <div className="flex items-center space-x-2">
                           <Separator className="flex-1"/>
                           <span className="text-xs text-muted-foreground">OR</span>
                           <Separator className="flex-1"/>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border">
                          <p className="text-sm font-medium mb-2">Scan QR to Pay</p>
                          <div className="p-2 bg-white rounded-md">
                            <QrCode className="h-24 w-24 text-black"/>
                          </div>
                           <p className="text-xs text-muted-foreground mt-2">Use any UPI app like Google Pay, PhonePe, Paytm</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="netbanking" className="mt-6 space-y-4">
                       <div>
                          <Label htmlFor="bank">Select Bank</Label>
                           <Select>
                            <SelectTrigger id="bank">
                                <SelectValue placeholder="Choose your bank" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sbi">State Bank of India</SelectItem>
                                <SelectItem value="hdfc">HDFC Bank</SelectItem>
                                <SelectItem value="icici">ICICI Bank</SelectItem>
                                <SelectItem value="axis">Axis Bank</SelectItem>
                                <SelectItem value="pnb">Punjab National Bank</SelectItem>
                            </SelectContent>
                           </Select>
                        </div>
                        <p className="text-xs text-muted-foreground">You will be redirected to your bank's secure portal to complete the payment.</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Booking for</span>
                  <span className="font-medium">{tripSummary.destination}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{tripSummary.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Travelers</span>
                  <span className="font-medium">{tripSummary.travelers}</span>
                </div>
                
                {(tripSummary.flight || tripSummary.train || tripSummary.hotel) && <Separator/>}

                {tripSummary.flight && <div className="flex items-start justify-between">
                  <span className="text-muted-foreground flex items-center"><Plane className="h-4 w-4 mr-2"/>Flight</span>
                  <span className="font-medium text-right">{tripSummary.flight.airline}, {tripSummary.flight.price}</span>
                </div>}

                {tripSummary.train && <div className="flex items-start justify-between">
                  <span className="text-muted-foreground flex items-center"><Train className="h-4 w-4 mr-2"/>Train</span>
                  <span className="font-medium text-right">{tripSummary.train.name}, {tripSummary.train.price}</span>
                </div>}

                 {tripSummary.hotel && <div className="flex items-start justify-between">
                  <span className="text-muted-foreground flex items-center"><Hotel className="h-4 w-4 mr-2"/>Hotel</span>
                  <span className="font-medium text-right">{tripSummary.hotel.name}, {tripSummary.hotel.price}</span>
                </div>}

                <Separator/>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{tripSummary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>{tripSummary.gst}</span>
                </div>
                <Separator/>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Payable</span>
                  <span className="text-primary">{tripSummary.total}</span>
                </div>
              </CardContent>
            </Card>
             <Button size="lg" className="w-full bg-gradient-hero hover:opacity-90 text-lg py-6" disabled={activeStep !== 'payment'}>
                <Lock className="mr-2 h-5 w-5"/> Confirm & Pay {tripSummary.total}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;