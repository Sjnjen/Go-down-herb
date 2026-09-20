const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const {
  markOrderPaidIfPending,
  updateEmailStatus,
  incrementEmailAttempts,
  hasProcessedWebhookEvent,
  getOrderByReference
} = require('../db');
const { sendOwnerEmailForOrder } = require('../orderEmails');

// IMPORTANT: this route needs the RAW request body to verify Paystack's
// signature, so in server.js it must be mounted with express.raw()
// BEFORE express.json() runs globally. See the server.js changes.
//
// In the Paystack dashboard, set your webhook URL to:
//   https://<your-render-app>.onrender.com/webhook/paystack
router.post('/', async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const rawBody = req.body; // Buffer - see express.raw() note above

  const expectedSignature = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.warn('Paystack webhook: invalid signature, ignoring.');
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(rawBody.toString('utf8'));

  // Acknowledge immediately once verified. Paystack retries on anything
  // other than a fast 2xx, which is exactly the duplicate-delivery case
  // hasProcessedWebhookEvent() below is built to handle safely.
  res.status(200).send('ok');

  if (event.event !== 'charge.success') {
    return; // ignore other event types for now
  }

  const reference = event.data.reference;
  const webhookEventId = String(event.data.id);

  try {
    const alreadySeen = await hasProcessedWebhookEvent(webhookEventId);
    if (alreadySeen) {
      console.log(`Webhook event ${webhookEventId} already processed, skipping.`);
      return;
    }

    // Double-check with Paystack directly rather than fully trusting the
    // webhook payload - cheap insurance against a spoofed/stale event.
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );
    const verifyJson = await verifyRes.json();

    if (!verifyJson.status || verifyJson.data.status !== 'success') {
      console.error(`Webhook: Paystack verify failed for reference ${reference}`);
      return;
    }

    const order = await getOrderByReference(reference);
    if (!order) {
      console.error(`Webhook: no order found for reference ${reference} - was it ever created in checkout?`);
      return;
    }

    // Cross-check amount paid against what we recorded at checkout.
    if (verifyJson.data.amount !== Math.round(order.total * 100)) {
      console.error(`Webhook: amount mismatch for ${reference} - paid ${verifyJson.data.amount}, expected ${Math.round(order.total * 100)}`);
      return;
    }

    const { order: paidOrder, alreadyProcessed } = await markOrderPaidIfPending(reference);

    if (alreadyProcessed) {
      // The customer's own /api/verify call already handled this order
      // (or a previous webhook delivery did). Don't send a second email.
      console.log(`Order ${reference} already marked paid elsewhere, webhook skipping email.`);
      return;
    }

    console.log(`Order ${reference} marked paid via webhook.`);

    const emailResult = await sendOwnerEmailForOrder(paidOrder);
    if (emailResult.success) {
      await updateEmailStatus(paidOrder.id, 'sent');
    } else {
      await updateEmailStatus(paidOrder.id, 'failed', emailResult.error);
      await incrementEmailAttempts(paidOrder.id, paidOrder.email_attempts);
    }
  } catch (err) {
    console.error('Unhandled error processing Paystack webhook:', err);
  }
});

module.exports = router;
