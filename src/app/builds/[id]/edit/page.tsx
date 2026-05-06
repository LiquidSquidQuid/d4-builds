import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BuildEditor from '@/components/builds/BuildEditor';
import { GEAR_SLOTS } from '@/lib/constants/gear-slots';
import type { BuildFormState, BuildGearInput } from '@/lib/types/builds';
import type { D4Class } from '@/lib/types/classes';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Build — D4 Builds',
};

export default async function EditBuildPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  // Fetch build
  const { data: build, error } = await supabase
    .from('builds')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !build) notFound();

  // Ownership check
  if (build.user_id !== user.id) {
    redirect(`/builds/${id}`);
  }

  // Fetch skills and gear
  const [skillsResult, gearResult] = await Promise.all([
    supabase.from('build_skills').select('*').eq('build_id', id).order('slot'),
    supabase.from('build_gear').select('*').eq('build_id', id),
  ]);

  // Build gear record keyed by slot, with empty defaults for all slots
  const gearRecord: Record<string, BuildGearInput> = Object.fromEntries(
    GEAR_SLOTS.map(slot => [slot, { slot, item_name: '', is_unique: false, affixes: [], notes: '' }])
  );
  for (const g of gearResult.data ?? []) {
    gearRecord[g.slot] = {
      slot: g.slot,
      item_name: g.item_name,
      is_unique: g.is_unique,
      affixes: g.affixes ?? [],
      notes: g.notes ?? '',
    };
  }

  const initialData: BuildFormState = {
    class: build.class as D4Class,
    title: build.title,
    description: build.description ?? '',
    tags: build.tags ?? [],
    is_public: build.is_public,
    season: build.season ?? 13,
    skills: (skillsResult.data ?? []).map(s => ({
      skill_name: s.skill_name,
      points: s.points,
      slot: s.slot,
      is_passive: s.is_passive,
      notes: s.notes ?? '',
    })),
    gear: gearRecord,
  };

  // Ensure at least 6 skill slots
  while (initialData.skills.length < 6) {
    initialData.skills.push({
      skill_name: '',
      points: 1,
      slot: null,
      is_passive: false,
      notes: '',
    });
  }

  return <BuildEditor mode="edit" buildId={id} initialData={initialData} />;
}
