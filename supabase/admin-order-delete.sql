-- Allow the admin to delete orders. Run in SQL Editor.

grant delete on public.orders to authenticated;

drop policy if exists "Admin delete orders" on public.orders;

create policy "Admin delete orders"
  on public.orders for delete
  to authenticated
  using (auth.uid() = '464542a7-92b0-42d0-895f-3effaf3a9c2b');
