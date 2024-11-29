import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, total } = location.state || { cart: [], total: 0 };
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    vinNumber: '',
    email: '',
  });

  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim() || !/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Valid 10-digit phone number is required';
    }
    if (!formData.vinNumber.trim() || formData.vinNumber.length !== 17) {
      errors.vinNumber = 'Valid 17-character VIN number is required';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }
    return errors;
  };

  const handlePaymentSelect = (method) => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }
    setSelectedPayment(method);
  };

  const PaymentOptions = () => (
    <div className="space-y-4 mt-6">
      <button
        onClick={() => handlePaymentSelect('paypal')}
        className="w-full bg-[#0070BA] hover:bg-[#005ea6] text-white py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 text-lg"
      >
        Pay with PayPal
      </button>
      <button
        onClick={() => handlePaymentSelect('venmo')}
        className="w-full bg-[#008CFF] hover:bg-[#0074D4] text-white py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 text-lg"
      >
        Pay with Venmo
      </button>
      <button
        onClick={() => handlePaymentSelect('card')}
        className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 text-lg"
      >
        <CreditCard className="h-6 w-6" />
        Pay with Card
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
        </div>

        {/* Main Content */}
        <div className="bg-zinc-900 rounded-xl p-6 md:p-8">
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="border-b border-zinc-800 pb-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-300">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-zinc-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Form */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number * (10 digits)
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    VIN Number * (17 characters)
                  </label>
                  <input
                    type="text"
                    name="vinNumber"
                    value={formData.vinNumber}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    placeholder="Enter VIN number"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <PaymentOptions />

            {/* PayPal Integration */}
            {selectedPayment === 'paypal' && (
              <div className="mt-6">
                <PayPalScriptProvider options={{ "client-id": "test" }}>
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          amount: {
                            value: total.toFixed(2)
                          }
                        }]
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        toast.success('Payment completed successfully!');
                        navigate('/');
                      });
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
