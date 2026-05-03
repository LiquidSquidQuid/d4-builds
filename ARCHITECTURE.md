# D4 Builds — Project Architecture

> Reference doc for Claude Code. Describes the target stack, file structure, component map, data model, and Supabase schema for migrating the static D4 S13 build guide into a full-stack Next.js application.

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Deployed on Vercel |
| Auth | Supabase Auth | Battle.net as custom OAuth provider (`custom:battlenet`) |
| Database | Supabase (Postgres) | RLS-enforced, all access through Supabase client |
| Styling | CSS Modules + design tokens | Migrate existing CSS custom properties from `index.html` |
| Fonts | Google Fonts | Cinzel, Cormorant Garamond, JetBrains Mono |
| Package manager | pnpm | Preferred over npm/yarn |

---

## File Structure

```
d4-builds/
├── public/
│   └── fonts/                    # Self-hosted fallbacks if needed
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout: nav, footer, ember particles, progress bar
│   │   ├── page.tsx              # Landing page (migrated hero + meta snapshot)
│   │   ├── globals.css           # Design tokens, resets, texture stack, animations
│   │   ├── class/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Per-class guide (barbarian, warlock, paladin, rogue)
│   │   ├── builds/
│   │   │   ├── page.tsx          # Community build feed (public builds, search, filter)
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Build creator/editor (auth required)
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Single build view (votes, comments)
│   │   ├── profile/
│   │   │   ├── page.tsx          # Current user's profile (auth required)
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Public profile view
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts      # OAuth callback handler (exchanges code for session)
│   │   └── api/                  # API routes if needed (webhooks, etc.)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── StickyNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── EmberParticles.tsx
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── MetaSnapshot.tsx
│   │   │   ├── TierTable.tsx
│   │   │   ├── LevelingTips.tsx
│   │   │   └── EndgameChecklist.tsx
│   │   ├── class/
│   │   │   ├── ClassSection.tsx   # Reusable per-class layout
│   │   │   ├── SkillBar.tsx
│   │   │   ├── SkillTable.tsx
│   │   │   ├── GearCard.tsx
│   │   │   ├── PhaseBlock.tsx
│   │   │   └── StatPriority.tsx
│   │   ├── builds/
│   │   │   ├── BuildCard.tsx      # Card in community feed
│   │   │   ├── BuildEditor.tsx    # Create/edit form
│   │   │   ├── BuildDetail.tsx    # Full build view
│   │   │   ├── SkillPicker.tsx    # Interactive skill tree selector
│   │   │   └── GearSlotEditor.tsx # Gear slot input
│   │   ├── community/
│   │   │   ├── VoteButton.tsx
│   │   │   ├── CommentThread.tsx
│   │   │   └── CommentForm.tsx
│   │   ├── auth/
│   │   │   ├── LoginButton.tsx    # Battle.net sign-in trigger
│   │   │   ├── UserMenu.tsx       # Avatar + dropdown (profile, builds, logout)
│   │   │   └── AuthGuard.tsx      # Wrapper that redirects unauthenticated users
│   │   └── ui/
│   │       ├── GildedRule.tsx     # Decorative divider
│   │       ├── CornerBrackets.tsx # Card decoration
│   │       ├── EyebrowLabel.tsx   # Section subtitle
│   │       ├── CalloutBox.tsx
│   │       └── ScrollReveal.tsx   # IntersectionObserver wrapper
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser Supabase client (createBrowserClient)
│   │   │   ├── server.ts         # Server Supabase client (createServerClient)
│   │   │   └── middleware.ts      # Session refresh middleware
│   │   ├── hooks/
│   │   │   ├── useUser.ts
│   │   │   ├── useBuilds.ts
│   │   │   └── useVotes.ts
│   │   ├── types/
│   │   │   ├── database.ts       # Generated from Supabase (npx supabase gen types)
│   │   │   ├── builds.ts         # App-level build types
│   │   │   └── classes.ts        # Class/skill/gear enums and types
│   │   └── constants/
│   │       ├── classes.ts        # Class metadata (name, slug, color token, icon)
│   │       ├── skills.ts         # Skill trees per class (static data)
│   │       └── gear-slots.ts     # Gear slot definitions
│   └── middleware.ts             # Next.js middleware (session refresh via Supabase)
├── supabase/
│   ├── migrations/               # SQL migration files
│   └── seed.sql                  # Seed data (class definitions, sample builds)
├── ARCHITECTURE.md               # This file
├── DESIGN_GUIDE.md               # Visual design specification
├── ROADMAP.md                    # Phased implementation plan
├── OAUTH.md                      # Battle.net OAuth integration notes
├── README.md
├── next.config.ts
├── tsconfig.json
├── package.json
├── vercel.json
├── .env.local.example            # Template for required env vars
└── .gitignore
```

