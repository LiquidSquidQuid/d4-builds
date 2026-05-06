-- ============================================================
-- CHARACTERS (progression tracking)
-- ============================================================
create table public.characters (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  class         public.d4_class not null,
  name          text not null,
  level         smallint not null default 1,
  paragon       smallint not null default 0,
  season        smallint,
  active_build  uuid references public.builds(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint valid_level check (level between 1 and 100),
  constraint valid_paragon check (paragon >= 0)
);

alter table public.characters enable row level security;

create policy "Users can manage own characters"
  on public.characters for all
  using (auth.uid() = user_id);

create trigger set_characters_updated_at before update on public.characters
  for each row execute function public.set_updated_at();

-- ============================================================
-- PROGRESSION STEPS
-- ============================================================
create table public.progression_steps (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references public.characters(id) on delete cascade,
  step_key      text not null,
  completed     boolean not null default false,
  completed_at  timestamptz,
  notes         text,

  unique (character_id, step_key)
);

alter table public.progression_steps enable row level security;

create policy "Users can manage own progression"
  on public.progression_steps for all
  using (
    exists (
      select 1 from public.characters
      where characters.id = progression_steps.character_id
        and auth.uid() = characters.user_id
    )
  );
