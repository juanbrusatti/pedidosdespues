-- Negotiations table (schema ready, UI in phase 2)
create table if not exists public.negotiations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'counter', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.negotiations enable row level security;

create policy "negotiations_select_own" on public.negotiations
  for select using (auth.uid() = requester_id or auth.uid() = provider_id);

create policy "negotiations_insert_own" on public.negotiations
  for insert with check (auth.uid() = requester_id);

create policy "negotiations_update_participant" on public.negotiations
  for update using (auth.uid() = requester_id or auth.uid() = provider_id);

-- Offers table
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid not null references public.negotiations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric not null,
  message text,
  created_at timestamptz default now()
);

alter table public.offers enable row level security;

create policy "offers_select_participant" on public.offers
  for select using (
    exists (
      select 1 from public.negotiations n
      where n.id = negotiation_id
      and (auth.uid() = n.requester_id or auth.uid() = n.provider_id)
    )
  );

create policy "offers_insert_participant" on public.offers
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.negotiations n
      where n.id = negotiation_id
      and (auth.uid() = n.requester_id or auth.uid() = n.provider_id)
    )
  );

-- Agreements table
create table if not exists public.agreements (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid not null references public.negotiations(id) on delete cascade,
  final_price numeric not null,
  confirmed_at timestamptz default now(),
  requester_fulfilled boolean default false,
  provider_fulfilled boolean default false
);

alter table public.agreements enable row level security;

create policy "agreements_select_participant" on public.agreements
  for select using (
    exists (
      select 1 from public.negotiations n
      where n.id = negotiation_id
      and (auth.uid() = n.requester_id or auth.uid() = n.provider_id)
    )
  );

create policy "agreements_update_participant" on public.agreements
  for update using (
    exists (
      select 1 from public.negotiations n
      where n.id = negotiation_id
      and (auth.uid() = n.requester_id or auth.uid() = n.provider_id)
    )
  );

-- Messages table (chat)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid not null references public.negotiations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "messages_select_participant" on public.messages
  for select using (
    exists (
      select 1 from public.negotiations n
      where n.id = negotiation_id
      and (auth.uid() = n.requester_id or auth.uid() = n.provider_id)
    )
  );

create policy "messages_insert_participant" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.negotiations n
      where n.id = negotiation_id
      and (auth.uid() = n.requester_id or auth.uid() = n.provider_id)
    )
  );

-- Indexes
create index if not exists idx_negotiations_listing on public.negotiations(listing_id);
create index if not exists idx_negotiations_participants on public.negotiations(requester_id, provider_id);
create index if not exists idx_offers_negotiation on public.offers(negotiation_id);
create index if not exists idx_messages_negotiation on public.messages(negotiation_id, created_at);
