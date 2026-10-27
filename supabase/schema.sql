-- Pepsoma: catalog, orders and row-level security.
-- Run once in the Supabase dashboard (SQL Editor), then run seed.sql. Safe to re-run.
-- Accounts are Supabase Auth's own auth.users; the customer's name is in its user_metadata.

-- ---------- catalog ----------
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  sizes jsonb not null,                          -- [{ id, label, price, compare? }]
  cards_allowed boolean not null default true,   -- false: checkout has to offer a non-card payment (Retatrutide)
  active boolean not null default true,          -- false hides it from the store without deleting it
  sort integer not null default 0,
  details jsonb not null default '{}'::jsonb,    -- the rest of the product page fields from store/js/data.js
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
drop policy if exists "Anyone reads the active catalog" on public.products;
create policy "Anyone reads the active catalog" on public.products
  for select to anon, authenticated using (active);
-- no insert/update/delete policies: the catalog is edited in the dashboard (or with the service key), never from the store
revoke insert, update, delete on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;

-- ---------- orders ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  user_id uuid references auth.users (id) on delete set null default auth.uid(),  -- null for guest checkout
  email text not null,
  total numeric(10, 2) not null,
  data jsonb not null,                           -- the order as the store built it (items, address, totals)
  created_at timestamptz not null default now()
);
create index if not exists orders_user_id_created_at on public.orders (user_id, created_at desc);
alter table public.orders enable row level security;
drop policy if exists "Customers read their own orders" on public.orders;
create policy "Customers read their own orders" on public.orders
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Customers place orders as themselves" on public.orders;
create policy "Customers place orders as themselves" on public.orders
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Guests place orders without an account" on public.orders;
create policy "Guests place orders without an account" on public.orders
  for insert to anon with check (user_id is null);
-- no update/delete policies: customers can't change an order after placing it
revoke update, delete on public.orders from anon, authenticated;
grant select, insert on public.orders to anon, authenticated;

-- Track order (number + checkout email), for guests too. Returns that one order or null, never a list.
create or replace function public.track_order(p_number text, p_email text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select o.data from public.orders o
  where o.number = upper(trim(p_number)) and lower(o.email) = lower(trim(p_email))
  limit 1;
$$;
revoke execute on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;
