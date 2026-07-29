require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function test() {
  const { data, error } = await supabase
    .from('orders')
    .select('*');

  if (error) {
    console.log("❌ Connection failed:");
    console.log(error);
  } else {
    console.log("✅ Supabase connected!");
    console.log(data);
  }
}

test();
