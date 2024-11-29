import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Trash2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
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

const CartItem = ({ item, onRemove, fadeOut }) => {
  const getPrice = () => {
    if (!prices) return '0.00';
    return prices[item.reportType]?.toFixed(2) || '0.00';
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg ${fadeOut === item.cartId ? 'fade-out' : ''}`}>
      <div className="flex-1">
        <h3 className="font-semibold">{item.reportType}</h3>
        <p className="text-sm text-zinc-400">VIN: {item.vin}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-semibold">${getPrice()}</span>
        <button
          onClick={() => onRemove(item.cartId)}
          className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Customer Information Form Component
function CustomerInfoForm({ formData, setFormData, errors }) {
  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Full Name</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            className="bg-gray-800/50 border-gray-700"
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm">{errors.customerName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email Address</Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) =>
              setFormData({
                ...formData,
                customerEmail: e.target.value,
              })
            }
            className="bg-gray-800/50 border-gray-700"
          />
          {errors.customerEmail && (
            <p className="text-red-500 text-sm">{errors.customerEmail}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vinNumber">VIN Number</Label>
          <Input
            id="vinNumber"
            value={formData.vinNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                vinNumber: e.target.value.toUpperCase(),
              })
            }
            className="bg-gray-800/50 border-gray-700"
            maxLength={17}
          />
          {errors.vinNumber && (
            <p className="text-red-500 text-sm">{errors.vinNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address || ''}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="bg-gray-800/50 border-gray-700"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city || ''}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            className="bg-gray-800/50 border-gray-700"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country || ''}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="bg-gray-800/50 border-gray-700"
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber || ''}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="bg-gray-800/50 border-gray-700"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Cart Component
export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(null);
  const [prices, setPrices] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    vinNumber: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("vehicle_reports_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/prices');
        const data = await response.json();
        if (data.success) {
          setPrices(data.prices);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
  }, []);

  const getItemPrice = (reportType) => {
    if (!prices) return 0;
    return prices[reportType] || 0;
  };

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + getItemPrice(item.reportType), 0);
  }, [cart, prices]);

  const total = useMemo(() => {
    return subtotal + (subtotal * 0.15); // 15% tax
  }, [subtotal]);

  useEffect(() => {
    const valid = validateForm();
    console.log('Form validation result:', valid, formData);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email address';
    }

    if (!formData.vinNumber.trim()) {
      newErrors.vinNumber = 'VIN is required';
    } else if (formData.vinNumber.length !== 17) {
      newErrors.vinNumber = 'VIN must be 17 characters';
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsFormValid(valid);
    return valid;
  };

  const removeFromCart = (cartId) => {
    setFadeOut(cartId);
    setTimeout(() => {
      const newCart = cart.filter((item) => item.cartId !== cartId);
      setCart(newCart);
      localStorage.setItem("vehicle_reports_cart", JSON.stringify(newCart));
      setFadeOut(null);
    }, 300);
  };

  const handlePaypalApprove = async (data) => {
    try {
      setLoading(true);

      // Verify PayPal order
      const verifyResponse = await fetch('http://localhost:3000/api/verify-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      });

      const verifyResult = await verifyResponse.json();
      if (!verifyResult.success) {
        throw new Error(verifyResult.message || 'Failed to verify PayPal order');
      }

      // Send confirmation emails
      const emailResponse = await fetch('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          vinNumber: formData.vinNumber,
          items: cart,
          amount: total,
          paypalOrderId: data.orderID,
        }),
      });

      const emailResult = await emailResponse.json();
      if (!emailResult.success) {
        throw new Error(emailResult.message || 'Failed to send confirmation email');
      }

      // Clear cart and redirect
      localStorage.removeItem("vehicle_reports_cart");
      toast.success('Order completed successfully!');
      navigate('/success');
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(error.message || 'Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Continue Shopping
        </button>

        <h1 className="text-4xl font-bold tracking-tight mb-12">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <main className="lg:col-span-8 space-y-6">
            {cart.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-400 mb-8">
                    Add some vehicle reports to get started with your purchase!
                  </p>
                  <button
                    onClick={() => navigate(-1)}
                    className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 
                      text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Browse Plans
                  </button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}
          </main>

          <aside className="lg:col-span-4">
            <Card className="bg-gray-900/50 border-gray-800 sticky top-8">
              <CardHeader className="border-b border-gray-800">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
                <div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <Separator className="my-4 bg-gray-800" />

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Total</span>
                    <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="space-y-4">
                    <PayPalScriptProvider
                      options={{
                        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                        currency: "USD",
                        intent: "capture",
                      }}
                    >
                      {isFormValid ? (
                        <PayPalButtons
                          style={{ layout: 'vertical' }}
                          disabled={loading}
                          forceReRender={[total, isFormValid]}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: total.toFixed(2),
                                    currency_code: 'USD',
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            return actions.order.capture().then(() => {
                              handlePaypalApprove(data);
                            });
                          }}
                          onError={(err) => {
                            console.error('PayPal error:', err);
                            toast.error('There was an error processing your payment');
                          }}
                        />
                      ) : (
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                          <p className="text-sm text-gray-400">
                            Please fill in all required fields to enable payment
                          </p>
                        </div>
                      )}
                    </PayPalScriptProvider>
                  </div>
                )}

                <footer className="pt-4 border-t border-gray-800">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                      <Lock className="h-4 w-4 mr-3 flex-shrink-0" />
                      Secure Payment
                    </div>
                  </div>
                </footer>
              </CardContent>
            </Card>
            <CustomerInfoForm 
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
