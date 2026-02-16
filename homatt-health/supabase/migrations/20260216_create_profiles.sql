-- Profiles table: stores user onboarding data (Phase 1 signup)
create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,

  -- Step 1: Location
  city                text not null,

  -- Step 2: Basic Info
  sex                 text not null check (sex in ('male', 'female')),
  age                 smallint not null check (age between 1 and 150),
  marital_status      text not null check (marital_status in ('single', 'married', 'divorced', 'widowed', 'other')),

  -- Step 3: Family
  has_family          boolean not null default false,

  -- Metadata
  onboarding_completed boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- RLS: every table must have row level security
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
