import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 specific import
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Correct way to create the root element

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
