import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 specific import
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Correct way to create the root element

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