---

## Data Model

### Entity Relationship Overview

```
users (supabase auth.users)
  │
  ├── profiles (1:1)
  │     └── battletag, display_name, avatar_url, bio
  │
  ├── builds (1:many)
  │     ├── build_skills (1:many)
  │     ├── build_gear (1:many)
  │     ├── build_votes (many:many → users)
  │     └── comments (1:many)
  │           └── comments (self-referencing for threading)
  │
  └── characters (1:many)
        └── progression_steps (1:many)
```

### Key Design Decisions

- `auth.users` is Supabase-managed. We extend it with a `profiles` table linked by `id`.
- Builds are the core entity. A build belongs to one user and one class.
- Skills and gear are separate tables (not JSON blobs) so we can query/filter across builds ("show me all builds using Gohr's Devastating Grips").
- Votes use a junction table with a unique constraint to enforce one vote per user per build.
- Comments support single-level threading via `parent_id`.
- Characters are separate from builds — a character tracks a player's actual in-game progress, while a build is a theoretical loadout.

---

## Supabase Schema

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # Server-side only, never in client
```

### SQL Migration

```sql
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

-- ============================================================
-- VOTES
-- ============================================================
create table public.build_votes (
  build_id      uuid not null references public.builds(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now(),

  primary key (build_id, user_id)
);

alter table public.build_votes enable row level security;

create policy "Votes are readable on public builds"
  on public.build_votes for select
  using (
    exists (
      select 1 from public.builds
      where builds.id = build_votes.build_id and builds.is_public = true
    )
  );

create policy "Authenticated users can vote"
  on public.build_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove own votes"
  on public.build_votes for delete
  using (auth.uid() = user_id);

-- Keep builds.vote_count in sync
create or replace function public.update_vote_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.builds set vote_count = vote_count + 1 where id = NEW.build_id;
  elsif TG_OP = 'DELETE' then
    update public.builds set vote_count = vote_count - 1 where id = OLD.build_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_vote_change
  after insert or delete on public.build_votes
  for each row execute function public.update_vote_count();

-- ============================================================
-- COMMENTS
-- ============================================================
create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  build_id      uuid not null references public.builds(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  parent_id     uuid references public.comments(id) on delete cascade,
  content       text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint max_nesting check (parent_id is distinct from id)
);

alter table public.comments enable row level security;

create policy "Comments are readable on public builds"
  on public.comments for select
  using (
    exists (
      select 1 from public.builds
      where builds.id = comments.build_id and builds.is_public = true
    )
  );

create policy "Authenticated users can comment"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can edit own comments"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

create index idx_comments_build on public.comments(build_id, created_at);

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

-- ============================================================
-- PROGRESSION STEPS
-- ============================================================
create table public.progression_steps (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references public.characters(id) on delete cascade,
  step_key      text not null,            -- e.g. 'hit_70', 'respec', 'farm_paragon', etc.
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
create trigger set_builds_updated_at before update on public.builds
  for each row execute function public.set_updated_at();
create trigger set_comments_updated_at before update on public.comments
  for each row execute function public.set_updated_at();
create trigger set_characters_updated_at before update on public.characters
  for each row execute function public.set_updated_at();
```

---

## Component Data Flow

### Auth Flow
```
LoginButton → supabase.auth.signInWithOAuth({ provider: 'custom:battlenet' })
  → Battle.net authorize endpoint
  → /auth/callback (route.ts exchanges code for session)
  → redirect to / or previous page
  → StickyNav renders UserMenu (avatar, battletag)
```

### Build CRUD
```
BuildEditor (client component)
  → form state managed with useState/useReducer
  → SkillPicker: select skills, allocate points, assign slots
  → GearSlotEditor: per-slot item + affixes
  → on submit: supabase.from('builds').insert() + related tables
  → redirect to /builds/[id]

BuildDetail (server component with client islands)
  → fetch build + skills + gear + comments (server)
  → VoteButton (client): toggle vote via supabase RPC or insert/delete
  → CommentThread (client): real-time via supabase.channel() subscription
```

### Progression Tracking
```
Profile page → characters list
  → CharacterCard: shows level, paragon, active build link
  → ProgressionChecklist: maps step_key to endgame steps
  → checkbox toggle → supabase update progression_steps
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.2",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5"
  },
  "devDependencies": {
    "typescript": "^5",
    "supabase": "^1"
  }
}
```

Minimal deps on purpose. No UI library — the design guide mandates custom styling with the existing token system. No state management library — Supabase client + React state is sufficient at this scale.
