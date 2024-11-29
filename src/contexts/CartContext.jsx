import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem('vehicle_reports_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    vinNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit'
  });

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('vehicle_reports_cart', JSON.stringify(cart));
  }, [cart]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const addToCart = (item) => {
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => 
      cartItem.title === item.title && cartItem.price === item.price
    );

    if (existingItem) {
      toast.error('This report is already in your cart');
      return;
    }

    setCart(prevCart => [...prevCart, {
      ...item,
      id: Date.now(), // Add unique ID for each cart item
      addedAt: new Date().toISOString()
    }]);
    toast.success('Report added to cart');
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    toast.success('Report removed from cart');
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('vehicle_reports_cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('vehicle_reports_cart');
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  const getCartCount = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCart,
      clearCart,
      getCartTotal,
      getCartCount,
      formData,
      handleInputChange,
    }}>
      {children}
    </CartContext.Provider>
  );
};