-- Run this in the Supabase SQL editor.

-- 1) Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

-- 2) Row Level Security: open for this personal project.
-- If you want it locked down, add auth and swap these policies.
alter table public.events enable row level security;

drop policy if exists "events read all" on public.events;
create policy "events read all"
  on public.events for select
  using (true);

drop policy if exists "events insert all" on public.events;
create policy "events insert all"
  on public.events for insert
  with check (true);

drop policy if exists "events update all" on public.events;
create policy "events update all"
  on public.events for update
  using (true)
  with check (true);

drop policy if exists "events delete all" on public.events;
create policy "events delete all"
  on public.events for delete
  using (true);

-- 3) Storage bucket for uploaded photos.
-- Create in the Storage UI with name `event-images` and make it PUBLIC,
-- or run:
insert into storage.buckets (id, name, public)
  values ('event-images', 'event-images', true)
  on conflict (id) do nothing;

-- Allow public read + anon uploads to that bucket
drop policy if exists "public read event images" on storage.objects;
create policy "public read event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

drop policy if exists "anon upload event images" on storage.objects;
create policy "anon upload event images"
  on storage.objects for insert
  with check (bucket_id = 'event-images');
