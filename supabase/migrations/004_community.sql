-- ============================================================
-- BUILD VOTES
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

create trigger set_comments_updated_at before update on public.comments
  for each row execute function public.set_updated_at();
