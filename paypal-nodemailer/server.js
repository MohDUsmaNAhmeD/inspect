const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const paypal = require('@paypal/checkout-server-sdk');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// PayPal Configuration
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

// JWT Secret key - keep this consistent
const JWT_SECRET = 'your-secret-key-12345';

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  console.log('Token verification:', {
    receivedToken: token,
    authHeader: req.headers.authorization
  });

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({ success: false, message: 'Session expired' });
  }
};

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  // Hardcoded credentials for testing
  const ADMIN_EMAIL = 'gvehiclesinfo@gmail.com';
  const ADMIN_PASS = 'bwej pquf dnel cwlw';
  
  console.log('Login attempt:', {
    receivedEmail: email,
    receivedPassword: password,
    emailMatch: email === ADMIN_EMAIL,
    passwordMatch: password === ADMIN_PASS
  });

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    console.log('Login successful');
    const token = jwt.sign(
      { email: ADMIN_EMAIL },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      success: true,
      token,
      email: ADMIN_EMAIL
    });
  } else {
    console.log('Login failed:', {
      emailCorrect: email === ADMIN_EMAIL,
      passwordCorrect: password === ADMIN_PASS
    });
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Admin settings endpoints
app.get('/api/admin/settings', verifyAdminToken, (req, res) => {
  try {
    const settings = {
      email: process.env.ADMIN_EMAIL || 'gvehiclesinfo@gmail.com',
      paypal: {
        enabled: true,
        clientId: process.env.PAYPAL_CLIENT_ID || ''
      },
      prices: {
        basicReport: 29.99,
        fullReport: 49.99,
        premiumReport: 79.99,
        motorcycleReport: 39.99,
        truckReport: 59.99
      }
    };
    
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin settings',
      error: error.message
    });
  }
});

// Admin settings - Email endpoint
app.get('/api/admin/settings/email', verifyAdminToken, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      email: {
        smtp: {
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          user: process.env.SMTP_USER || 'gvehiclesinfo@gmail.com',
          secure: false
        },
        from: process.env.SMTP_USER || 'gvehiclesinfo@gmail.com',
        adminEmail: process.env.ADMIN_EMAIL || 'gvehiclesinfo@gmail.com'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email settings',
      error: error.message
    });
  }
});

// Admin settings - PayPal endpoint
app.get('/api/admin/settings/paypal', verifyAdminToken, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      paypal: {
        enabled: true,
        mode: 'sandbox',
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PayPal settings',
      error: error.message
    });
  }
});

// Store prices in memory (in a real app, this would be in a database)
let prices = {
  basicReport: 29.99,
  fullReport: 49.99,
  premiumReport: 79.99,
  motorcycleReport: 39.99,
  truckReport: 59.99
};

// Admin settings - Get Prices endpoint
app.get('/api/admin/settings/prices', verifyAdminToken, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      prices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price settings',
      error: error.message
    });
  }
});

// Admin settings - Update Prices endpoint
app.post('/api/admin/settings/prices', verifyAdminToken, (req, res) => {
  try {
    const newPrices = req.body.prices;
    console.log('Received price update:', newPrices);

    if (!newPrices || typeof newPrices !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid price data provided'
      });
    }

    // Validate price values
    for (const [key, value] of Object.entries(newPrices)) {
      if (typeof value !== 'number' || value < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price value for ${key}`
        });
      }
    }

    // Update prices
    prices = { ...prices, ...newPrices };
    console.log('Updated prices:', prices);

    // Send back updated prices
    res.status(200).json({
      success: true,
      message: 'Prices updated successfully',
      prices
    });
  } catch (error) {
    console.error('Error updating prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prices',
      error: error.message
    });
  }
});

// Add a new endpoint to get current prices for the frontend
app.get('/api/prices', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      prices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prices',
      error: error.message
    });
  }
});

// Admin orders endpoints
app.get('/api/admin/orders', verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    data: {
      orders: [],
      total: 0,
      page: 1,
      totalPages: 1,
      limit: 10
    }
  });
});

app.post('/api/admin/orders/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  res.json({
    success: true,
    message: `Order ${id} status updated to ${status}`,
    order: {
      id,
      status
    }
  });
});

// PayPal order verification endpoint
app.post('/api/verify-paypal-order', async (req, res) => {
  const { orderId } = req.body;

  try {
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const order = await client.execute(request);

    if (order.result.status === 'COMPLETED') {
      res.json({
        success: true,
        order: order.result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Order not completed',
        status: order.result.status
      });
    }
  } catch (error) {
    console.error('PayPal verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify PayPal order',
      error: error.message
    });
  }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to || process.env.ADMIN_EMAIL,
      subject,
      text,
      html
    });

    res.json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
