// Backend (Node.js with Express) - server.js
const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] 
    : ['http://localhost:5173'],
  credentials: true
}));

// In-memory storage for orders (replace with database in production)
let orders = [];

// In-memory storage for settings
let settings = {
  prices: {
    basicReport: 29.99,
    fullReport: 49.99,
    premiumReport: 79.99,
    motorcycleReport: 34.99,
    truckReport: 44.99
  },
  email: {
    adminEmail: process.env.SMTP_FROM_EMAIL || 'gvehiclesinfo@gmail.com',
    emailSignature: 'Best regards,\nThe VehicleInfo Team',
    notificationEnabled: true
  }
};

// JWT secret key
const JWT_SECRET = 'your-secret-key-123'; // Hardcoded for now

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password }); // Debug log

    // Verify against environment variables
    if (email === process.env.SMTP_FROM_EMAIL && password === process.env.SMTP_PASSWORD) {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
      console.log('Login successful'); // Debug log
      res.json({ 
        success: true,
        token,
        message: 'Login successful' 
      });
    } else {
      console.log('Login failed - Invalid credentials'); // Debug log
      res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error); // Debug log
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all orders endpoint
app.get('/api/admin/orders', verifyAdminToken, (req, res) => {
  res.json({ orders });
});

// Update order status endpoint
app.patch('/api/admin/orders/:orderId', verifyAdminToken, (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  orders[orderIndex] = { ...orders[orderIndex], status };
  res.json({ order: orders[orderIndex] });
});

// Get price settings
app.get('/api/admin/settings/prices', verifyAdminToken, (req, res) => {
  res.json({ success: true, prices: settings.prices });
});

// Update price settings
app.post('/api/admin/settings/prices', verifyAdminToken, (req, res) => {
  try {
    const { basicReport, fullReport, premiumReport, motorcycleReport, truckReport } = req.body;
    
    if (basicReport) settings.prices.basicReport = parseFloat(basicReport);
    if (fullReport) settings.prices.fullReport = parseFloat(fullReport);
    if (premiumReport) settings.prices.premiumReport = parseFloat(premiumReport);
    if (motorcycleReport) settings.prices.motorcycleReport = parseFloat(motorcycleReport);
    if (truckReport) settings.prices.truckReport = parseFloat(truckReport);
    
    res.json({ 
      success: true, 
      message: 'Prices updated successfully',
      prices: settings.prices 
    });
  } catch (error) {
    console.error('Error updating prices:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update prices' 
    });
  }
});

// Get email settings
app.get('/api/admin/settings/email', verifyAdminToken, (req, res) => {
  res.json({ success: true, settings: settings.email });
});

// Update email settings
app.post('/api/admin/settings/email', verifyAdminToken, (req, res) => {
  try {
    const { adminEmail, emailSignature, notificationEnabled } = req.body;
    
    if (adminEmail) settings.email.adminEmail = adminEmail;
    if (emailSignature) settings.email.emailSignature = emailSignature;
    if (typeof notificationEnabled === 'boolean') {
      settings.email.notificationEnabled = notificationEnabled;
    }
    
    res.json({ 
      success: true, 
      message: 'Email settings updated successfully',
      settings: settings.email 
    });
  } catch (error) {
    console.error('Error updating email settings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update email settings' 
    });
  }
});

// Public endpoint to get current prices
app.get('/api/prices', (req, res) => {
  res.json({ success: true, prices: settings.prices });
});

// Create order endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, buyerEmail, buyerName } = req.body;
    
    const order = {
      id: Date.now().toString(),
      items,
      total,
      buyerEmail,
      buyerName,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    orders.push(order);

    // Send email to buyer
    const buyerMailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: buyerEmail,
      subject: 'Your Vehicle Information Report Order',
      html: `
        <h1>Order Confirmation</h1>
        <p>Dear ${buyerName},</p>
        <p>Thank you for your order. We will process it shortly.</p>
        <h2>Order Details:</h2>
        <ul>
          ${items.map(item => `<li>${item.name}: $${item.price}</li>`).join('')}
        </ul>
        <p>Total: $${total}</p>
        <p>We will send your report to this email address: ${buyerEmail}</p>
        <br>
        <p>${settings.email.emailSignature}</p>
      `
    };

    // Send email to admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: settings.email.adminEmail,
      subject: 'New Vehicle Information Report Order',
      html: `
        <h1>New Order Received</h1>
        <h2>Customer Details:</h2>
        <p>Name: ${buyerName}</p>
        <p>Email: ${buyerEmail}</p>
        <h2>Order Details:</h2>
        <ul>
          ${items.map(item => `<li>${item.name}: $${item.price}</li>`).join('')}
        </ul>
        <p>Total: $${total}</p>
        <p>Please process this order and send the report to: ${buyerEmail}</p>
      `
    };

    await Promise.all([
      transporter.sendMail(buyerMailOptions),
      settings.email.notificationEnabled ? transporter.sendMail(adminMailOptions) : Promise.resolve()
    ]);

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// PayPal Configuration
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // Use TLS
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// PayPal Create Order Endpoint
app.post('/create-paypal-order', async (req, res) => {
  try {
    const { amount, description } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: description || 'Product Purchase'
      }]
    });

    const order = await client.execute(request);
    res.json({ 
      id: order.result.id 
    });
  } catch (error) {
    console.error('PayPal Order Creation Error:', error);
    res.status(500).send(error.message);
  }
});

