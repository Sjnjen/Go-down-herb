const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const { markOrderPaid, getOrderByReference } = require('../db');

const resend = new Resend(process.env.RESEND_API_KEY);

// GET /api/verify?reference=GDH-583927
router.get('/verify', async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) return res.status(400).json({ error: 'Missing reference.' });

    const order = await getOrderByReference(reference);
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

    const updatedOrder = await markOrderPaid(reference);

    await sendOwnerEmail(updatedOrder);

    res.json(buildResponse(updatedOrder));

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


async function sendOwnerEmail(order) {

  const itemLines = order.items
    .map(i => `${i.name} x ${i.qty} - R${(i.price * i.qty).toFixed(2)}`)
    .join('\n');


  const body =
`NEW GO DOWN HERBS ORDER

ORDER NUMBER:
${order.order_number}


CUSTOMER DETAILS
------------------
Name: ${order.customer_name}
Phone: ${order.phone}
Email: ${order.email}


DELIVERY DETAILS
------------------
Address: ${order.address}
Suburb: ${order.suburb}
City: ${order.city}
Province: ${order.province}
Postal Code: ${order.postal_code}


ORDER:
${itemLines}


DELIVERY METHOD:
${order.delivery_method}

Delivery Fee:
R${order.delivery_fee.toFixed(2)}


TOTAL:
R${order.total.toFixed(2)}


Payment Status:
PAID
`;

  await resend.emails.send({
    from: 'Go Down Herbs Orders <orders@godownherbs.co.za>',
    to: process.env.OWNER_EMAIL,
    subject: `New Go Down Herbs Order ${order.order_number}`,
    text: body
  });
}


module.exports = router;
