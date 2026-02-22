-- Enhanced profiles table for Hommatt Health signup
-- Adds: hommat_id, phone_number, dob, age, existing_conditions

-- Drop old policies if migrating from the original profiles table
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop table if exists public.profiles;

-- Function to generate unique HM-XXXXX IDs for clinic use
create or replace function generate_hommat_id() returns text as $$
declare
  new_id text;
  id_exists boolean;
begin
  loop
    new_id := 'HM-' || lpad(floor(random() * 100000)::text, 5, '0');
    select exists(select 1 from public.profiles where hommat_id = new_id) into id_exists;
    exit when not id_exists;
  end loop;
  return new_id;
end;
$$ language plpgsql;

-- Profiles table
create table public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  hommat_id            text unique not null default generate_hommat_id(),

  -- Contact
  phone_number         text not null,

  -- Demographics
  sex                  text not null check (sex in ('male', 'female')),
  city                 text not null,
  dob                  date not null,
  age                  smallint not null check (age between 0 and 150),

  -- Health
  existing_conditions  jsonb not null default '[]'::jsonb,

  -- Metadata
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Index for fast phone number lookups
create unique index profiles_phone_number_idx on public.profiles (phone_number);

-- Index for clinic ID lookups
create index profiles_hommat_id_idx on public.profiles (hommat_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS policies: users can only access their own data
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-update updated_at on changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();
