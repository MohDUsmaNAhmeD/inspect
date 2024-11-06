import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  CreditCard, 
  CheckCircle, 
  Shield, 
  Clock, 
  Wrench, 
  FileText,
  Star,
  AlertCircle,
  Phone,
  Camera,
  ChevronRight,
  Info,
  ShoppingCart
} from 'lucide-react';
import Header from '../components/navbar';
import AnimatedFooter from '../components/footer';

const CarInspectionCheckout = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cart, setCart] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const plans = [
    {
      id: "standard",
      name: 'STANDARD',
      price: 44.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XNluJtjXbq8sxH0hCWs3FrJvC1I9gj.png",
      features: [
        "VIN HISTORY",
        "In-Depth Ride Specs",
        "Precise Crash Logs",
        "Valid for a month"
      ],
      icon: <Wrench className="w-6 h-6" />,
      color: 'from-gray-500 to-gray-700'
    },
    {
      id: "premium",
      name: 'PREMIUM',
      price: 65.32,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XNluJtjXbq8sxH0hCWs3FrJvC1I9gj.png",
      features: [
        "VIN HISTORY",
        "In-Depth Ride Specs",
        "Precise Crash Logs",
        "Online Listing History",
        "Ownership History",
        "Vehicle Fitness",
        "Never Expires"
      ],
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-600 to-red-800',
      recommended: true
    },
    {
      id: "motorbike",
      name: 'MOTORBIKE',
      price: 39.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XNluJtjXbq8sxH0hCWs3FrJvC1I9gj.png",
      features: [
        "VIN HISTORY",
        "In-Depth Ride Specs",
        "Precise Crash Logs",
        "Online Listing History",
        "Ownership History",
        "Vehicle Fitness",
        "Money Owning",
        "RUC History",
        "Never Expires"
      ],
      icon: <Star className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-800'
    },
    {
      id: "caravan",
      name: 'CARAVAN TRAILER',
      price: 49.99,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XNluJtjXbq8sxH0hCWs3FrJvC1I9gj.png",
      features: [
        "VIN HISTORY",
        "In-Depth Ride Specs",
        "Precise Crash Logs",
        "Online Listing History",
        "Ownership History",
        "Valid for 3 months"
      ],
      icon: <Camera className="w-6 h-6" />,
      color: 'from-green-600 to-green-800'
    }
  ];

  const handleAddToCart = (plan) => {
    setCart([...cart, plan]);
    setSelectedPlan(plan);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
      <Header />

      {/* Main Content */}
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-red-400 to-gray-400 bg-clip-text text-transparent mb-4">
              Vehicle History Plans
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the plan that best suits your vehicle inspection needs.
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-black/50 backdrop-blur-lg border-gray-800/50 shadow-2xl">
            <CardHeader className="border-b border-gray-800/50 p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Select Your Plan</h3>
                    <p className="text-gray-400">Comprehensive vehicle history packages</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-900 text-gray-200">
                    <Star className="w-4 h-4 mr-1" /> 4.9/5 Rating
                  </Badge>
                  <Badge className="bg-gray-900 text-gray-200">
                    <CheckCircle className="w-4 h-4 mr-1" /> Certified
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Plans Section */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    {plans.map((plan) => (
                      <div 
                        key={plan.id}
                        onClick={() => handleAddToCart(plan)}
                        className={`group relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedPlan?.id === plan.id 
                            ? 'border-red-500 bg-gray-900/50' 
                            : 'border-gray-800/50 bg-gray-950/50'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                        <div className="relative p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-800/50 rounded-lg">
                                  {plan.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg text-white flex items-center gap-2">
                                    {plan.name}
                                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedPlan?.id === plan.id ? 'rotate-90' : ''}`} />
                                  </h4>
                                  {plan.recommended && (
                                    <Badge className="bg-red-500/10 text-red-400 mt-1">
                                      Most Popular
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-center text-sm text-gray-400">
                                    <span className="mr-2 text-red-500"><CheckCircle className="w-4 h-4" /></span>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="md:text-right">
                              <span className="text-2xl font-bold text-white">${plan.price}</span>
                              <p className="text-sm text-gray-400">One-time payment</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-6">
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-400">
                        <span>Selected Plan</span>
                        <span>{selectedPlan?.name || 'No plan selected'}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>${selectedPlan?.price.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Tax (8%)</span>
                        <span>${selectedPlan ? (selectedPlan.price * 0.08).toFixed(2) : '0.00'}</span>
                      </div>
                      <div className="border-t border-gray-800/50 pt-3 mt-3">
                        <div className="flex justify-between font-bold text-white">
                          <span>Total</span>
                          <span>${selectedPlan ? (selectedPlan.price * 1.08).toFixed(2) : '0.00'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="card" className="w-full">
                    <TabsList className="grid grid-cols-2 bg-gray-900/50 backdrop-blur-sm p-1">
                      <TabsTrigger 
                        value="card" 
                        className="flex items-center gap-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white transition-all duration-300"
                      >
                        <CreditCard className="w-4 h-4" />
                        Card
                      </TabsTrigger>
                      <TabsTrigger 
                        value="paypal" 
                        className="flex items-center gap-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white transition-all duration-300"
                      >
                        <Shield className="w-4 h-4" />
                        PayPal
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="mt-4">
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Card Number"
                            className="w-full p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                          />
                          <CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            className="p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                          />
                        </div>
                        <button 
                          className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950 ${
                            selectedPlan 
                              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
                              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!selectedPlan}
                        >
                          {selectedPlan ? 'Complete Purchase' : 'Select a Plan'}
                        </button>
                      </div>
                    </TabsContent>

                    <TabsContent value="paypal" className="mt-4">
                      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-800/50">
                        <p className="text-gray-400 mb-6">
                          Securely pay for your vehicle history report using PayPal. You'll be redirected to complete the payment.
                        </p>
                        <button 
                          className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 ${
                            selectedPlan 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
                              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!selectedPlan}
                        >
                          <Shield className="w-5 h-5" />
                          Pay with PayPal
                        </button>
                        <p className="text-gray-500 text-sm mt-4 flex items-center justify-center gap-1">
                          <Info className="w-4 h-4" />
                          Your payment is protected by PayPal's buyer protection
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Additional Information */}
                  <div className="mt-6 bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                    <div className="flex items-start gap-4">
                      <Shield className="w-6 h-6 text-red-500 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">Secure & Professional Service</h4>
                        <p className="text-gray-400 text-sm">
                          All our vehicle history reports are compiled by certified professionals with extensive experience. 
                          Your satisfaction is guaranteed or your money back.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      <AnimatedFooter />
    </div>
  );
};

export default CarInspectionCheckout;