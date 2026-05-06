import type { D4Class } from './classes';

// --- Database row types ---

export interface Build {
  id: string;
  user_id: string;
  class: D4Class;
  title: string;
  description: string | null;
  tags: string[];
  is_public: boolean;
  season: number | null;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

export interface BuildSkill {
  id: string;
  build_id: string;
  skill_name: string;
  points: number;
  slot: number | null;
  is_passive: boolean;
  notes: string | null;
}

export interface BuildGear {
  id: string;
  build_id: string;
  slot: string;
  item_name: string;
  is_unique: boolean;
  affixes: string[];
  notes: string | null;
}

// --- Composite type for display ---

export interface BuildWithDetails extends Build {
  skills: BuildSkill[];
  gear: BuildGear[];
  author?: { display_name: string; battletag: string | null };
}

// --- Form input types (no id/build_id) ---

export interface BuildSkillInput {
  skill_name: string;
  points: number;
  slot: number | null;
  is_passive: boolean;
  notes: string;
}

export interface BuildGearInput {
  slot: string;
  item_name: string;
  is_unique: boolean;
  affixes: string[];
  notes: string;
}

export interface BuildFormState {
  class: D4Class | '';
  title: string;
  description: string;
  tags: string[];
  is_public: boolean;
  season: number;
  skills: BuildSkillInput[];
  gear: Record<string, BuildGearInput>;
}

// --- Reducer actions ---

export type BuildAction =
  | { type: 'SET_CLASS'; payload: D4Class }
  | { type: 'SET_FIELD'; field: 'title' | 'description' | 'is_public'; value: string | boolean }
  | { type: 'SET_SEASON'; value: number }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'SET_SKILL'; index: number; payload: BuildSkillInput }
  | { type: 'REMOVE_SKILL'; index: number }
  | { type: 'ADD_SKILL' }
  | { type: 'SET_GEAR'; slot: string; payload: BuildGearInput }
  | { type: 'CLEAR_GEAR'; slot: string }
  | { type: 'INIT'; payload: BuildFormState }
  | { type: 'RESET' };
