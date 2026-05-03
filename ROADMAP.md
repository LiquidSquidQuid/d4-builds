# D4 Builds — Phased Roadmap

> Each phase is designed to be fed as a self-contained prompt to Claude Code. Complete one phase fully before starting the next. Every phase ends with a working, deployable state.

---

## Phase 0: Next.js Scaffold + Static Migration

**Goal:** Replace the static `index.html` with a Next.js app that renders identically. No new features — just the migration.

**Deliverables:**
- Initialize Next.js 14+ with App Router, TypeScript, pnpm
- Migrate `globals.css` from inline styles (design tokens, resets, textures, animations, all responsive rules)
- Migrate the landing page into `src/app/page.tsx` using server components
- Extract shared layout into `src/app/layout.tsx` (nav, footer, ember particles, progress bar)
- Extract components: `Hero`, `MetaSnapshot`, `TierTable`, `LevelingTips`, `EndgameChecklist`
- Extract per-class sections into `src/app/class/[slug]/page.tsx` with shared `ClassSection`, `SkillBar`, `SkillTable`, `GearCard`, `PhaseBlock`, `StatPriority` components
- Extract UI primitives: `GildedRule`, `CornerBrackets`, `EyebrowLabel`, `CalloutBox`, `ScrollReveal`
- Client components only where needed (scroll observer, ember particles, progress bar, nav scroll behavior)
- Move class-specific data (skill allocations, gear lists, phase breakdowns) into `src/lib/constants/`
- Update `vercel.json` for Next.js (remove `cleanUrls`, keep security headers in `next.config.ts`)
- Verify: site renders identically to the static version, all animations work, responsive breakpoints intact

**Claude Code prompt pattern:**
```
Read ARCHITECTURE.md and DESIGN_GUIDE.md. Initialize a Next.js 14 App Router project 
with TypeScript and pnpm. Migrate the existing index.html into the Next.js structure 
following the file layout in ARCHITECTURE.md. The visual output must be pixel-identical 
to the current static site. Extract components as specified. Keep client components 
minimal — only for scroll/animation behavior. All class data should be in constants files, 
not hardcoded in JSX.
```

**Done when:** `pnpm dev` renders the full site, all scroll reveals fire, ember particles animate, sticky nav works, class pages route correctly, Vercel preview deploy succeeds.

---

## Phase 1: Supabase + Battle.net Auth

**Goal:** Users can sign in with Battle.net and see their profile. No build features yet.

**Deliverables:**
- Install `@supabase/supabase-js` and `@supabase/ssr`
- Create Supabase client utilities (`src/lib/supabase/client.ts`, `server.ts`)
- Create Next.js middleware for session refresh (`src/middleware.ts`)
- Create `/auth/callback/route.ts` for OAuth code exchange
- Create `LoginButton` component (triggers `signInWithOAuth({ provider: 'custom:battlenet' })`)
- Create `UserMenu` component (avatar, battletag, sign out)
- Update `StickyNav` to show `LoginButton` or `UserMenu` based on session
- Create `/profile/page.tsx` — displays current user's battletag, join date, empty states for builds/characters
- Create `.env.local.example` with required Supabase env vars
- Run the Supabase migration (profiles table, trigger, RLS policies) — just the `profiles` portion from ARCHITECTURE.md

**Prerequisite (manual, before running Claude Code):**
1. Register Battle.net app at develop.battle.net
2. Create Supabase project
3. Configure `custom:battlenet` provider in Supabase dashboard (see OAUTH.md)
4. Add Supabase callback URL to Battle.net app's redirect URIs
5. Create `.env.local` with actual keys

