create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  province text not null,
  delivery_method text not null,
  delivery_fee numeric not null,
  items jsonb not null,
  subtotal numeric not null,
  total numeric not null,
  payment_status text not null default 'pending',   -- pending | paid
  order_status text not null default 'pending',      -- pending | completed
  paystack_reference text unique not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
