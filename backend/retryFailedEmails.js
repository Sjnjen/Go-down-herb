// jobs/retryFailedEmails.js
//
// Run on a schedule (Render Cron Job) to retry the owner notification
// email for any paid order stuck at email_status = 'failed'.
//
// Render Cron Job setup:
//   Command:  node jobs/retryFailedEmails.js
//   Schedule: */15 * * * *   (every 15 minutes)

const { createClient } = require('@supabase/supabase-js');
const { sendOwnerEmailForOrder } = require('../orderEmails');
const { updateEmailStatus, incrementEmailAttempts } = require('../db');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const MAX_ATTEMPTS = 5;

async function main() {
  const { data: failedOrders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_status', 'paid')
    .eq('email_status', 'failed')
    .lt('email_attempts', MAX_ATTEMPTS);

  if (error) {
    console.error('Retry job: failed to fetch orders', error);
    process.exit(1);
  }

  console.log(`Retry job: found ${failedOrders.length} order(s) with a failed owner email.`);

  for (const order of failedOrders) {
    const result = await sendOwnerEmailForOrder(order);

    if (result.success) {
      await updateEmailStatus(order.id, 'sent');
      console.log(`Retry succeeded for ${order.order_number}`);
    } else {
      await updateEmailStatus(order.id, 'failed', result.error);
      await incrementEmailAttempts(order.id, order.email_attempts);
      console.error(`Retry failed for ${order.order_number}: ${result.error}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Retry job crashed:', err);
    process.exit(1);
  });