**Claude Code prompt pattern:**
```
Read ARCHITECTURE.md, OAUTH.md, and DESIGN_GUIDE.md. Add Supabase auth to the Next.js 
app. Follow the OAuth flow in OAUTH.md exactly. Create the Supabase client utilities, 
middleware, callback route, and auth components as specified in ARCHITECTURE.md. Run only 
the profiles-related portion of the SQL migration. Style all new components following 
DESIGN_GUIDE.md (dark theme, gold accents, Cinzel headings). The LoginButton should 
match the gothic aesthetic — no default browser button styling.
```

**Done when:** Full login → callback → session → profile page flow works. Nav shows battletag when logged in. Logging out clears session. Profile page shows user data from Supabase.

---

## Phase 2: Build Creator + Saved Builds

**Goal:** Authenticated users can create, save, edit, and delete their own builds.

**Deliverables:**
- Run the Supabase migration for `builds`, `build_skills`, `build_gear` tables + RLS policies
- Create `BuildEditor` component with:
  - Class selector
  - Title and description fields
  - `SkillPicker` — select skills from the class's skill tree, allocate points (1-5), assign to bar slots
  - `GearSlotEditor` — per-slot item name, unique toggle, affixes list, notes
  - Public/private toggle
  - Season field (auto-populated, editable)
  - Tags input
- Create `/builds/new/page.tsx` wrapped in `AuthGuard`
- Create `/builds/[id]/page.tsx` — read-only view of a build (server component)
- Create `BuildCard` component for listing builds
- Add "My Builds" section to `/profile/page.tsx` — list user's builds with edit/delete actions
- Edit flow: `/builds/[id]/edit` or modal — reuses `BuildEditor` in edit mode
- Delete: confirmation dialog, cascading delete handled by DB foreign keys
- Create `useBuilds` hook for client-side CRUD operations

**Claude Code prompt pattern:**
```
Read ARCHITECTURE.md. Add build CRUD to the app. Run the builds, build_skills, and 
build_gear migrations from ARCHITECTURE.md. Create the BuildEditor with SkillPicker 
and GearSlotEditor. Skill data comes from src/lib/constants/skills.ts — create this 
file with the skill trees for all four S13 classes (barbarian, warlock, paladin, rogue) 
based on the data already in the class pages. The BuildEditor must be a client component; 
BuildDetail can be a server component. Follow DESIGN_GUIDE.md for styling — gear cards 
should use the existing GearCard pattern, skill bars should match SkillBar. Wire up RLS 
so users can only edit/delete their own builds.
```

**Done when:** User can create a build with skills + gear, see it on their profile, edit it, delete it. Builds marked public are visible at `/builds/[id]` when not logged in. Private builds return 404 for other users.

---

## Phase 3: Progression Tracking

**Goal:** Users can track their in-game characters and endgame progression.

**Deliverables:**
- Run the Supabase migration for `characters` and `progression_steps` tables + RLS
- Create character management on profile page:
  - Add character form (class, name, level, paragon, season)
  - Character list with edit/delete
  - Link a character to an existing build (`active_build` FK)
- Create `ProgressionChecklist` component:
  - Maps the 8 endgame steps from the static site to `step_key` values
  - Checkbox toggle updates `progression_steps` in Supabase
  - Shows `completed_at` timestamp
  - Optional notes per step
- Update profile page layout: characters section with expandable progression checklists
- Level and paragon editing inline on character cards

**Claude Code prompt pattern:**
```
Read ARCHITECTURE.md. Add character and progression tracking. Run the characters and 
progression_steps migrations. Create character CRUD on the profile page and a 
ProgressionChecklist component that maps the 8 endgame steps (hit_70, respec, 
farm_paragon, talisman, horadric_cube, masterworking, push_torment, war_plans) 
to toggleable checkboxes with timestamps. Each character card should show class icon, 
name, level/paragon, and link to their active build if set. Style per DESIGN_GUIDE.md.
```

**Done when:** User can add characters, track levels, check off endgame steps, and link characters to builds. All data persists in Supabase with proper RLS.

---

## Phase 4: Community Features

**Goal:** Players can share builds publicly, vote on builds, and comment.

