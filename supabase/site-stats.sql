-- Public shop stats for the footer. Run in SQL Editor.

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
