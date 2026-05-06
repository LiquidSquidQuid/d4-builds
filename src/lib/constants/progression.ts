export const PROGRESSION_KEYS = [
  { key: 'hit_70', label: 'Hit 70 → Pit Tier 10 → Torment 1' },
  { key: 'respec', label: 'Respec skill tree for endgame variant' },
  { key: 'paragon', label: 'Paragon — Legendary nodes → Glyphs to 15 → Glyphs to 46' },
  { key: 'talisman', label: 'Talisman — Legendary Seal → class BiS charm set (5pc) + Unique Charm' },
  { key: 'horadric_cube', label: 'Horadric Cube — upgrade commons → legendary for target-farming' },
  { key: 'runewords', label: 'Runewords — Ritual + Invocation in weapons/armor' },
  { key: 'masterworking', label: 'Masterworking — weapon damage → key offensive affix → capstone' },
  { key: 'torment_push', label: 'Torment push — T1→T2→T3→T4. Ancestral gear = guaranteed Greater Affix' },
  { key: 'war_plans', label: 'War Plans — Helltides, Pit, Undercity, Infernal Hordes, Echoing Hatred' },
  { key: 'boss_ladder', label: 'Boss Ladder — Lair → Greater Lair → Tormented (Mythic Unique target farm)' },
] as const;

export type ProgressionKey = (typeof PROGRESSION_KEYS)[number]['key'];
