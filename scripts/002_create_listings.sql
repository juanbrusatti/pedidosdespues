-- Create listings table (unified: necesito / ofrezco)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('necesito', 'ofrezco')),
  title text not null,
  description text not null,
  location text not null,
  price numeric,
  price_negotiable boolean default true,
  availability text,
  category text,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.listings enable row level security;

-- Everyone can read active listings
create policy "listings_select_active" on public.listings
  for select using (status = 'active' or auth.uid() = user_id);

-- Users can insert their own listings
create policy "listings_insert_own" on public.listings
  for insert with check (auth.uid() = user_id);

-- Users can update their own listings
create policy "listings_update_own" on public.listings
  for update using (auth.uid() = user_id);

-- Users can delete their own listings
create policy "listings_delete_own" on public.listings
  for delete using (auth.uid() = user_id);

-- Index for feed queries
create index if not exists idx_listings_status_type on public.listings(status, type);
create index if not exists idx_listings_user_id on public.listings(user_id);
create index if not exists idx_listings_created_at on public.listings(created_at desc);
