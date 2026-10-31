-- Pepsoma: account details, address changes on orders, standing orders (docs/BACKEND-SPEC.md).
-- Run once in the Supabase SQL Editor, on top of schema.sql and seed.sql. Safe to re-run. Deletes no data.

-- ---------- access: the browser only gets what it needs ----------
-- schema.sql let the browser set any column on a new order. A chosen created_at would keep the edit window open forever.
revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;

-- ---------- orders ----------
alter table public.orders
  add column if not exists status text not null default 'placed',
  add column if not exists label_created_at timestamptz,
  add column if not exists shipped_at timestamptz,
  add column if not exists tax numeric(10, 2) not null default 0,
  add column if not exists needs_address_review boolean not null default false;  -- a person clears this before the label prints
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('placed', 'verified', 'packed', 'shipped', 'delivered'));

revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;  -- the row-level policy limits this to their own orders
grant insert (number, email, total, data) on public.orders to anon, authenticated;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  org text not null default '',
  shipping_address jsonb,
  billing_address jsonb,
  updated_at timestamptz not null default now(),
  -- only address fields fit, so nothing else (a card, say) can end up here
  constraint profiles_shipping_address_fields check (shipping_address is null or shipping_address - array['line1', 'line2', 'city', 'state', 'zip'] = '{}'::jsonb),
  constraint profiles_billing_address_fields check (billing_address is null or billing_address - array['line1', 'line2', 'city', 'state', 'zip'] = '{}'::jsonb)
);
alter table public.profiles enable row level security;
drop policy if exists "Customers read their own profile" on public.profiles;
create policy "Customers read their own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Customers update their own profile" on public.profiles;
create policy "Customers update their own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (first_name, last_name, phone, org, shipping_address, billing_address) on public.profiles to authenticated;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();

