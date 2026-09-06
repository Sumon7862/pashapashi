-- পাশাপাশি — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'grocery',
  price numeric not null,
  old_price numeric,
  weight text,
  description text,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_phone text not null,
  buyer_address text not null,
  buyer_location text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant insert on public.orders to anon, authenticated;
grant select, update, delete on public.orders to authenticated;

drop policy if exists "Public read products" on public.products;
drop policy if exists "Admin insert products" on public.products;
drop policy if exists "Admin update products" on public.products;
drop policy if exists "Admin delete products" on public.products;
drop policy if exists "Anyone can create orders" on public.orders;
drop policy if exists "Admin read orders" on public.orders;
drop policy if exists "Admin update orders" on public.orders;
drop policy if exists "Admin delete orders" on public.orders;

create policy "Public read products"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Admin insert products"
  on public.products for insert
  to authenticated
  with check (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b');

create policy "Admin update products"
  on public.products for update
  to authenticated
  using (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b')
  with check (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b');

create policy "Admin delete products"
  on public.products for delete
  to authenticated
  using (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b');

create policy "Anyone can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Admin read orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b');

create policy "Admin update orders"
  on public.orders for update
  to authenticated
  using (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b')
  with check (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b');

create policy "Admin delete orders"
  on public.orders for delete
  to authenticated
  using (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b');

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
drop policy if exists "Admin upload product images" on storage.objects;
drop policy if exists "Admin update product images" on storage.objects;
drop policy if exists "Admin delete product images" on storage.objects;

create policy "Public read product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Admin upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b'
  );

create policy "Admin update product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b'
  );

create policy "Admin delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b'
  );

insert into public.products (title, category, price, old_price, weight, description, images)
select
  'অর্গানিক হানি',
  'grocery',
  600,
  700,
  '৫০০ গ্রাম',
  'স্থানীয় খামার থেকে সংগ্রহ করা বিশুদ্ধ, কাঁচা ও প্রাকৃতিক মধু।',
  array[
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71'
  ]
where not exists (
  select 1 from public.products where title = 'অর্গানিক হানি'
);

create table if not exists public.visitor_sessions (
  visitor_key text primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create index if not exists visitor_sessions_last_seen_idx
  on public.visitor_sessions (last_seen);

alter table public.visitor_sessions enable row level security;

create or replace function public.touch_visitor(p_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_key is null or length(p_key) < 8 or length(p_key) > 80 then
    return;
  end if;

  insert into public.visitor_sessions (visitor_key, last_seen)
  values (p_key, now())
  on conflict (visitor_key)
  do update set last_seen = now();
end;
$$;

create or replace function public.site_stats()
returns json
language sql
security definer
set search_path = public
stable
as $$
  select json_build_object(
    'orders', (select count(*)::int from public.orders),
    'visitors', (select count(*)::int from public.visitor_sessions),
    'online', (
      select count(*)::int
      from public.visitor_sessions
      where last_seen > now() - interval '2 minutes'
    )
  );
$$;

grant execute on function public.touch_visitor(text) to anon, authenticated;
grant execute on function public.site_stats() to anon, authenticated;
