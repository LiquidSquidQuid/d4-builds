import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BuildDetail from '@/components/builds/BuildDetail';
import type { BuildWithDetails } from '@/lib/types/builds';

interface Props {
  params: Promise<{ id: string }>;
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

  // Fetch skills, gear, and author in parallel
  const [skillsResult, gearResult, authorResult] = await Promise.all([
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
  ]);

  const buildWithDetails: BuildWithDetails = {
    ...build,
    skills: skillsResult.data ?? [],
    gear: gearResult.data ?? [],
    author: authorResult.data ?? undefined,
  };

  const isOwner = user?.id === build.user_id;

  return <BuildDetail build={buildWithDetails} isOwner={isOwner} />;
}
