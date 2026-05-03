export type D4Class = 'barbarian' | 'warlock' | 'paladin' | 'rogue' | 'sorcerer' | 'druid' | 'necromancer' | 'spiritborn';

export interface ClassMeta {
  slug: D4Class;
  name: string;
  abbr: string;        // Short label for icon (B, W, P, R, S, D, N, SB)
  color: string;       // CSS variable name like 'var(--c-barb)'
  colorHex: string;    // Hex like '#c94a3a'
  gradientClass: string; // CSS class like 'class-grad-barb'
  subtitle: string;    // The keywords line under the class name
  mechanic: { title: string; body: string };
  overview: string;    // HTML string (has <strong> tags)
}

export interface SkillSlot {
  label: string;  // Basic, Core, Shout, etc.
  name: string;   // Skill name
}

export interface SkillBarData {
  title: string;
  skills: SkillSlot[];
}

export interface GearItem {
  label: string;
  name: string;
  desc: string;
}

export interface PhaseData {
  number: number;
  title: string;
  levels: string;
  body: string;  // HTML string
}

export interface CalloutData {
  type: 'info' | 'warning';
  label?: string;
  body: string;  // HTML string
}

export interface StatPriorityData {
  stats: { name: string; primary?: boolean }[];
}

export interface ClassPageData {
  meta: ClassMeta;
  skillBars: SkillBarData[];
  phases?: PhaseData[];
  callouts: CalloutData[];
  gear: GearItem[];
  statPriority: StatPriorityData;
}

export interface TierEntry {
  tier: string;
  tierColor: string;
  tierWeight: number;  // font-weight
  build: string;
  classSlug: D4Class;
  className: string;
  playstyle: string;
  isBTier?: boolean;  // B-tier row spans all columns
}

export interface TipData {
  body: string;  // HTML string
}

export interface EndgameStep {
  text: string;
}

export interface SourceLink {
  name: string;
  url: string;
}
