'use client';

import { useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { D4Class } from '@/lib/types/classes';
import type { BuildFormState, BuildAction, BuildSkillInput, BuildGearInput } from '@/lib/types/builds';
import { classData } from '@/lib/constants/classes';
import { GEAR_SLOTS } from '@/lib/constants/gear-slots';
import { useBuilds } from '@/lib/hooks/useBuilds';
import SkillPicker from './SkillPicker';
import GearSlotEditor from './GearSlotEditor';

const CLASS_OPTIONS = Object.values(classData).map(c => ({
  slug: c.meta.slug,
  name: c.meta.name,
}));

const EMPTY_SKILL: BuildSkillInput = {
  skill_name: '',
  points: 1,
  slot: null,
  is_passive: false,
  notes: '',
};

function emptyGear(): Record<string, BuildGearInput> {
  return Object.fromEntries(
    GEAR_SLOTS.map(slot => [slot, { slot, item_name: '', is_unique: false, affixes: [], notes: '' }])
  );
}

const INITIAL_STATE: BuildFormState = {
  class: '',
  title: '',
  description: '',
  tags: [],
  is_public: false,
  season: 13,
  skills: Array.from({ length: 6 }, () => ({ ...EMPTY_SKILL })),
  gear: emptyGear(),
};

function buildReducer(state: BuildFormState, action: BuildAction): BuildFormState {
  switch (action.type) {
    case 'SET_CLASS':
      return {
        ...state,
        class: action.payload,
        skills: Array.from({ length: 6 }, () => ({ ...EMPTY_SKILL })),
      };
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_SEASON':
      return { ...state, season: action.value };
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    case 'SET_SKILL': {
      const skills = [...state.skills];
      skills[action.index] = action.payload;
      return { ...state, skills };
    }
    case 'REMOVE_SKILL':
      return { ...state, skills: state.skills.filter((_, i) => i !== action.index) };
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, { ...EMPTY_SKILL }] };
    case 'SET_GEAR':
      return { ...state, gear: { ...state.gear, [action.slot]: action.payload } };
    case 'CLEAR_GEAR':
      return {
        ...state,
        gear: {
          ...state.gear,
          [action.slot]: { slot: action.slot, item_name: '', is_unique: false, affixes: [], notes: '' },
        },
      };
    case 'INIT':
      return action.payload;
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

interface BuildEditorProps {
  mode: 'create' | 'edit';
  buildId?: string;
  initialData?: BuildFormState;
}

export default function BuildEditor({ mode, buildId, initialData }: BuildEditorProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(buildReducer, initialData ?? INITIAL_STATE);
  const { createBuild, updateBuild, loading, error } = useBuilds();
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.class || !state.title.trim()) return;

    try {
      if (mode === 'create') {
        const id = await createBuild(state);
        router.push(`/builds/${id}`);
      } else if (buildId) {
        await updateBuild(buildId, state);
        router.push(`/builds/${buildId}`);
      }
    } catch {
      // error is set by the hook
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !state.tags.includes(trimmed)) {
      dispatch({ type: 'SET_TAGS', payload: [...state.tags, trimmed] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    dispatch({ type: 'SET_TAGS', payload: state.tags.filter(t => t !== tag) });
  };

  return (
    <div className="build-editor">
      <div className="container">
        <h1 className="build-editor-title">
          {mode === 'create' ? 'Create Build' : 'Edit Build'}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Class selector */}
          <div className="build-editor-field">
            <label className="build-editor-label">Class</label>
            <select
              value={state.class}
              onChange={(e) => dispatch({ type: 'SET_CLASS', payload: e.target.value as D4Class })}
              className="build-editor-select"
              required
              disabled={mode === 'edit'}
            >
              <option value="">Select a class...</option>
              {CLASS_OPTIONS.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="build-editor-field">
            <label className="build-editor-label">Build Title</label>
            <input
              type="text"
              value={state.title}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })}
              placeholder="e.g., Whirlwind Dust Devil"
              className="build-editor-input"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="build-editor-field">
            <label className="build-editor-label">Description</label>
            <textarea
              value={state.description}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
              placeholder="Describe the build, playstyle, and key mechanics..."
              className="build-editor-textarea"
              rows={4}
            />
          </div>

          {/* Season + Visibility row */}
          <div className="build-editor-row">
            <div className="build-editor-field build-editor-field-sm">
              <label className="build-editor-label">Season</label>
              <input
                type="number"
                value={state.season}
                onChange={(e) => dispatch({ type: 'SET_SEASON', value: parseInt(e.target.value) || 13 })}
                className="build-editor-input"
                min={1}
              />
            </div>

            <div className="build-editor-field build-editor-field-sm">
              <label className="build-editor-label">Visibility</label>
              <label className="build-editor-toggle">
                <input
                  type="checkbox"
                  checked={state.is_public}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'is_public', value: e.target.checked })}
                />
                <span className="build-editor-toggle-track">
                  <span className="build-editor-toggle-thumb" />
                </span>
                <span className="build-editor-toggle-label">
                  {state.is_public ? 'Public' : 'Private'}
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="build-editor-field">
            <label className="build-editor-label">Tags</label>
            <div className="build-editor-tags">
              {state.tags.map(tag => (
                <span key={tag} className="build-editor-tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="build-editor-tag-remove">
                    &times;
                  </button>
                </span>
              ))}
              <div className="build-editor-tag-input-wrap">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Add tag..."
                  className="build-editor-input build-editor-tag-input"
                />
                <button type="button" onClick={addTag} className="build-editor-tag-add">+</button>
              </div>
            </div>
          </div>

          {/* Skills */}
          {state.class && (
            <SkillPicker
              classSlug={state.class}
              skills={state.skills}
              dispatch={dispatch}
            />
          )}

          {/* Gear */}
          {state.class && (
            <div className="build-editor-gear">
              <h3 className="build-editor-section-title">Gear</h3>
              <div className="gear-editor-grid">
                {GEAR_SLOTS.map(slot => (
                  <GearSlotEditor
                    key={slot}
                    slot={slot}
                    gear={state.gear[slot]}
                    dispatch={dispatch}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="build-editor-error">{error}</div>
          )}

          {/* Submit */}
          <div className="build-editor-actions">
            <button
              type="submit"
              className="build-editor-submit"
              disabled={loading || !state.class || !state.title.trim()}
            >
              {loading
                ? 'Saving...'
                : mode === 'create' ? 'Create Build' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="build-editor-cancel"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
