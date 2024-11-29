import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './Mainlayout';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const App = () => (
  <>
    <Toaster position="top-right" />
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </>
);

export default App;
