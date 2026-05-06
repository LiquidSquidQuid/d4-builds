'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CharacterFormState } from '@/lib/types/characters';
import { PROGRESSION_KEYS } from '@/lib/constants/progression';

export function useCharacters() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const createCharacter = useCallback(async (state: CharacterFormState): Promise<string> => {
    if (!state.class) throw new Error('Class is required');
    if (!state.name.trim()) throw new Error('Name is required');
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Insert character
      const { data: character, error: charErr } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          class: state.class,
          name: state.name.trim(),
          level: state.level,
          paragon: state.paragon,
          season: state.season || null,
          active_build: state.active_build,
        })
        .select('id')
        .single();

      if (charErr || !character) throw new Error(charErr?.message ?? 'Failed to create character');

      // Initialize all progression steps as uncompleted
      const { error: stepsErr } = await supabase
        .from('progression_steps')
        .insert(PROGRESSION_KEYS.map(step => ({
          character_id: character.id,
          step_key: step.key,
          completed: false,
        })));

      if (stepsErr) {
        await supabase.from('characters').delete().eq('id', character.id);
        throw new Error(stepsErr.message);
      }

      return character.id;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const updateCharacter = useCallback(async (id: string, updates: Partial<CharacterFormState>): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const updateData: Record<string, unknown> = {};
      if (updates.name !== undefined) updateData.name = updates.name.trim();
      if (updates.level !== undefined) updateData.level = updates.level;
      if (updates.paragon !== undefined) updateData.paragon = updates.paragon;
      if (updates.season !== undefined) updateData.season = updates.season || null;
      if (updates.active_build !== undefined) updateData.active_build = updates.active_build;

      const { error: err } = await supabase
        .from('characters')
        .update(updateData)
        .eq('id', id);

      if (err) throw new Error(err.message);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const deleteCharacter = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error: err } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (err) throw new Error(err.message);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const toggleStep = useCallback(async (
    characterId: string,
    stepKey: string,
    completed: boolean
  ): Promise<void> => {
    setError(null);

    try {
      const { error: err } = await supabase
        .from('progression_steps')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('character_id', characterId)
        .eq('step_key', stepKey);

      if (err) throw new Error(err.message);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    }
  }, [supabase]);

  return { createCharacter, updateCharacter, deleteCharacter, toggleStep, loading, error };
}
