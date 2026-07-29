-- Run this once in your Supabase project: Dashboard > SQL Editor > New Query > paste this > Run

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

-- Speeds up looking an order up by its Paystack reference during verification
create index idx_orders_paystack_reference on orders (paystack_reference);

-- Row Level Security: locked down by default. Only your backend's
-- service key (never exposed to the browser) can read/write this table.
alter table orders enable row level security;
