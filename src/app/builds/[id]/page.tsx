import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BuildDetail from '@/components/builds/BuildDetail';
import type { BuildWithDetails } from '@/lib/types/builds';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: build } = await supabase
    .from('builds')
    .select('title, class, description, is_public')
    .eq('id', id)
    .single();

  if (!build || !build.is_public) {
    return { title: 'Build Not Found' };
  }

  const className = build.class.charAt(0).toUpperCase() + build.class.slice(1);
  const desc = build.description
    ? build.description.slice(0, 160)
    : `A ${className} build for Diablo 4 Season 13.`;

  return {
    title: `${build.title} (${className})`,
    description: desc,
    openGraph: {
      title: `${build.title} — ${className} Build`,
      description: desc,
    },
  };
}

export default async function BuildPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user (may be null)
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch build
  const { data: build, error } = await supabase
    .from('builds')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !build) {
    notFound();
  }

  // Check visibility: private builds only visible to owner
  if (!build.is_public && build.user_id !== user?.id) {
    notFound();
  }

  // Fetch skills, gear, author, and vote status in parallel
  const [skillsResult, gearResult, authorResult, voteResult] = await Promise.all([
    supabase
      .from('build_skills')
      .select('*')
      .eq('build_id', id)
      .order('slot', { ascending: true, nullsFirst: false }),
    supabase
      .from('build_gear')
      .select('*')
      .eq('build_id', id),
    supabase
      .from('profiles')
      .select('display_name, battletag')
      .eq('id', build.user_id)
      .single(),
    user
      ? supabase
          .from('build_votes')
          .select('build_id')
          .eq('build_id', id)
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const buildWithDetails: BuildWithDetails = {
    ...build,
    skills: skillsResult.data ?? [],
    gear: gearResult.data ?? [],
    author: authorResult.data ?? undefined,
  };

  const isOwner = user?.id === build.user_id;
  const hasVoted = !!voteResult.data;

  return (
    <BuildDetail
      build={buildWithDetails}
      isOwner={isOwner}
      userId={user?.id ?? null}
      hasVoted={hasVoted}
    />
  );
}
