import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { ArrowLeft, Trash2, Lock, CreditCard } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import Header from "../components/navbar";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CartItem = ({ item, onRemove, fadeOut }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  if (isMobile) {
    return (
      <Card
        className={`bg-gray-900/50 border-gray-800 backdrop-blur transform transition-all duration-300 
          ${fadeOut === item.id ? 'opacity-0 translate-x-4' : 'opacity-100 hover:shadow-lg hover:border-gray-700'}`}
      >
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="font-semibold text-lg tracking-tight">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-red-500">
                ${parseFloat(item.price).toFixed(2)}
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-gray-900/50 border-gray-800 backdrop-blur transform transition-all duration-300 
        ${fadeOut === item.cartId ? "opacity-0 translate-x-4" : "opacity-100 hover:shadow-lg hover:border-gray-700"}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="font-semibold text-xl tracking-tight">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xl font-semibold min-w-[100px] text-right">
              ${parseFloat(item.price).toFixed(2)}
            </span>
            <button
              onClick={() => onRemove(item.cartId)}
              className="text-gray-400 hover:text-red-500 hover:bg-gray-800/50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const paypalButtonsRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    vinNumber: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  useEffect(() => {
    const savedCart = localStorage.getItem("vehicle_reports_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("vehicle_reports_cart", JSON.stringify(newCart));
  };

  const removeFromCart = (cartId) => {
    setFadeOut(cartId);
    setTimeout(() => {
      updateCart(cart.filter((item) => item.cartId !== cartId));
      setFadeOut(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.vinNumber) {
      return false;
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      return false;
    }

    if (formData.vinNumber.length !== 17) {
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const handlePaypalSuccess = async (details) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderDetails: {
            items: cart,
            total: total.toFixed(2),
            customerInfo: {
              ...formData,
              email: details.payer.email_address,
            },
            paypalDetails: details
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send confirmation email');
      }

      toast.success("Payment successful! Check your email for order details.");
      updateCart([]);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error("Payment completed but failed to send confirmation email");
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
          </div>

          {/* Cart Content */}
          <div className="grid md:grid-cols-[1fr,380px] gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    fadeOut={fadeOut}
                  />
                ))
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-zinc-900 rounded-xl p-6 h-fit space-y-6 sticky top-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span>Total</span>
                  <span className="text-xl font-bold bg-gray-800 px-4 py-2 rounded-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setShowPayment(!showPayment)}
                  className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 
                    text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 text-lg"
                >
                  <CreditCard className="h-6 w-6" />
                  Enter Payment Details
                </button>

                {showPayment && (
                  <div className="bg-zinc-800/80 backdrop-blur-sm p-6 rounded-xl mt-4 space-y-6">
                    <h3 className="text-xl font-semibold">Customer Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-200 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl bg-gray-900/50 border border-gray-700 px-4 py-3 text-white shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 text-base"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200 mb-2">
                          Phone Number * (10 digits)
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="1234567890"
                          className="w-full rounded-xl bg-gray-900/50 border border-gray-700 px-4 py-3 text-white shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 text-base"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="vinNumber" className="block text-sm font-medium text-gray-200 mb-2">
                          VIN Number * (17 characters)
                        </label>
                        <input
                          type="text"
                          id="vinNumber"
                          name="vinNumber"
                          value={formData.vinNumber}
                          onChange={handleInputChange}
                          className="w-full rounded-xl bg-gray-900/50 border border-gray-700 px-4 py-3 text-white shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 text-base"
                          required
                        />
                      </div>

                      {isFormValid && (
                        <div className="pt-4">
                          <PayPalScriptProvider options={{ 
                            "client-id": "test",
                            currency: "USD"
                          }}>
                            <PayPalButtons
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  purchase_units: [
                                    {
                                      amount: {
                                        value: total.toFixed(2),
                                      },
                                    },
                                  ],
                                });
                              }}
                              onApprove={(data, actions) => {
                                return actions.order.capture().then((details) => {
                                  handlePaypalSuccess(details);
                                });
                              }}
                              style={{ layout: "vertical" }}
                            />
                          </PayPalScriptProvider>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </button>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8 space-y-6">
            {cart.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <h3 className="text-2xl font-semibold mb-4">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-400 mb-8 text-lg text-center max-w-md">
                    Add some vehicle reports to get started with your purchase!
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 
                      text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Browse Plans
                  </button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <CartItem
                      key={item.cartId}
                      item={item}
                      onRemove={removeFromCart}
                      fadeOut={fadeOut}
                    />
                  ))}
                </div>

                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur mt-8">
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200">
                          Phone Number * (10 digits)
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="1234567890"
                          className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="vinNumber" className="block text-sm font-medium text-gray-200">
                          VIN Number * (17 characters)
                        </label>
                        <input
                          type="text"
                          id="vinNumber"
                          name="vinNumber"
                          value={formData.vinNumber}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </main>

          <aside className="lg:col-span-4">
            <Card className="bg-gray-900/50 border-gray-800 sticky top-8 backdrop-blur">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-400">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <Separator className="my-4 bg-gray-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  {cart.length > 0 && (
                    <div className="space-y-4">
                      {!isFormValid && (
                        <p className="text-sm text-red-400">
                          Please fill in all required fields correctly to proceed with payment
                        </p>
                      )}
                      {isFormValid && (
                        <PayPalScriptProvider options={{ 
                          "client-id": "test",
                          currency: "USD"
                        }}>
                          <PayPalButtons
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    amount: {
                                      value: total.toFixed(2),
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={(data, actions) => {
                              return actions.order.capture().then((details) => {
                                handlePaypalSuccess(details);
                              });
                            }}
                            style={{ layout: "horizontal" }}
                          />
                        </PayPalScriptProvider>
                      )}
                    </div>
                  )}
                </div>

                <footer className="space-y-4 pt-6 border-t border-gray-800">
                  <div className="space-y-3">
                    {[{ icon: Lock, text: "Secure Payment" }].map(
                      ({ icon: Icon, text }, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                          {text}
                        </div>
                      )
                    )}
                  </div>
                </footer>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}