// PayPal Capture Order Endpoint
app.post('/capture-paypal-order', async (req, res) => {
  try {
    const { orderID, customerEmail, orderDetails } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);
    
    // Send confirmation email
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: customerEmail,
      subject: 'Order Confirmation',
      html: `
        <h1>Thank You for Your Purchase!</h1>
        <p>Order ID: ${orderID}</p>
        <p>Total Amount: $${capture.result.purchase_units[0].amount.value}</p>
        <p>Details: ${JSON.stringify(orderDetails)}</p>
      `
    });

    res.json({
      status: capture.result.status,
      orderID: capture.result.id
    });
  } catch (error) {
    console.error('PayPal Order Capture Error:', error);
    res.status(500).send(error.message);
  }
});

// Send Email Endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { orderDetails } = req.body;
    const { items, total, customerInfo, paypalDetails } = orderDetails;

    // Create new order
    const newOrder = {
      id: paypalDetails.id,
      customerName: customerInfo.fullName,
      customerPhone: customerInfo.phoneNumber,
      vinNumber: customerInfo.vinNumber,
      amount: parseFloat(total),
      items,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Add to orders array
    orders.push(newOrder);

    // Send confirmation email to customer
    const buyerMailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: customerInfo.email,
      subject: 'Order Confirmation - VehicleInfo',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #000; color: #fff; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .order-details { border: 1px solid #ddd; padding: 15px; margin: 20px 0; }
              .footer { text-align: left; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">VehicleInfo</h1>
              </div>
              <div class="content">
                <p>Hello ${customerInfo.fullName},</p>
                <p>Thank you for your purchase! Your vehicle reports will be processed and delivered to you shortly.</p>
                
                <div class="order-details">
                  <h3>Order Details</h3>
                  <p>Order ID: ${paypalDetails.id}</p>
                  <p>Total Amount: $${total}</p>
                  
                  <h4>Ordered Items:</h4>
                  ${items.map(item => `
                    <div>
                      <p style="margin: 5px 0;">
                        ${item.title} - $${item.price}
                      </p>
                    </div>
                  `).join('')}
                </div>
                
                <p>If you need any assistance, please contact us at ${process.env.SMTP_FROM_EMAIL}</p>
                
                <div class="footer">
                  <p>Best regards,<br>The VehicleInfo Team</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `
    };

    // Send notification email to admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_FROM_EMAIL,
      subject: 'New Order Received - VehicleInfo',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #000; color: #fff; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .alert { color: #e11d48; font-weight: bold; }
              .order-details { border: 1px solid #ddd; padding: 15px; margin: 20px 0; }
              .customer-info { background: #f9fafb; padding: 15px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">New Order Received</h1>
              </div>
              <div class="content">
                <p class="alert">New order requires your attention!</p>
                
                <div class="order-details">
                  <h3>Order Details</h3>
                  <p>Order ID: ${paypalDetails.id}</p>
                  <p>Total Amount: $${total}</p>
                </div>
                
                <div class="customer-info">
                  <h3>Customer Information</h3>
                  <p>Name: ${customerInfo.fullName}</p>
                  <p>Phone: ${customerInfo.phoneNumber}</p>
                  <p>VIN Number: ${customerInfo.vinNumber}</p>
                </div>
                
                <h3>Ordered Items:</h3>
                ${items.map(item => `
                  <div>
                    <p style="margin: 5px 0;">
                      ${item.title} - $${item.price}
                    </p>
                  </div>
                `).join('')}
                
                <p style="color: #e11d48; margin-top: 20px;">
                  Please process this order and prepare the vehicle reports for delivery.
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(buyerMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    res.status(200).json({ message: 'Emails sent successfully', order: newOrder });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, subject, toEmail } = req.body;

    // Create mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_FROM_EMAIL || 'gvehiclesinfo@gmail.com',
        pass: process.env.SMTP_PASSWORD
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || 'gvehiclesinfo@gmail.com',
      to: toEmail || 'gvehiclesinfo@gmail.com',
      subject: subject || `New Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the Express API
module.exports = app;

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}