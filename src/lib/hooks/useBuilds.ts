'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BuildFormState } from '@/lib/types/builds';

export function useBuilds() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const createBuild = useCallback(async (state: BuildFormState): Promise<string> => {
    if (!state.class) throw new Error('Class is required');
    setLoading(true);
    setError(null);

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 2. Insert build
      const { data: build, error: buildErr } = await supabase
        .from('builds')
        .insert({
          user_id: user.id,
          class: state.class,
          title: state.title,
          description: state.description || null,
          tags: state.tags,
          is_public: state.is_public,
          season: state.season || null,
        })
        .select('id')
        .single();

      if (buildErr || !build) throw new Error(buildErr?.message ?? 'Failed to create build');

      // 3. Insert skills (filter out empty)
      const skills = state.skills.filter(s => s.skill_name.trim());
      if (skills.length > 0) {
        const { error: skillsErr } = await supabase
          .from('build_skills')
          .insert(skills.map(s => ({
            build_id: build.id,
            skill_name: s.skill_name,
            points: s.points,
            slot: s.slot,
            is_passive: s.is_passive,
            notes: s.notes || null,
          })));

        if (skillsErr) {
          // Rollback: delete the build
          await supabase.from('builds').delete().eq('id', build.id);
          throw new Error(skillsErr.message);
        }
      }

      // 4. Insert gear (filter out empty)
      const gearEntries = Object.values(state.gear).filter(g => g.item_name.trim());
      if (gearEntries.length > 0) {
        const { error: gearErr } = await supabase
          .from('build_gear')
          .insert(gearEntries.map(g => ({
            build_id: build.id,
            slot: g.slot,
            item_name: g.item_name,
            is_unique: g.is_unique,
            affixes: g.affixes,
            notes: g.notes || null,
          })));

        if (gearErr) {
          await supabase.from('builds').delete().eq('id', build.id);
          throw new Error(gearErr.message);
        }
      }

      return build.id;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const updateBuild = useCallback(async (id: string, state: BuildFormState): Promise<void> => {
    if (!state.class) throw new Error('Class is required');
    setLoading(true);
    setError(null);

    try {
      // 1. Update build row
      const { error: buildErr } = await supabase
        .from('builds')
        .update({
          class: state.class,
          title: state.title,
          description: state.description || null,
          tags: state.tags,
          is_public: state.is_public,
          season: state.season || null,
        })
        .eq('id', id);

      if (buildErr) throw new Error(buildErr.message);

      // 2. Delete existing skills and gear, then re-insert
      await supabase.from('build_skills').delete().eq('build_id', id);
      await supabase.from('build_gear').delete().eq('build_id', id);

      // 3. Re-insert skills
      const skills = state.skills.filter(s => s.skill_name.trim());
      if (skills.length > 0) {
        const { error: skillsErr } = await supabase
          .from('build_skills')
          .insert(skills.map(s => ({
            build_id: id,
            skill_name: s.skill_name,
            points: s.points,
            slot: s.slot,
            is_passive: s.is_passive,
            notes: s.notes || null,
          })));
        if (skillsErr) throw new Error(skillsErr.message);
      }

      // 4. Re-insert gear
      const gearEntries = Object.values(state.gear).filter(g => g.item_name.trim());
      if (gearEntries.length > 0) {
        const { error: gearErr } = await supabase
          .from('build_gear')
          .insert(gearEntries.map(g => ({
            build_id: id,
            slot: g.slot,
            item_name: g.item_name,
            is_unique: g.is_unique,
            affixes: g.affixes,
            notes: g.notes || null,
          })));
        if (gearErr) throw new Error(gearErr.message);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const deleteBuild = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error: delErr } = await supabase
        .from('builds')
        .delete()
        .eq('id', id);

      if (delErr) throw new Error(delErr.message);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return { createBuild, updateBuild, deleteBuild, loading, error };
}
