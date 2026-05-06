-- ============================================================
-- FIX CLASS ENUM (add missing 'sorcerer')
-- ============================================================
alter type public.d4_class add value if not exists 'sorcerer';

-- ============================================================
-- BUILDS
-- ============================================================
create table public.builds (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  class         public.d4_class not null,
  title         text not null,
  description   text,
  tags          text[] default '{}',
  is_public     boolean not null default false,
  season        smallint,
  vote_count    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.builds enable row level security;

-- Public builds visible to all; private builds visible only to owner
create policy "Public builds are readable by all"
  on public.builds for select
  using (is_public = true or auth.uid() = user_id);

create policy "Users can insert own builds"
  on public.builds for insert
  with check (auth.uid() = user_id);

create policy "Users can update own builds"
  on public.builds for update
  using (auth.uid() = user_id);

create policy "Users can delete own builds"
  on public.builds for delete
  using (auth.uid() = user_id);

create index idx_builds_class on public.builds(class);
create index idx_builds_user on public.builds(user_id);
create index idx_builds_public_votes on public.builds(is_public, vote_count desc)
  where is_public = true;

create trigger set_builds_updated_at before update on public.builds
  for each row execute function public.set_updated_at();

-- ============================================================
-- BUILD SKILLS
-- ============================================================
create table public.build_skills (
  id            uuid primary key default gen_random_uuid(),
  build_id      uuid not null references public.builds(id) on delete cascade,
  skill_name    text not null,
  points        smallint not null default 1,
  slot          smallint,               -- skill bar slot (1-6), null if passive
  is_passive    boolean not null default false,
  notes         text,

  constraint valid_points check (points between 1 and 5)
);

alter table public.build_skills enable row level security;

create policy "Build skills inherit build visibility"
  on public.build_skills for select
  using (
    exists (
      select 1 from public.builds
      where builds.id = build_skills.build_id
        and (builds.is_public = true or auth.uid() = builds.user_id)
    )
  );

create policy "Users can manage skills on own builds"
  on public.build_skills for all
  using (
    exists (
      select 1 from public.builds
      where builds.id = build_skills.build_id
        and auth.uid() = builds.user_id
    )
  );

-- ============================================================
-- BUILD GEAR
-- ============================================================
create table public.build_gear (
  id            uuid primary key default gen_random_uuid(),
  build_id      uuid not null references public.builds(id) on delete cascade,
  slot          text not null,           -- helm, chest, gloves, weapon, etc.
  item_name     text not null,
  is_unique     boolean not null default false,
  affixes       text[] default '{}',
  notes         text
);

alter table public.build_gear enable row level security;

create policy "Build gear inherits build visibility"
  on public.build_gear for select
  using (
    exists (
      select 1 from public.builds
      where builds.id = build_gear.build_id
        and (builds.is_public = true or auth.uid() = builds.user_id)
    )
  );

create policy "Users can manage gear on own builds"
  on public.build_gear for all
  using (
    exists (
      select 1 from public.builds
      where builds.id = build_gear.build_id
        and auth.uid() = builds.user_id
    )
  );
