'use client';

import { useState } from 'react';
import type { D4Class } from '@/lib/types/classes';
import type { CharacterFormState } from '@/lib/types/characters';
import type { Build } from '@/lib/types/builds';
import { classData } from '@/lib/constants/classes';

const CLASS_OPTIONS = Object.values(classData).map(c => ({
  slug: c.meta.slug,
  name: c.meta.name,
}));

interface CharacterFormProps {
  initialData?: CharacterFormState;
  builds: Build[];
  onSubmit: (state: CharacterFormState) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CharacterForm({ initialData, builds, onSubmit, onCancel, loading }: CharacterFormProps) {
  const [state, setState] = useState<CharacterFormState>(initialData ?? {
    class: '',
    name: '',
    level: 1,
    paragon: 0,
    season: 13,
    active_build: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.class || !state.name.trim()) return;
    await onSubmit(state);
  };

  return (
    <form className="character-form" onSubmit={handleSubmit}>
      <div className="character-form-row">
        <div className="build-editor-field">
          <label className="build-editor-label">Class</label>
          <select
            value={state.class}
            onChange={(e) => setState(s => ({ ...s, class: e.target.value as D4Class }))}
            className="build-editor-select"
            required
          >
            <option value="">Select class...</option>
            {CLASS_OPTIONS.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="build-editor-field">
          <label className="build-editor-label">Character Name</label>
          <input
            type="text"
            value={state.name}
            onChange={(e) => setState(s => ({ ...s, name: e.target.value }))}
            placeholder="Name..."
            className="build-editor-input"
            required
            maxLength={50}
          />
        </div>
      </div>

      <div className="character-form-row">
        <div className="build-editor-field build-editor-field-sm">
          <label className="build-editor-label">Level</label>
          <input
            type="number"
            value={state.level}
            onChange={(e) => setState(s => ({ ...s, level: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)) }))}
            className="build-editor-input"
            min={1}
            max={100}
          />
        </div>

        <div className="build-editor-field build-editor-field-sm">
          <label className="build-editor-label">Paragon</label>
          <input
            type="number"
            value={state.paragon}
            onChange={(e) => setState(s => ({ ...s, paragon: Math.max(0, parseInt(e.target.value) || 0) }))}
            className="build-editor-input"
            min={0}
          />
        </div>

        <div className="build-editor-field build-editor-field-sm">
          <label className="build-editor-label">Season</label>
          <input
            type="number"
            value={state.season}
            onChange={(e) => setState(s => ({ ...s, season: parseInt(e.target.value) || 13 }))}
            className="build-editor-input"
            min={1}
          />
        </div>
      </div>

      {builds.length > 0 && (
        <div className="build-editor-field">
          <label className="build-editor-label">Active Build</label>
          <select
            value={state.active_build ?? ''}
            onChange={(e) => setState(s => ({ ...s, active_build: e.target.value || null }))}
            className="build-editor-select"
          >
            <option value="">None</option>
            {builds.map(b => (
              <option key={b.id} value={b.id}>{b.title} ({b.class})</option>
            ))}
          </select>
        </div>
      )}

      <div className="character-form-actions">
        <button
          type="submit"
          className="build-editor-submit"
          disabled={loading || !state.class || !state.name.trim()}
        >
          {loading ? 'Saving...' : initialData ? 'Save' : 'Add Character'}
        </button>
        <button type="button" className="build-editor-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
