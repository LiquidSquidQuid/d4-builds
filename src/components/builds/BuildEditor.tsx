'use client';

import { useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { D4Class } from '@/lib/types/classes';
import type { BuildFormState, BuildAction, BuildSkillInput, BuildGearInput } from '@/lib/types/builds';
import { classData } from '@/lib/constants/classes';
import { GEAR_SLOTS } from '@/lib/constants/gear-slots';
import { useBuilds } from '@/lib/hooks/useBuilds';
import { useCalcEngine } from '@/lib/hooks/useCalcEngine';
import { useStatWeights } from '@/lib/hooks/useStatWeights';
import { useGearCompare } from '@/lib/hooks/useGearCompare';
import ManuscriptField from '@/components/ui/ManuscriptField';
import EditorActionBar from './EditorActionBar';
import EditorRotationStrip from './EditorRotationStrip';
import GearPegboard from './GearPegboard';
import Dossier from './Dossier';
import SaveBar from './SaveBar';

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
    GEAR_SLOTS.map(slot => [slot, {
      slot,
      item_name: '',
      is_unique: false,
      affixes: [],
      affix_data: [],
      weapon_data: undefined,
      notes: '',
    }])
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
          [action.slot]: {
            slot: action.slot,
            item_name: '',
            is_unique: false,
            affixes: [],
            affix_data: [],
            weapon_data: undefined,
            notes: '',
          },
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
  const [charLevel, setCharLevel] = useState(60);
  const [charMainStat, setCharMainStat] = useState(1000);

  // Calc engine hooks
  const { dpsResult, ehpResult, dpsInput, ehpInput, isCalculating } =
    useCalcEngine(state, { level: charLevel, mainStat: charMainStat });
  const { weights } =
    useStatWeights(dpsInput, ehpInput);
  useGearCompare(dpsInput, ehpInput);

  const handleSubmit = async () => {
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

  const classMeta = state.class ? classData[state.class as D4Class]?.meta : null;

  return (
    <div className="build-editor">
      <div className="desk">
        {/* ── LEFT: SCRIBE'S DESK ── */}
        <section className="desk-left">
          {/* Editor head */}
          <div className="ed-head">
            <div className="ed-head-left">
              <div className="ed-roman">II</div>
              <div className="caps-s" style={{ color: 'var(--gold-deep)', marginBottom: 8, fontSize: '.55rem' }}>
                The Workbench · {mode === 'create' ? 'Creating' : 'Editing'}
              </div>
              <h1 className="ed-title">
                {state.title || <span style={{ color: 'var(--vellum-faint)', fontStyle: 'italic' }}>Untitled build</span>}
              </h1>
              {classMeta && (
                <p className="ed-meta">{classMeta.name} · Lvl {charLevel}</p>
              )}
            </div>
            <EditorActionBar
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
              loading={loading}
              disabled={!state.class || !state.title.trim()}
              mode={mode}
            />
          </div>

          {/* Manuscript fields */}
          <ManuscriptField label="Class" hint={classMeta ? classMeta.subtitle.split('·')[0]?.trim() : undefined}>
            <select
              value={state.class}
              onChange={(e) => dispatch({ type: 'SET_CLASS', payload: e.target.value as D4Class })}
              className="ms-input"
              required
              disabled={mode === 'edit'}
            >
              <option value="">Select a class…</option>
              {CLASS_OPTIONS.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </ManuscriptField>

          <ManuscriptField label="Title" hint={`${state.title.length} / 100`}>
            <input
              type="text"
              value={state.title}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })}
              placeholder="Name your build…"
              className="ms-input"
              required
              maxLength={100}
            />
          </ManuscriptField>

          <ManuscriptField label="Level">
            <input
              type="number"
              value={charLevel}
              onChange={(e) => setCharLevel(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
              className="ms-input"
              min={1}
              max={100}
            />
          </ManuscriptField>

          <ManuscriptField label="Synopsis">
            <textarea
              value={state.description}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
              placeholder="Describe the build, playstyle, and key mechanics…"
              className="ms-input ms-textarea"
              rows={3}
            />
          </ManuscriptField>

          {/* Tags */}
          <ManuscriptField label="Tags">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {state.tags.map(tag => (
                <span key={tag} className="build-editor-tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="build-editor-tag-remove">
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag…"
                className="ms-input"
                style={{ flex: 1, minWidth: 100 }}
              />
            </div>
          </ManuscriptField>

          {/* Visibility + Season */}
          <div style={{ display: 'flex', gap: 24 }}>
            <ManuscriptField label="Season">
              <input
                type="number"
                value={state.season}
                onChange={(e) => dispatch({ type: 'SET_SEASON', value: parseInt(e.target.value) || 13 })}
                className="ms-input"
                min={1}
              />
            </ManuscriptField>
            <ManuscriptField label="Visibility">
              <label className="build-editor-toggle" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={state.is_public}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'is_public', value: e.target.checked })}
                />
                <span className="build-editor-toggle-track">
                  <span className="build-editor-toggle-thumb" />
                </span>
                <span style={{ fontFamily: 'var(--f-body)', fontSize: '1.1rem', color: 'var(--vellum-bright)' }}>
                  {state.is_public ? 'Public' : 'Private'}
                </span>
              </label>
            </ManuscriptField>
          </div>

          {/* Rotation */}
          {state.class && (
            <div className="ed-section">
              <div className="ed-sec-head">
                <div className="ed-sec-title">Rotation · Six Slots</div>
                <div className="ed-sec-meta">Drag to reorder · Slot III is your spam</div>
              </div>
              <EditorRotationStrip
                skills={state.skills}
                dispatch={dispatch}
              />
            </div>
          )}

          {/* Gear Pegboard */}
          {state.class && (
            <div className="ed-section">
              <div className="ed-sec-head">
                <div className="ed-sec-title">Gear · Twelve Plates</div>
                <div className="ed-sec-meta">Click a slot to inscribe</div>
              </div>
              <GearPegboard gear={state.gear} dispatch={dispatch} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="build-editor-error" role="alert">{error}</div>
          )}
        </section>

        {/* ── RIGHT: DOSSIER ── */}
        {state.class && (
          <Dossier
            dpsResult={dpsResult}
            ehpResult={ehpResult}
            statWeights={weights}
            isCalculating={isCalculating}
          />
        )}
      </div>

      <SaveBar />
    </div>
  );
}
