const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function buildOwnerEmailBody(order) {
  const itemLines = order.items
    .map(i => `${i.name} x ${i.qty} - R${(i.price * i.qty).toFixed(2)}`)
    .join('\n');

  return `NEW GO DOWN HERBS ORDER

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
}

// Never throws - always resolves to { success: true } or
// { success: false, error }. Callers decide what to do with a failure
// (update email_status, log it, etc.) but a Resend outage should never
// crash the caller or block anything else from happening.
async function sendOwnerEmailForOrder(order) {
  try {
    await resend.emails.send({
      from: 'Go Down Herbs Orders <orders@godownherbs.co.za>',
      to: process.env.OWNER_EMAIL,
      subject: `New Go Down Herbs Order ${order.order_number}`,
      text: buildOwnerEmailBody(order)
    });
    return { success: true };
  } catch (err) {
    console.error(`Owner email failed for order ${order.order_number}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendOwnerEmailForOrder, buildOwnerEmailBody };
