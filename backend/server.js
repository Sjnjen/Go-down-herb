require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const checkoutRoutes = require('./routes/checkout');
const verifyRoutes = require('./routes/verify');
const adminRoutes = require('./routes/admin');
const webhookRoutes = require('./routes/webhook');

const app = express();

app.use(cors());

// This must come BEFORE express.json(), and only applies to this one path.
// Paystack signs the raw bytes of the request body - if express.json()
// parses it first, the signature check inside webhook.js will always fail.
app.use('/webhook/paystack', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
// Serves your existing site (index.html, admin.html, etc.) exactly as-is.
app.use(express.static(path.join(__dirname, '..')));

// All payment/order logic lives under /api - this is what the frontend calls.
app.use('/api', checkoutRoutes);
app.use('/api', verifyRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Go Down Herbs server running on http://localhost:${PORT}`);
});