**Deliverables:**
- Run the Supabase migration for `build_votes` and `comments` tables + RLS + vote count trigger
- Create `/builds/page.tsx` — community build feed:
  - Filter by class, sort by votes/date
  - Search by title/tags
  - Paginated (cursor-based or offset)
  - Each build rendered as `BuildCard` with vote count, author battletag, class badge
- Create `VoteButton` component:
  - Toggle vote (insert/delete from `build_votes`)
  - Optimistic UI update
  - Requires auth — show login prompt if not authenticated
- Create `CommentThread` component on `/builds/[id]`:
  - Threaded comments (one level deep via `parent_id`)
  - Real-time updates via Supabase Realtime channel subscription
  - `CommentForm` with auth guard
  - Edit/delete own comments
- Create `/profile/[id]/page.tsx` — public profile showing user's public builds and stats
- Add build count and total votes received to profile pages

**Claude Code prompt pattern:**
```
Read ARCHITECTURE.md. Add community features: voting, comments, public build feed. 
Run the build_votes and comments migrations including the vote_count sync trigger. 
Create the /builds feed page with class filtering, vote sorting, and pagination. 
VoteButton should use optimistic updates. CommentThread should subscribe to Supabase 
Realtime for live updates. Public profiles at /profile/[id] show a user's public builds. 
Style everything per DESIGN_GUIDE.md — vote buttons should use ember orange for the 
active state, comments should use the callout box pattern.
```

**Done when:** Users can browse public builds, vote (once per build), comment with threading, view other players' public profiles. Vote counts update in real time. Unauthenticated users can browse but see login prompts when trying to interact.

---

## Phase 5: Polish + Production Hardening

**Goal:** Production-ready quality. Performance, SEO, error handling, edge cases.

**Deliverables:**
- SEO: metadata on all pages (title, description, Open Graph tags for build sharing)
- Error boundaries: custom error.tsx and not-found.tsx pages styled to match the gothic theme
- Loading states: skeleton components for builds, profiles, comments
- Rate limiting: consider Edge Middleware or Supabase RLS-based throttling for votes/comments
- Image optimization: if adding class icons or gear images, use Next.js `<Image>` component
- Accessibility audit: keyboard navigation, ARIA labels, reduced motion support (already partially in DESIGN_GUIDE.md)
- Analytics: Vercel Analytics or Plausible (privacy-friendly)
- Mobile: verify all new pages work at 640px breakpoint and below
- Performance: check Core Web Vitals, lazy load below-fold components
- Security review: verify RLS policies cover all edge cases, no exposed service role key, CSRF protection on mutations

**Claude Code prompt pattern:**
```
Read ARCHITECTURE.md and DESIGN_GUIDE.md. Production-harden the app. Add metadata/OG 
tags to all pages. Create custom error.tsx and not-found.tsx with gothic styling. Add 
skeleton loading states for BuildCard, BuildDetail, CommentThread, and profile sections. 
Audit accessibility — ensure all interactive elements are keyboard-navigable and have 
ARIA labels. Verify reduced-motion media queries disable all animations. Run a security 
review of all RLS policies. Add Vercel Analytics.
```

**Done when:** Lighthouse scores green on performance/accessibility/SEO. Error states are handled gracefully. Sharing a build URL on Discord/Twitter shows a rich preview. Mobile layout works for all new pages.

---

## Phase Summary

| Phase | Focus | Key Tables | Auth Required |
|---|---|---|---|
| 0 | Next.js migration | None | No |
| 1 | Battle.net auth | profiles | Setup |
| 2 | Build CRUD | builds, build_skills, build_gear | Yes |
| 3 | Progression | characters, progression_steps | Yes |
| 4 | Community | build_votes, comments | Partial |
| 5 | Polish | None (refinement) | N/A |

Each phase builds on the previous. Do not skip phases or combine them — each produces a deployable, testable state.