-- every account gets a profile, named from the sign-up form
create or replace function public.create_profile_for_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  full_name text := trim(coalesce(new.raw_user_meta_data ->> 'name', ''));
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, split_part(full_name, ' ', 1), trim(substr(full_name, length(split_part(full_name, ' ', 1)) + 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.create_profile_for_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users
  for each row execute function public.create_profile_for_user();
insert into public.profiles (id, first_name, last_name)
select u.id, split_part(trim(coalesce(u.raw_user_meta_data ->> 'name', '')), ' ', 1),
  trim(substr(trim(coalesce(u.raw_user_meta_data ->> 'name', '')), length(split_part(trim(coalesce(u.raw_user_meta_data ->> 'name', '')), ' ', 1)) + 1))
from auth.users u
on conflict (id) do nothing;

-- ---------- tax rates ----------
-- A state with no row is 0%, and the table starts empty: 0% is a placeholder until the accountant advises (docs/TODO.md).
-- Whether shipping or discounts count toward the taxed amount is also the accountant's call; see order_tax_for below.
create table if not exists public.tax_rates (
  state text primary key,
  rate numeric(6, 5) not null check (rate >= 0 and rate < 1),
  updated_at timestamptz not null default now()
);
alter table public.tax_rates enable row level security;
revoke all on public.tax_rates from anon, authenticated;

create or replace function public.order_tax_for(p_order public.orders, p_state text)
returns numeric language sql stable set search_path = '' as $$
  select round(
    greatest(
      coalesce((p_order.data ->> 'subtotal')::numeric, 0) - coalesce((p_order.data ->> 'tierDiscount')::numeric, 0)
        - coalesce((p_order.data ->> 'dealDiscount')::numeric, 0) - coalesce((p_order.data ->> 'promoDiscount')::numeric, 0),
      0
    ) * coalesce((select r.rate from public.tax_rates r where r.state = p_state), 0),
    2
  );
$$;
revoke execute on function public.order_tax_for(public.orders, text) from public, anon, authenticated;

-- ---------- address change history ----------
-- No customer access. The email function reads order_number and checkout_email from each new row.
create table if not exists public.order_address_edits (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  order_number text not null,
  checkout_email text not null,
  changed_by uuid references auth.users (id) on delete set null,
  old_values jsonb not null,
  new_values jsonb not null,
  old_tax numeric(10, 2) not null,
  new_tax numeric(10, 2) not null,
  created_at timestamptz not null default now()
);
create index if not exists order_address_edits_order_id on public.order_address_edits (order_id, created_at desc);
alter table public.order_address_edits enable row level security;
revoke all on public.order_address_edits from anon, authenticated;

-- ---------- what the store reads ----------
-- The order as the browser built it, with the server's time and status on top. Only the database's values count.
create or replace function public.order_json(o public.orders)
returns jsonb language sql stable set search_path = '' as $$
  select o.data || jsonb_build_object(
    'createdAt', floor(extract(epoch from o.created_at) * 1000)::bigint,
    'editUntil', floor(extract(epoch from o.created_at + interval '1 hour') * 1000)::bigint,
    'status', o.status,
    'labelCreatedAt', floor(extract(epoch from o.label_created_at) * 1000)::bigint,
    'shippedAt', floor(extract(epoch from o.shipped_at) * 1000)::bigint,
    'tax', o.tax,
    'total', o.total
  );
$$;
revoke execute on function public.order_json(public.orders) from public, anon, authenticated;

-- the signed-in customer's orders, newest first
create or replace function public.my_orders()
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(public.order_json(o) order by o.created_at desc), '[]'::jsonb)
  from public.orders o
  where o.user_id = auth.uid();
$$;
revoke execute on function public.my_orders() from public, anon;
grant execute on function public.my_orders() to authenticated;

-- Same inputs as in schema.sql; now also returns the server's time and status
create or replace function public.track_order(p_number text, p_email text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select public.order_json(o) from public.orders o
  where o.number = upper(trim(p_number)) and lower(o.email) = lower(trim(p_email))
  limit 1;
$$;
revoke execute on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;

-- ---------- change an order's shipping address ----------
-- The only way to edit an order. Signed-in owner only, until an hour after created_at, by the database's clock, with no label and
-- not shipped. Answers { ok: true, order } or { ok: false, code }, where code is not_signed_in, not_found, closed, invalid or tax_changed.
create or replace function public.update_order_address(p_number text, p_changes jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  o public.orders;
  next_name text := trim(coalesce(p_changes ->> 'name', ''));
  next_phone text := trim(coalesce(p_changes ->> 'phone', ''));
  next_org text := trim(coalesce(p_changes ->> 'org', ''));
  next_address jsonb;
  line1 text := trim(coalesce(p_changes #>> '{address,line1}', ''));
  line2 text := trim(coalesce(p_changes #>> '{address,line2}', ''));
  city text := trim(coalesce(p_changes #>> '{address,city}', ''));
  state text := upper(trim(coalesce(p_changes #>> '{address,state}', '')));
  zip text := trim(coalesce(p_changes #>> '{address,zip}', ''));
  next_tax numeric;
  old_values jsonb;
  new_values jsonb;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'code', 'not_signed_in');
  end if;

  -- someone else's order looks the same as one that doesn't exist. The lock makes a label created at this moment wait, or be seen
  select * into o from public.orders
  where number = upper(trim(p_number)) and user_id = auth.uid()
  for update;
  if not found then
    return jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  if clock_timestamp() >= o.created_at + interval '1 hour'
    or o.label_created_at is not null or o.shipped_at is not null or o.status in ('shipped', 'delivered') then
    return jsonb_build_object('ok', false, 'code', 'closed');
  end if;

  -- the store's own rules (PS.valid and PS.states in store/js/core.js)
  if next_name = '' or line1 = '' or city = ''
    or state <> all (array['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','AA','AE','AP'])
    or zip !~ '^[0-9]{5}(-[0-9]{4})?$'
    or (next_phone <> '' and length(regexp_replace(next_phone, '[^0-9]', '', 'g')) < 10)
    or length(next_name) > 200 or length(next_org) > 200 or length(next_phone) > 40
    or length(line1) > 200 or length(line2) > 200 or length(city) > 100 then
    return jsonb_build_object('ok', false, 'code', 'invalid');
  end if;

  -- no automatic charges or refunds at launch: a change that alters the tax goes to support
  next_tax := public.order_tax_for(o, state);
  if next_tax <> o.tax then
    return jsonb_build_object('ok', false, 'code', 'tax_changed', 'tax', o.tax, 'newTax', next_tax);
  end if;

  next_address := jsonb_build_object('line1', line1, 'line2', line2, 'city', city, 'state', state, 'zip', zip);
  old_values := jsonb_build_object('name', o.data -> 'name', 'phone', o.data -> 'phone', 'org', o.data -> 'org', 'address', o.data -> 'address');
  new_values := jsonb_build_object('name', next_name, 'phone', next_phone, 'org', next_org, 'address', next_address);

  insert into public.order_address_edits (order_id, order_number, checkout_email, changed_by, old_values, new_values, old_tax, new_tax)
  values (o.id, o.number, o.email, auth.uid(), old_values, new_values, o.tax, next_tax);

  update public.orders
  set data = o.data || new_values || jsonb_build_object(
        'addressEdits', coalesce(o.data -> 'addressEdits', '[]'::jsonb) || jsonb_build_array(jsonb_build_object('at', floor(extract(epoch from clock_timestamp()) * 1000)::bigint))
      ),
      needs_address_review = o.needs_address_review or (o.data #>> '{address,state}') is distinct from state
  where id = o.id
  returning * into o;

  return jsonb_build_object('ok', true, 'order', public.order_json(o));
end;
$$;
revoke execute on function public.update_order_address(text, jsonb) from public, anon;
grant execute on function public.update_order_address(text, jsonb) to authenticated;

-- ---------- standing orders ----------
-- One row per order item a customer has managed, keyed as the store keys it: order number|product id|size.
-- shipping_address null = use the order's address. Creating each shipment waits for payments and a scheduler.
create table if not exists public.standing_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  key text not null,
  plan_id text,
  start_date date,
  end_date date,
  cancelled_at timestamptz,
  shipping_address jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);
alter table public.standing_orders enable row level security;
drop policy if exists "Customers read their own standing orders" on public.standing_orders;
create policy "Customers read their own standing orders" on public.standing_orders
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Customers add standing orders on their own orders" on public.standing_orders;
create policy "Customers add standing orders on their own orders" on public.standing_orders
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.orders o where o.number = split_part(key, '|', 1) and o.user_id = (select auth.uid()))
  );
drop policy if exists "Customers update their own standing orders" on public.standing_orders;
create policy "Customers update their own standing orders" on public.standing_orders
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.standing_orders from anon, authenticated;
grant select on public.standing_orders to authenticated;
grant insert (key, plan_id, start_date, end_date, cancelled_at, shipping_address) on public.standing_orders to authenticated;
-- key too: saving is an upsert, and an upsert sets every column it was sent
grant update (key, plan_id, start_date, end_date, cancelled_at, shipping_address) on public.standing_orders to authenticated;
drop trigger if exists standing_orders_touch_updated_at on public.standing_orders;
create trigger standing_orders_touch_updated_at before update on public.standing_orders
  for each row execute function public.touch_updated_at();
