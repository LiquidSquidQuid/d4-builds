-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  battletag     text,
  display_name  text not null default 'Nephalem',
  avatar_url    text,
  bio           text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can view profiles
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

-- Users can only update their own profile
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, battletag, display_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'battletag',
    coalesce(new.raw_user_meta_data ->> 'battletag', 'Nephalem')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- CLASS ENUM
-- ============================================================
create type public.d4_class as enum (
  'barbarian',
  'warlock',
  'paladin',
  'rogue',
  'druid',
  'necromancer',
  'spiritborn',
  'monk'
);

-- ============================================================
-- UPDATED_AT TRIGGER (reusable)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
