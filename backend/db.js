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
      suburb: customer.suburb,
      city: customer.city,
      province: customer.province,
      postal_code: customer.postalCode,
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

// Kept for backwards compatibility (nothing else needs to call this
// directly anymore — use markOrderPaidIfPending instead, from both the
// webhook and verify.js, so a payment only ever gets processed once).
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

// Idempotent version: only flips payment_status pending -> paid ONCE.
// Both the webhook and the customer's browser-driven /api/verify call
// this same function. Whichever gets there first does the update and
// gets alreadyProcessed: false (so it knows to send the owner email).
// Whichever gets there second sees the row is already 'paid' and gets
// alreadyProcessed: true — so it can skip re-sending the email.
async function markOrderPaidIfPending(paystackReference) {
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: 'paid', paid_at: new Date().toISOString() })
    .eq('paystack_reference', paystackReference)
    .eq('payment_status', 'pending') // <-- only matches if still pending
    .select()
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = "no rows found" from .single(), which just means someone
    // else already marked it paid — not a real error.
    throw error;
  }

  if (data) {
    return { order: data, alreadyProcessed: false };
  }

  // Already paid (by the other path) - fetch the current row so the
  // caller still has the order to work with.
  const existing = await getOrderByReference(paystackReference);
  return { order: existing, alreadyProcessed: true };
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

// Call after attempting the owner email, success or failure, so the
// order's email_status always reflects reality and the retry job (or
// your own eyes on /api/admin/orders) can see what's outstanding.
async function updateEmailStatus(orderId, status, errorMessage = null) {
  const update = { email_status: status };
  if (status === 'failed') {
    update.email_error = errorMessage ? String(errorMessage).slice(0, 500) : null;
  }
  if (status === 'sent') {
    update.email_error = null;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function incrementEmailAttempts(orderId, currentAttempts) {
  const { error } = await supabase
    .from('orders')
    .update({ email_attempts: (currentAttempts || 0) + 1 })
    .eq('id', orderId);

  if (error) throw error;
}

// Idempotency for the Paystack webhook itself - separate from order
// payment status, because a webhook can be redelivered for reasons
// unrelated to your order logic (network blips on Paystack's end).
// Returns true if this event_id has already been seen (caller should skip).
async function hasProcessedWebhookEvent(eventId) {
  const { error } = await supabase
    .from('processed_webhook_events')
    .insert({ event_id: eventId });

  if (!error) return false; // first time seeing this event

  if (error.code === '23505') return true; // unique violation = duplicate

  throw error;
}

module.exports = {
  generateOrderNumber,
  createPendingOrder,
  markOrderPaid,
  markOrderPaidIfPending,
  getOrderByReference,
  getAllOrders,
  markOrderCompleted,
  updateEmailStatus,
  incrementEmailAttempts,
  hasProcessedWebhookEvent
};
