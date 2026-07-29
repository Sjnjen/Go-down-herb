const { createClient } = require('@supabase/supabase-js');

// The "service key" (not the public anon key) is used here because this
// code runs ONLY on your server, never in the browser. It has full
// permission to read/write the orders table, which is exactly why it
// must never be exposed to the frontend.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Generates an order number like GDH-583927
function generateOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `GDH-${random}`;
}

async function createPendingOrder({ orderNumber, customer, items, deliveryMethod, deliveryFee, subtotal, total, paystackReference }) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      province: customer.province,
      delivery_method: deliveryMethod,
      delivery_fee: deliveryFee,
      items: items,          // stored as JSON: [{name, qty, price}, ...]
      subtotal: subtotal,
      total: total,
      payment_status: 'pending',
      order_status: 'pending',
      paystack_reference: paystackReference,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function markOrderPaid(paystackReference) {
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: 'paid', paid_at: new Date().toISOString() })
    .eq('paystack_reference', paystackReference)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getOrderByReference(paystackReference) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('paystack_reference', paystackReference)
    .single();

  if (error) throw error;
  return data;
}

async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function markOrderCompleted(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: 'completed' })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  generateOrderNumber,
  createPendingOrder,
  markOrderPaid,
  getOrderByReference,
  getAllOrders,
  markOrderCompleted
};

