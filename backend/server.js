require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const checkoutRoutes = require('./routes/checkout');
const verifyRoutes = require('./routes/verify');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
// Serves your existing site (index.html, admin.html, etc.) exactly as-is.
app.use(express.static(path.join(__dirname, 'public')));

// All payment/order logic lives under /api - this is what the frontend calls.
app.use('/api', checkoutRoutes);
app.use('/api', verifyRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Go Down Herbs server running on http://localhost:${PORT}`);
});

