import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import
import MainLayout from './Mainlayout';
import Cart from './pages/Cart';

const App = () => (
  <Routes>
    <Route path="/" element={<MainLayout />} />
    <Route path="/Cart" element={<Cart />} />
  </Routes>
);

export default App;
