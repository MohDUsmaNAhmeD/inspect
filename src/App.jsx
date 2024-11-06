import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Mainlayout';
import Cart from './pages/Cart';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  </Router>
  
);

export default App;
