-- Run this in the Supabase SQL editor.

-- =====================================================================
-- 1) Events (memory board)
-- =====================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "events read all" on public.events;
create policy "events read all" on public.events for select using (true);

drop policy if exists "events insert all" on public.events;
create policy "events insert all" on public.events for insert with check (true);

drop policy if exists "events update all" on public.events;
create policy "events update all" on public.events for update using (true) with check (true);

drop policy if exists "events delete all" on public.events;
create policy "events delete all" on public.events for delete using (true);

-- =====================================================================
-- 2) Love letters
-- =====================================================================
create table if not exists public.love_letters (
  id uuid primary key default gen_random_uuid(),
  from_name text not null,
  to_name text not null,
  title text,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.love_letters enable row level security;

drop policy if exists "letters read all" on public.love_letters;
create policy "letters read all" on public.love_letters for select using (true);

drop policy if exists "letters insert all" on public.love_letters;
create policy "letters insert all" on public.love_letters for insert with check (true);

drop policy if exists "letters update all" on public.love_letters;
create policy "letters update all" on public.love_letters for update using (true) with check (true);

drop policy if exists "letters delete all" on public.love_letters;
create policy "letters delete all" on public.love_letters for delete using (true);

-- =====================================================================
-- 3) Bucket list
-- =====================================================================
create table if not exists public.bucket_list (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  done boolean not null default false,
  done_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.bucket_list enable row level security;

drop policy if exists "bucket read all" on public.bucket_list;
create policy "bucket read all" on public.bucket_list for select using (true);

drop policy if exists "bucket insert all" on public.bucket_list;
create policy "bucket insert all" on public.bucket_list for insert with check (true);

drop policy if exists "bucket update all" on public.bucket_list;
create policy "bucket update all" on public.bucket_list for update using (true) with check (true);

drop policy if exists "bucket delete all" on public.bucket_list;
create policy "bucket delete all" on public.bucket_list for delete using (true);

-- =====================================================================
-- 4) Storage bucket for event photos
-- =====================================================================
insert into storage.buckets (id, name, public)
  values ('event-images', 'event-images', true)
  on conflict (id) do nothing;

drop policy if exists "public read event images" on storage.objects;
create policy "public read event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

drop policy if exists "anon upload event images" on storage.objects;
create policy "anon upload event images"
  on storage.objects for insert
  with check (bucket_id = 'event-images');
