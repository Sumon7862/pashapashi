-- Allow guests to place orders. Run in SQL Editor.

grant usage on schema public to anon, authenticated;
grant insert on public.orders to anon, authenticated;

drop policy if exists "Anyone can create orders" on public.orders;

create policy "Anyone can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);
