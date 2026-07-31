const express = require('express');
const router = express.Router();
const { getHerbPrice, getMerchPrice, getDeliveryFee } = require('../priceBook');
const { generateOrderNumber, createPendingOrder } = require('../db');

// POST /api/checkout
// Body: { customer: {name, phone, email, address, city, province},
//         items: [{ type: 'herb'|'merch', id: 'gdh', name, qty, size? }],
//         deliveryMethod: 'courierguy' | 'postnet' | 'pudo' }
router.post('/checkout', async (req, res) => {
  try {
    const { customer, items, deliveryMethod } = req.body;

    // --- Basic validation ---
    if (
  !customer ||
  !customer.name ||
  !customer.phone ||
  !customer.email ||
  !customer.address ||
  !customer.suburb ||
  !customer.city ||
  !customer.province ||
  !customer.postalCode
) {
  return res.status(400).json({ error: 'Missing required customer details.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    // --- Recalculate every price on the server. We NEVER trust prices ---
    // --- sent from the browser - this is what stops a tampered order. ---
    let subtotal = 0;
    const verifiedItems = [];
    for (const item of items) {
      const price = item.type === 'merch' ? getMerchPrice(item.id) : getHerbPrice(item.id);
      if (price === null) {
        return res.status(400).json({ error: `Unknown product: ${item.id}` });
      }
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      subtotal += price * qty;
      verifiedItems.push({ id: item.id, name: item.name, qty, price });
    }

    const deliveryFee = getDeliveryFee(deliveryMethod);
    if (deliveryFee === null) {
      return res.status(400).json({ error: 'Invalid or unavailable delivery method for online checkout. Please use WhatsApp for Bolt/Uber quotes.' });
    }

    const total = subtotal + deliveryFee;
    const orderNumber = generateOrderNumber();

    // --- Create the Paystack transaction (server-to-server) ---
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: customer.email,
        amount: Math.round(total * 100), // Paystack expects the amount in cents
        currency: 'ZAR',
        reference: orderNumber,
        callback_url: `${process.env.SITE_URL}/order-confirmation.html?reference=${orderNumber}`
      })
    });

    const paystackData = await paystackRes.json();
    if (!paystackData.status) {
      return res.status(502).json({ error: 'Could not start payment. Please try again.' });
    }

    // --- Save the order as "pending" BEFORE sending the customer to pay ---
    await createPendingOrder({
      orderNumber,
      customer,
      items: verifiedItems,
      deliveryMethod,
      deliveryFee,
      subtotal,
      total,
      paystackReference: orderNumber
    });

    res.json({
      authorization_url: paystackData.data.authorization_url,
      orderNumber
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Something went wrong starting checkout.' });
  }
});

module.exports = router;

