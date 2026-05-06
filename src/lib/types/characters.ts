import type { D4Class } from './classes';

export interface Character {
  id: string;
  user_id: string;
  class: D4Class;
  name: string;
  level: number;
  paragon: number;
  season: number | null;
  active_build: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgressionStep {
  id: string;
  character_id: string;
  step_key: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
}

export interface CharacterWithProgress extends Character {
  progression_steps: ProgressionStep[];
}

export interface CharacterFormState {
  class: D4Class | '';
  name: string;
  level: number;
  paragon: number;
  season: number;
  active_build: string | null;
}
