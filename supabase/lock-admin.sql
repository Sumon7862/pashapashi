-- Restrict write/admin access to this Auth user only.
-- Run in SQL Editor after schema.sql.

drop policy if exists "Admin insert products" on public.products;
drop policy if exists "Admin update products" on public.products;
drop policy if exists "Admin delete products" on public.products;
drop policy if exists "Admin read orders" on public.orders;
drop policy if exists "Admin update orders" on public.orders;
drop policy if exists "Admin upload product images" on storage.objects;
drop policy if exists "Admin update product images" on storage.objects;
drop policy if exists "Admin delete product images" on storage.objects;

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

create policy "Admin read orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b');

create policy "Admin update orders"
  on public.orders for update
  to authenticated
  using (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b')
  with check (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b');

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
