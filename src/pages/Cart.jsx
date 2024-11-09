import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Lock, Shield, WalletCards, DollarSign, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Separator } from "../components/ui/separator";

const CartItem = ({ item, onRemove, onUpdateQuantity, fadeOut }) => (
  <Card 
    className={`bg-gray-900/50 border-gray-800 backdrop-blur transform transition-all duration-300 
      ${fadeOut === item.cartId ? 'opacity-0 translate-x-4' : 'opacity-100 hover:shadow-lg hover:border-gray-700'}`}
  >
    <CardContent className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-1 min-w-0 space-y-2 py-10">
          <h3 className="font-semibold text-xl tracking-tight">{item.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-6 w-full sm:w-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full bg-gray-800/50 hover:bg-gray-700"
              onClick={() => onUpdateQuantity(item.cartId, (item.quantity || 1) - 1)}
            >
              -
            </Button>
            <span className="w-12 text-center text-lg font-medium">{item.quantity || 1}</span>
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full bg-gray-800/50 hover:bg-gray-700"
              onClick={() => onUpdateQuantity(item.cartId, (item.quantity || 1) + 1)}
            >
              +
            </Button>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xl font-semibold min-w-[100px] text-right">
              ${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.cartId)}
              className="text-gray-400 hover:text-red-500 hover:bg-gray-800/50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PaymentSection = ({ paymentMethod, onPaymentMethodChange }) => (
  <div className="space-y-6">
    <Label className="text-lg font-medium">Payment Method</Label>
    <RadioGroup 
      value={paymentMethod} 
      onValueChange={onPaymentMethodChange}
      className="space-y-3"
    >
      {[
        { value: 'credit', label: 'Credit Card', icon: CreditCard },
        { value: 'debit', label: 'Debit Card', icon: DollarSign }
      ].map(({ value, label, icon: Icon }) => (
        <div key={value} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-800/5 to-gray-800/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group">
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value} className="flex items-center text-lg cursor-pointer group-hover:text-white transition-colors">
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </Label>
          </div>
        </div>
      ))}
    </RadioGroup>
  </div>
);

const CardForm = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="card-number" className="text-sm font-medium">Card Number</Label>
      <Input 
        id="card-number" 
        placeholder="1234 5678 9012 3456" 
        className="bg-gray-800/50 border-gray-700 focus:border-red-800 h-12"
      />
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="expiry" className="text-sm font-medium">Expiry Date</Label>
        <Input 
          id="expiry" 
          placeholder="MM/YY" 
          className="bg-gray-800/50 border-gray-700 focus:border-red-800 h-12 w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
        <Input 
          id="cvv" 
          placeholder="123" 
          className="bg-gray-800/50 border-gray-700 focus:border-red-800 h-12 w-full"
        />
      </div>
    </div>
  </div>
);

export default function Component() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('vehicle_reports_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('vehicle_reports_cart', JSON.stringify(newCart));
  };

  const removeFromCart = (cartId) => {
    setFadeOut(cartId);
    setTimeout(() => {
      updateCart(cart.filter(item => item.cartId !== cartId));
      setFadeOut(false);
    }, 300);
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCart(cart.map(item =>
      item.cartId === cartId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateCart([]);
      alert('Order placed successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="group flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </Button>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8 space-y-6">
            {cart.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <h3 className="text-2xl font-semibold mb-4">Your cart is empty</h3>
                  <p className="text-gray-400 mb-8 text-lg text-center max-w-md">
                    Add some vehicle reports to get started with your purchase!
                  </p>
                  <Button
                    onClick={() => window.history.back()}
                    className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 
                      text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Browse Plans
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <CartItem 
                    key={item.cartId}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    fadeOut={fadeOut}
                  />
                ))}
              </div>
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
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-400">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4 bg-gray-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Total</span>
                    <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>

                <PaymentSection 
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                />

                {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                  <CardForm />
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className={`w-full py-6 text-lg font-medium bg-gradient-to-r from-red-900 to-red-800 
                    text-white rounded-xl transition-all duration-300 
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-800 hover:to-red-700 hover:shadow-lg hover:scale-[1.02]'}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="h-5 w-5 mr-3" />
                      Checkout ${total.toFixed(2)}
                    </div>
                  )}
                </Button>

                <footer className="space-y-4 pt-6 border-t border-gray-800">
                  <div className="space-y-3">
                    {[
                      { icon: Lock, text: 'Secure 256-bit SSL encryption' },
                      { icon: Shield, text: '30-day money-back guarantee' }
                    ].map(({ icon: Icon, text }, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center space-x-6 mt-4">
                    <CreditCard className="h-8 w-8 text-gray-400 hover:text-white transition-colors" />
                    <WalletCards className="h-8 w-8 text-gray-400 hover:text-white transition-colors" />
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