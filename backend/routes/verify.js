const express = require('express');
const router = express.Router();
const {
  markOrderPaidIfPending,
  getOrderByReference,
  updateEmailStatus,
  incrementEmailAttempts
} = require('../db');
const { sendOwnerEmailForOrder } = require('../orderEmails');

// GET /api/verify?reference=GDH-583927
router.get('/verify', async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) return res.status(400).json({ error: 'Missing reference.' });

    let order = await getOrderByReference(reference);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    if (order.payment_status === 'paid') {
      return res.json(buildResponse(order));
    }

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const paystackData = await paystackRes.json();

    const paidSuccessfully =
      paystackData.status &&
      paystackData.data.status === 'success' &&
      paystackData.data.amount === Math.round(order.total * 100);

    if (!paidSuccessfully) {
      return res.status(402).json({
        success: false,
        error: 'Payment could not be verified.'
      });
    }

    // Idempotent: if the webhook already marked this order paid and sent
    // the email (it can beat the browser here - webhooks are usually
    // fast), this just fetches the already-paid row instead of
    // re-processing and double-emailing.
    const { order: updatedOrder, alreadyProcessed } = await markOrderPaidIfPending(reference);
    order = updatedOrder;

    if (!alreadyProcessed) {
      // This request is the first to mark the order paid - send the
      // owner email. Isolated: whatever happens here, the customer still
      // gets their success response below, because the payment itself
      // (payment_status = 'paid') is already safely recorded.
      const emailResult = await sendOwnerEmailForOrder(order);
      if (emailResult.success) {
        await updateEmailStatus(order.id, 'sent');
      } else {
        await updateEmailStatus(order.id, 'failed', emailResult.error);
        await incrementEmailAttempts(order.id, order.email_attempts);
      }
    }

    res.json(buildResponse(order));

  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({
      error: 'Something went wrong verifying payment.'
    });
  }
});


function buildResponse(order) {

  const whatsappText =
`Hello Go Down Herbs,

I have completed my payment.

ORDER DETAILS
------------------
Order Number: ${order.order_number}

CUSTOMER DETAILS
------------------
Name: ${order.customer_name}
Phone: ${order.phone}
Email: ${order.email}

ORDER:
${order.items.map(i => `${i.name} - Qty: ${i.qty}`).join('\n')}

DELIVERY DETAILS
------------------
Address: ${order.address}
Suburb: ${order.suburb}
City: ${order.city}
Province: ${order.province}
Postal Code: ${order.postal_code}

Delivery Method: ${order.delivery_method}
Delivery Fee: R${order.delivery_fee.toFixed(2)}

PAYMENT
------------------
Total Paid: R${order.total.toFixed(2)}
Payment Status: PAID

Please confirm my order.`;

  return {
    success: true,
    orderNumber: order.order_number,
    total: order.total,
    whatsappNumber: process.env.WHATSAPP_NUMBER,
    whatsappUrl:
      `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`
  };
}

module.exports = router;
