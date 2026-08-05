const { Resend } = require("resend");

const resend = new Resend(process.env.re_faQmBYKc_3KoBsQCjURSqyPYstLiCbhRc);

async function sendOrderEmail(order) {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "tshibubudzep@gmail.com",

      subject: `New Go Down Herbs Order #${order.orderNumber}`,

      html: `
        <h1>New Order Received - Go Down Herbs</h1>

        <h2>Order Details</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>

        <h2>Customer Details</h2>
        <p><strong>Name:</strong> ${order.customer.name}</p>
        <p><strong>Phone:</strong> ${order.customer.phone}</p>
        <p><strong>Email:</strong> ${order.customer.email}</p>
        <p><strong>Address:</strong> ${order.customer.address}</p>
        <p><strong>Suburb:</strong> ${order.customer.suburb}</p>
        <p><strong>City:</strong> ${order.customer.city}</p>
        <p><strong>Province:</strong> ${order.customer.province}</p>
        <p><strong>Postal Code:</strong> ${order.customer.postalCode}</p>

        <h2>Items Ordered</h2>
        <ul>
          ${
            order.items
              .map(
                (item) =>
                  `<li>${item.name} - Quantity: ${item.qty} - R${item.price}</li>`
              )
              .join("")
          }
        </ul>

        <h2>Payment Details</h2>
        <p><strong>Subtotal:</strong> R${order.subtotal}</p>
        <p><strong>Delivery Fee:</strong> R${order.deliveryFee}</p>
        <p><strong>Total:</strong> R${order.total}</p>

        <p>Payment has been successfully completed.</p>
      `,
    });

    console.log("Order email sent:", result);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}

module.exports = sendOrderEmail;
