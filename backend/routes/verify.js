const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const { markOrderPaid, getOrderByReference } = require('../db');

const resend = new Resend(process.env.RESEND_API_KEY);

// GET /api/verify?reference=GDH-583927
// This is the ONLY place an order is ever marked "paid". It works by
// asking Paystack directly, server-to-server, using the secret key.
// Nothing the customer's browser sends is trusted for this decision.
router.get('/verify', async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) return res.status(400).json({ error: 'Missing reference.' });

    const order = await getOrderByReference(reference);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    // Already verified before (customer refreshed the page) - don't re-charge or re-email.
    if (order.payment_status === 'paid') {
      return res.json(buildResponse(order));
    }

    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    });
    const paystackData = await paystackRes.json();

    const paidSuccessfully =
      paystackData.status &&
      paystackData.data.status === 'success' &&
      paystackData.data.amount === Math.round(order.total * 100); // amount must match exactly - stops tampering

    if (!paidSuccessfully) {
      return res.status(402).json({ success: false, error: 'Payment could not be verified.' });
    }

    const updatedOrder = await markOrderPaid(reference);
    await sendOwnerEmail(updatedOrder);

    res.json(buildResponse(updatedOrder));
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Something went wrong verifying payment.' });
  }
});

function buildResponse(order) {
  const itemLines = order.items.map(i => `${i.name} x${i.qty}`).join(', ');
  const whatsappText =
    `Hello Go Down Herbs,\n\nI have completed my payment.\n\n` +
    `Order Number: ${order.order_number}\n\n` +
    `My order:\n${order.items.map(i => `${i.name} - Qty: ${i.qty}`).join('\n')}\n\n` +
    `Delivery Address: ${order.address}, ${order.city}, ${order.province}\n\n` +
    `Please confirm my order.`;

  return {
    success: true,
    orderNumber: order.order_number,
    total: order.total,
    whatsappNumber: process.env.WHATSAPP_NUMBER,
    whatsappUrl: `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`
  };
}

async function sendOwnerEmail(order) {
  const itemLines = order.items
    .map(i => `${i.name} x ${i.qty} - R${(i.price * i.qty).toFixed(2)}`)
    .join('\n');

  const body =
    `Customer: ${order.customer_name}\n` +
    `Phone: ${order.phone}\n` +
    `Email: ${order.email}\n` +
    `Delivery Address: ${order.address}, ${order.city}, ${order.province}\n\n` +
    `Order:\n${itemLines}\n\n` +
    `Delivery (${order.delivery_method}): R${order.delivery_fee.toFixed(2)}\n` +
    `Total: R${order.total.toFixed(2)}\n\n` +
    `Payment status: PAID\n` +
    `Order number: ${order.order_number}`;

  await resend.emails.send({
    from: 'Go Down Herbs Orders <orders@resend.dev>', // swap to your own verified domain later
    to: process.env.OWNER_EMAIL,
    subject: `New Go Down Herbs Order ${order.order_number}`,
    text: body
  });
}

module.exports = router;

