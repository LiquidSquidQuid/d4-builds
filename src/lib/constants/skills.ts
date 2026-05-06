/**
 * Diablo 4 Season 13 — Skill Data (All S13 Classes)
 *
 * Expanded from the Phase 0 stub to include damage multipliers, cooldowns,
 * resource costs, and synergy tags required for the damage calculator.
 *
 * Sources:
 *   - Maxroll Build Guides (Season 13 — Season of Reckoning)
 *   - Icy Veins Class Skill Guides (Season 13)
 *   - Fextralife D4 Wiki (Warlock, Paladin)
 *   - Mobalytics S13 Build Database
 *
 * ⚠️ Skill % values are at Rank 1 unless noted.
 * Approximate per-rank scaling: Rank N ≈ Base × (1 + 0.1 × (N-1))
 * Exact values vary per skill — verify with in-game Advanced Tooltips.
 *
 * ⚠️ Warlock and Paladin are new (Lord of Hatred expansion).
 * Numbers subject to rapid balance tuning. Reflects S13 launch state.
 */

import type { D4Class } from '../types/classes';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkillCategory =
  | 'basic'
  | 'core'
  | 'defensive'
  | 'brawling'
  | 'weapon_mastery'
  | 'companion'
  | 'ultimate'
  | 'key_passive'
  | 'passive'
  | 'archfiend'
  | 'sigil'
  | 'aura'
  | 'valor'
  | 'justice'
  | 'agility'
  | 'subterfuge'
  | 'imbuement';

export type DamageType =
  | 'physical'
  | 'fire'
  | 'cold'
  | 'lightning'
  | 'poison'
  | 'shadow'
  | 'holy'
  | 'none';

export type ResourceType =
  | 'fury'
  | 'wrath'
  | 'dominance'
  | 'faith'
  | 'energy'
  | 'mana'
  | 'spirit'
  | 'essence'
  | 'none';

export type SynergyTag =
  | 'core'
  | 'basic'
  | 'shout'
  | 'brawling'
  | 'weapon_mastery'
  | 'channeled'
  | 'imbueable'
  | 'marksman'
  | 'cutthroat'
  | 'trap'
  | 'agility'
  | 'subterfuge'
  | 'oath_zealot'
  | 'oath_juggernaut'
  | 'oath_judicator'
  | 'oath_disciple'
  | 'aura'
  | 'sigil'
  | 'archfiend'
  | 'curse'
  | 'dot'
  | 'aoe'
  | 'projectile'
  | 'melee'
  | 'companion';

export interface SkillDefinition {
  readonly id: string;
  readonly name: string;
  readonly class: D4Class;
  readonly category: SkillCategory;
  readonly damageType: DamageType;
  /** Skill % at rank 1 (e.g., 0.45 = 45% weapon damage). 0 for non-damage skills. */
  readonly skillPercent: number;
  /** Cooldown in seconds (0 = no cooldown) */
  readonly cooldown: number;
  /** Resource cost (positive = spends, negative = generates) */
  readonly resourceCost: number;
  readonly resourceType: ResourceType;
  /** Max skill ranks */
  readonly maxRanks: number;
  /** Tags for synergy lookups (aspects, passives, paragons) */
  readonly tags: readonly SynergyTag[];
  /** Brief mechanical note */
  readonly note?: string;
}

/**
 * Legacy-compatible interface for components that only need name/category/maxPoints.
 * Use SkillDefinition for calculator features.
 */
export interface SkillDefinitionLegacy {
  name: string;
  category: SkillCategory;
  maxPoints: number;
}

// ─── Barbarian ────────────────────────────────────────────────────────────────

export const BARBARIAN_SKILLS: readonly SkillDefinition[] = [
  // Basic
  { id: 'barb_bash', name: 'Bash', class: 'barbarian', category: 'basic', damageType: 'physical', skillPercent: 0.30, cooldown: 0, resourceCost: -11, resourceType: 'fury', maxRanks: 5, tags: ['basic', 'melee'], note: 'Generates Fury. Stun on 4th hit.' },
  { id: 'barb_flay', name: 'Flay', class: 'barbarian', category: 'basic', damageType: 'physical', skillPercent: 0.18, cooldown: 0, resourceCost: -9, resourceType: 'fury', maxRanks: 5, tags: ['basic', 'melee', 'dot'], note: 'Generates Fury. Applies Bleed.' },
  { id: 'barb_frenzy', name: 'Frenzy', class: 'barbarian', category: 'basic', damageType: 'physical', skillPercent: 0.22, cooldown: 0, resourceCost: -4, resourceType: 'fury', maxRanks: 5, tags: ['basic', 'melee'], note: 'Dual-wield. Stacking AS buff.' },
  { id: 'barb_lunging_strike', name: 'Lunging Strike', class: 'barbarian', category: 'basic', damageType: 'physical', skillPercent: 0.30, cooldown: 0, resourceCost: -9, resourceType: 'fury', maxRanks: 5, tags: ['basic', 'melee'], note: 'Lunges to target.' },
  // Core
  { id: 'barb_whirlwind', name: 'Whirlwind', class: 'barbarian', category: 'core', damageType: 'physical', skillPercent: 0.17, cooldown: 0, resourceCost: 25, resourceType: 'fury', maxRanks: 5, tags: ['core', 'channeled', 'aoe', 'melee'], note: 'Channeled spin. 17%/tick. Fury cost/sec.' },
  { id: 'barb_hota', name: 'Hammer of the Ancients', class: 'barbarian', category: 'core', damageType: 'physical', skillPercent: 0.50, cooldown: 0, resourceCost: 35, resourceType: 'fury', maxRanks: 5, tags: ['core', 'melee', 'aoe'], note: 'High single-hit. Overpower synergy.' },
  { id: 'barb_upheaval', name: 'Upheaval', class: 'barbarian', category: 'core', damageType: 'physical', skillPercent: 0.70, cooldown: 0, resourceCost: 40, resourceType: 'fury', maxRanks: 5, tags: ['core', 'aoe', 'melee'], note: 'Flings earth. 2H only.' },
  { id: 'barb_rend', name: 'Rend', class: 'barbarian', category: 'core', damageType: 'physical', skillPercent: 0.12, cooldown: 0, resourceCost: 35, resourceType: 'fury', maxRanks: 5, tags: ['core', 'melee', 'dot', 'aoe'], note: 'Cleave + 96% Bleed over 5s.' },
  { id: 'barb_double_swing', name: 'Double Swing', class: 'barbarian', category: 'core', damageType: 'physical', skillPercent: 0.36, cooldown: 0, resourceCost: 25, resourceType: 'fury', maxRanks: 5, tags: ['core', 'melee'], note: 'Dual-wield core. Hits twice.' },
  { id: 'barb_mighty_throw', name: 'Mighty Throw', class: 'barbarian', category: 'core', damageType: 'physical', skillPercent: 0.48, cooldown: 0, resourceCost: 30, resourceType: 'fury', maxRanks: 5, tags: ['core', 'projectile'], note: 'Ranged 2H throw. Strong crit scaling. S13 meta.' },
  // Defensive / Shouts
  { id: 'barb_rallying_cry', name: 'Rallying Cry', class: 'barbarian', category: 'defensive', damageType: 'none', skillPercent: 0, cooldown: 25, resourceCost: 0, resourceType: 'fury', maxRanks: 5, tags: ['shout'], note: 'Resource gen +60%. Move speed. 6s.' },
  { id: 'barb_challenging_shout', name: 'Challenging Shout', class: 'barbarian', category: 'defensive', damageType: 'none', skillPercent: 0, cooldown: 25, resourceCost: 0, resourceType: 'fury', maxRanks: 5, tags: ['shout'], note: 'Taunt + 40% DR. 6s.' },
  { id: 'barb_war_cry', name: 'War Cry', class: 'barbarian', category: 'defensive', damageType: 'none', skillPercent: 0, cooldown: 25, resourceCost: 0, resourceType: 'fury', maxRanks: 5, tags: ['shout'], note: 'Party +15% damage. 8s. Berserking on enhanced.' },
  { id: 'barb_ground_stomp', name: 'Ground Stomp', class: 'barbarian', category: 'defensive', damageType: 'physical', skillPercent: 0.10, cooldown: 16, resourceCost: 0, resourceType: 'fury', maxRanks: 5, tags: ['aoe', 'melee'], note: 'Stun AoE. 10% damage.' },
  { id: 'barb_iron_skin', name: 'Iron Skin', class: 'barbarian', category: 'defensive', damageType: 'none', skillPercent: 0, cooldown: 14, resourceCost: 0, resourceType: 'fury', maxRanks: 5, tags: [], note: 'Barrier = 50% missing life for 5s.' },
  // Brawling
  { id: 'barb_charge', name: 'Charge', class: 'barbarian', category: 'brawling', damageType: 'physical', skillPercent: 0.25, cooldown: 17, resourceCost: 0, resourceType: 'fury', maxRanks: 5, tags: ['brawling', 'melee'], note: 'Dash + knockback. 25% damage.' },
  { id: 'barb_leap', name: 'Leap', class: 'barbarian', category: 'brawling', damageType: 'physical', skillPercent: 0.33, cooldown: 17, resourceCost: 0, resourceType: 'fury', maxRanks: 5, tags: ['brawling', 'aoe', 'melee'], note: 'Jump slam. 33% landing AoE.' },
  { id: 'barb_kick', name: 'Kick', class: 'barbarian', category: 'brawling', damageType: 'physical', skillPercent: 0.18, cooldown: 12, resourceCost: 0, resourceType: 'fury', maxRanks: 5, tags: ['brawling', 'melee'], note: 'Knockback kick. 18%.' },
  // Ultimate
  { id: 'barb_call_of_ancients', name: 'Call of the Ancients', class: 'barbarian', category: 'ultimate', damageType: 'physical', skillPercent: 1.04, cooldown: 50, resourceCost: 0, resourceType: 'fury', maxRanks: 1, tags: ['companion'], note: '3 ancients for 6s. 104%/hit each.' },
  { id: 'barb_wrath_of_berserker', name: 'Wrath of the Berserker', class: 'barbarian', category: 'ultimate', damageType: 'none', skillPercent: 0, cooldown: 60, resourceCost: 0, resourceType: 'fury', maxRanks: 1, tags: [], note: 'Berserking + Unstoppable 10s.' },
  { id: 'barb_iron_maelstrom', name: 'Iron Maelstrom', class: 'barbarian', category: 'ultimate', damageType: 'physical', skillPercent: 0.60, cooldown: 60, resourceCost: 0, resourceType: 'fury', maxRanks: 1, tags: ['aoe', 'melee'], note: '3 weapon AoE attacks. 60% each.' },
  // Key Passives
  { id: 'barb_unbridled_rage', name: 'Unbridled Rage', class: 'barbarian', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['core'], note: 'Core skills deal [x]135% more but cost 100% more Fury.' },
  { id: 'barb_walking_arsenal', name: 'Walking Arsenal', class: 'barbarian', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: [], note: 'Swap weapons → stacking [x]10% per type (max 3 stacks).' },
  { id: 'barb_unconstrained', name: 'Unconstrained', class: 'barbarian', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: [], note: 'Berserking duration +5s. [x]25% damage while Berserking.' },
  { id: 'barb_gushing_wounds', name: 'Gushing Wounds', class: 'barbarian', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['dot'], note: 'Bleed crits cause burst + extended bleed.' },
] as const;

// ─── Warlock ──────────────────────────────────────────────────────────────────

export const WARLOCK_SKILLS: readonly SkillDefinition[] = [
  // Basic
  { id: 'wlk_hellion_sting', name: 'Hellion Sting', class: 'warlock', category: 'basic', damageType: 'fire', skillPercent: 0.20, cooldown: 0, resourceCost: -9, resourceType: 'wrath', maxRanks: 5, tags: ['basic', 'projectile'], note: 'Fire projectile generator.' },
  { id: 'wlk_shadow_bolt', name: 'Shadow Bolt', class: 'warlock', category: 'basic', damageType: 'shadow', skillPercent: 0.25, cooldown: 0, resourceCost: -8, resourceType: 'wrath', maxRanks: 5, tags: ['basic', 'projectile'], note: 'Ranged shadow generator.' },
  { id: 'wlk_grasp_of_shadow', name: 'Grasp of Shadow', class: 'warlock', category: 'basic', damageType: 'shadow', skillPercent: 0.18, cooldown: 0, resourceCost: -10, resourceType: 'wrath', maxRanks: 5, tags: ['basic', 'melee'], note: 'Melee shadow grab.' },
  // Core
  { id: 'wlk_dread_claws', name: 'Dread Claws', class: 'warlock', category: 'core', damageType: 'shadow', skillPercent: 0.22, cooldown: 0, resourceCost: 20, resourceType: 'wrath', maxRanks: 5, tags: ['core', 'melee', 'dot'], note: 'Shadow melee combo. Stacking DoT. S13 leveling meta.' },
  { id: 'wlk_blazing_scream', name: 'Blazing Scream', class: 'warlock', category: 'core', damageType: 'fire', skillPercent: 0.55, cooldown: 0, resourceCost: 25, resourceType: 'wrath', maxRanks: 5, tags: ['core', 'aoe', 'channeled'], note: 'Channeled fire cone. S13 endgame build.' },
  { id: 'wlk_abyss', name: 'Abyss', class: 'warlock', category: 'core', damageType: 'shadow', skillPercent: 0.40, cooldown: 0, resourceCost: 28, resourceType: 'wrath', maxRanks: 5, tags: ['core', 'aoe', 'dot'], note: 'Shadow pool AoE. DoT + slow.' },
  { id: 'wlk_apocalypse', name: 'Apocalypse', class: 'warlock', category: 'core', damageType: 'fire', skillPercent: 0.65, cooldown: 0, resourceCost: 30, resourceType: 'wrath', maxRanks: 5, tags: ['core', 'aoe'], note: 'Hellfire rain. Large AoE. S13 endgame meta.' },
  // Defensive
  { id: 'wlk_dark_prison', name: 'Dark Prison', class: 'warlock', category: 'defensive', damageType: 'shadow', skillPercent: 0.10, cooldown: 14, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: [], note: 'Imprisons enemies. Stun + 10% dmg.' },
  { id: 'wlk_nether_step', name: 'Nether Step', class: 'warlock', category: 'defensive', damageType: 'none', skillPercent: 0, cooldown: 10, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['agility'], note: 'Teleport. 2 charges.' },
  { id: 'wlk_metamorphosis', name: 'Metamorphosis', class: 'warlock', category: 'defensive', damageType: 'shadow', skillPercent: 0.15, cooldown: 16, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: [], note: 'Transform + dash. Immune during. 15% on contact.' },
  // Archfiend (uses Dominance resource)
  { id: 'wlk_rampage', name: 'Rampage', class: 'warlock', category: 'archfiend', damageType: 'fire', skillPercent: 0.35, cooldown: 16, resourceCost: 20, resourceType: 'dominance', maxRanks: 5, tags: ['archfiend', 'companion'], note: 'Summon demon that charges. 35%/hit.' },
  { id: 'wlk_command_fallen', name: 'Command Fallen', class: 'warlock', category: 'archfiend', damageType: 'fire', skillPercent: 0.25, cooldown: 14, resourceCost: 15, resourceType: 'dominance', maxRanks: 5, tags: ['archfiend', 'companion', 'aoe'], note: 'Summon fallen minions. Swarm AoE.' },
  // Ultimate
  { id: 'wlk_tyrants_grasp', name: "Tyrant's Grasp", class: 'warlock', category: 'ultimate', damageType: 'shadow', skillPercent: 3.00, cooldown: 60, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['archfiend', 'aoe'], note: 'Giant demon hand slams. 300% AoE.' },
  { id: 'wlk_abaddon', name: 'Abaddon', class: 'warlock', category: 'ultimate', damageType: 'fire', skillPercent: 4.50, cooldown: 70, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['archfiend', 'aoe'], note: 'Summon Abaddon for 12s. Massive fire AoE.' },
  // Key Passives
  { id: 'wlk_encircling_terror', name: 'Encircling Terror', class: 'warlock', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['curse'], note: 'Enemies near you take [x]25% more damage. Shadow aura.' },
  { id: 'wlk_abyssal_titan', name: 'Abyssal Titan', class: 'warlock', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['archfiend'], note: 'Archfiend summons deal [x]40% more. Duration +3s.' },
] as const;

// ─── Paladin ──────────────────────────────────────────────────────────────────

export const PALADIN_SKILLS: readonly SkillDefinition[] = [
  // Basic
  { id: 'pal_advance', name: 'Advance', class: 'paladin', category: 'basic', damageType: 'physical', skillPercent: 0.25, cooldown: 0, resourceCost: -9, resourceType: 'faith', maxRanks: 5, tags: ['basic', 'melee', 'oath_zealot'], note: 'Charge forward + generate Faith.' },
  { id: 'pal_zeal_basic', name: 'Zeal', class: 'paladin', category: 'basic', damageType: 'holy', skillPercent: 0.20, cooldown: 0, resourceCost: -8, resourceType: 'faith', maxRanks: 5, tags: ['basic', 'melee', 'oath_zealot'], note: 'Fast strikes. Generates Faith.' },
  { id: 'pal_smite', name: 'Smite', class: 'paladin', category: 'basic', damageType: 'holy', skillPercent: 0.28, cooldown: 0, resourceCost: -10, resourceType: 'faith', maxRanks: 5, tags: ['basic', 'melee', 'oath_zealot'], note: 'Holy melee strike.' },
  // Core
  { id: 'pal_blessed_hammer', name: 'Blessed Hammer', class: 'paladin', category: 'core', damageType: 'holy', skillPercent: 0.42, cooldown: 0, resourceCost: 25, resourceType: 'faith', maxRanks: 5, tags: ['core', 'projectile', 'aoe', 'oath_judicator'], note: 'Spiraling hammer. S13 leveling meta.' },
  { id: 'pal_fist_of_heavens', name: 'Fist of Heavens', class: 'paladin', category: 'core', damageType: 'holy', skillPercent: 0.60, cooldown: 0, resourceCost: 30, resourceType: 'faith', maxRanks: 5, tags: ['core', 'aoe', 'oath_judicator'], note: 'Lightning bolt from sky. 60% + holy bolts.' },
  { id: 'pal_brandish', name: 'Brandish', class: 'paladin', category: 'core', damageType: 'holy', skillPercent: 0.45, cooldown: 0, resourceCost: 22, resourceType: 'faith', maxRanks: 5, tags: ['core', 'melee', 'aoe', 'oath_zealot'], note: 'Wide melee cleave.' },
  { id: 'pal_blessed_shield', name: 'Blessed Shield', class: 'paladin', category: 'core', damageType: 'holy', skillPercent: 0.38, cooldown: 0, resourceCost: 22, resourceType: 'faith', maxRanks: 5, tags: ['core', 'projectile', 'oath_juggernaut'], note: 'Bouncing shield throw.' },
  { id: 'pal_wing_strike', name: 'Wing Strike', class: 'paladin', category: 'core', damageType: 'holy', skillPercent: 0.35, cooldown: 0, resourceCost: 20, resourceType: 'faith', maxRanks: 5, tags: ['core', 'melee', 'oath_disciple'], note: 'Arbiter-form melee. Gains Disciple bonuses.' },
  { id: 'pal_shield_bash', name: 'Shield of Retribution', class: 'paladin', category: 'core', damageType: 'physical', skillPercent: 0.50, cooldown: 0, resourceCost: 28, resourceType: 'faith', maxRanks: 5, tags: ['core', 'melee', 'oath_juggernaut'], note: 'Shield slam. Stuns. Requires shield.' },
  // Auras (passive toggles, no cost)
  { id: 'pal_fanaticism', name: 'Fanaticism', class: 'paladin', category: 'aura', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['aura'], note: '+15% Attack Speed aura.' },
  { id: 'pal_defiance', name: 'Defiance', class: 'paladin', category: 'aura', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['aura'], note: '+20% DR aura. S13 tank meta.' },
  { id: 'pal_conviction', name: 'Conviction', class: 'paladin', category: 'aura', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['aura'], note: 'Enemies near take [x]15% more damage.' },
  // Justice
  { id: 'pal_condemn', name: 'Condemn', class: 'paladin', category: 'justice', damageType: 'holy', skillPercent: 0.80, cooldown: 14, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['oath_judicator', 'aoe'], note: '3s delayed explosion. 80% AoE.' },
  { id: 'pal_falling_star', name: 'Falling Star', class: 'paladin', category: 'justice', damageType: 'holy', skillPercent: 0.55, cooldown: 12, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['aoe', 'oath_disciple'], note: 'Leap + holy impact. 55% landing.' },
  { id: 'pal_holy_light', name: 'Holy Light', class: 'paladin', category: 'defensive', damageType: 'holy', skillPercent: 0, cooldown: 16, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: [], note: 'Heal 25% max HP. Ally heal.' },
  // Ultimate
  { id: 'pal_arbiter_of_justice', name: 'Arbiter of Justice', class: 'paladin', category: 'ultimate', damageType: 'holy', skillPercent: 6.00, cooldown: 70, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['oath_disciple'], note: 'Ascend + crash 600%. Arbiter form 20s.' },
  // Key Passive
  { id: 'pal_disciples_halo', name: "Disciple's Halo", class: 'paladin', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['oath_disciple'], note: 'Cooldown skills trigger Arbiter form 4.5s. [x]50% dmg in form.' },
] as const;

// ─── Rogue ────────────────────────────────────────────────────────────────────

export const ROGUE_SKILLS: readonly SkillDefinition[] = [
  // Basic
  { id: 'rog_puncture', name: 'Puncture', class: 'rogue', category: 'basic', damageType: 'physical', skillPercent: 0.21, cooldown: 0, resourceCost: -8, resourceType: 'energy', maxRanks: 5, tags: ['basic', 'melee', 'cutthroat'], note: 'Knife throws. Applies Vulnerable.' },
  { id: 'rog_blade_shift', name: 'Blade Shift', class: 'rogue', category: 'basic', damageType: 'physical', skillPercent: 0.20, cooldown: 0, resourceCost: -12, resourceType: 'energy', maxRanks: 5, tags: ['basic', 'melee', 'cutthroat'], note: 'Stab + reposition.' },
  { id: 'rog_forceful_arrow', name: 'Forceful Arrow', class: 'rogue', category: 'basic', damageType: 'physical', skillPercent: 0.20, cooldown: 0, resourceCost: -9, resourceType: 'energy', maxRanks: 5, tags: ['basic', 'marksman', 'projectile'], note: 'Every 3rd → Vulnerable + Knockback.' },
  { id: 'rog_invigorating_strike', name: 'Invigorating Strike', class: 'rogue', category: 'basic', damageType: 'physical', skillPercent: 0.23, cooldown: 0, resourceCost: -8, resourceType: 'energy', maxRanks: 5, tags: ['basic', 'melee', 'cutthroat'], note: 'Extra energy vs CC enemies.' },
  { id: 'rog_heartseeker', name: 'Heartseeker', class: 'rogue', category: 'basic', damageType: 'physical', skillPercent: 0.22, cooldown: 0, resourceCost: -9, resourceType: 'energy', maxRanks: 5, tags: ['basic', 'marksman', 'projectile'], note: 'Seeking arrow. Stacks crit chance buff.' },
  // Core
  { id: 'rog_dance_of_knives', name: 'Dance of Knives', class: 'rogue', category: 'core', damageType: 'physical', skillPercent: 0.30, cooldown: 0, resourceCost: 20, resourceType: 'energy', maxRanks: 5, tags: ['core', 'channeled', 'imbueable', 'cutthroat', 'aoe'], note: 'Channeled knife spin. S13 #1 build. Fan modifier shotguns.' },
  { id: 'rog_rapid_fire', name: 'Rapid Fire', class: 'rogue', category: 'core', damageType: 'physical', skillPercent: 0.24, cooldown: 0, resourceCost: 25, resourceType: 'energy', maxRanks: 5, tags: ['core', 'marksman', 'projectile', 'imbueable'], note: '5 arrows. Ricochets. Combo Point scaling.' },
  { id: 'rog_barrage', name: 'Barrage', class: 'rogue', category: 'core', damageType: 'physical', skillPercent: 0.21, cooldown: 0, resourceCost: 30, resourceType: 'energy', maxRanks: 5, tags: ['core', 'marksman', 'projectile', 'imbueable', 'aoe'], note: 'Fan of arrows. Combo Points add arrows.' },
  { id: 'rog_penetrating_shot', name: 'Penetrating Shot', class: 'rogue', category: 'core', damageType: 'physical', skillPercent: 0.70, cooldown: 0, resourceCost: 35, resourceType: 'energy', maxRanks: 5, tags: ['core', 'marksman', 'projectile', 'imbueable'], note: 'Pierce all enemies in line. 70%.' },
  { id: 'rog_twisting_blades', name: 'Twisting Blades', class: 'rogue', category: 'core', damageType: 'physical', skillPercent: 0.38, cooldown: 0, resourceCost: 30, resourceType: 'energy', maxRanks: 5, tags: ['core', 'melee', 'cutthroat', 'imbueable'], note: 'Impale + return (72% on return path).' },
  { id: 'rog_flurry', name: 'Flurry', class: 'rogue', category: 'core', damageType: 'physical', skillPercent: 0.14, cooldown: 0, resourceCost: 25, resourceType: 'energy', maxRanks: 5, tags: ['core', 'melee', 'cutthroat', 'imbueable', 'aoe'], note: '4-hit combo. 14%/hit.' },
  // Agility
  { id: 'rog_dash', name: 'Dash', class: 'rogue', category: 'agility', damageType: 'physical', skillPercent: 0.368, cooldown: 10, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['agility', 'melee'], note: '2 charges. Dash through for 36.8%.' },
  { id: 'rog_shadow_step', name: 'Shadow Step', class: 'rogue', category: 'agility', damageType: 'physical', skillPercent: 0.72, cooldown: 9, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['agility', 'melee'], note: 'Teleport behind. 72% backstab. Unstoppable.' },
  { id: 'rog_caltrops', name: 'Caltrops', class: 'rogue', category: 'agility', damageType: 'physical', skillPercent: 0.10, cooldown: 12, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['trap', 'agility', 'aoe'], note: 'Jump back + caltrops. Slow + 10% per tick.' },
  // Subterfuge
  { id: 'rog_dark_shroud', name: 'Dark Shroud', class: 'rogue', category: 'subterfuge', damageType: 'none', skillPercent: 0, cooldown: 20, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['subterfuge'], note: '5 shadows. 8% DR per shadow.' },
  // Imbuements
  { id: 'rog_poison_imbuement', name: 'Poison Imbuement', class: 'rogue', category: 'imbuement', damageType: 'poison', skillPercent: 0.70, cooldown: 9, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['imbueable', 'dot'], note: 'Next 2 skills +70% Poison over 5s.' },
  { id: 'rog_cold_imbuement', name: 'Cold Imbuement', class: 'rogue', category: 'imbuement', damageType: 'cold', skillPercent: 0, cooldown: 9, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['imbueable'], note: 'Next 2 skills Chill. Frozen → shatter AoE.' },
  { id: 'rog_shadow_imbuement', name: 'Shadow Imbuement', class: 'rogue', category: 'imbuement', damageType: 'shadow', skillPercent: 0.40, cooldown: 9, resourceCost: 0, resourceType: 'none', maxRanks: 5, tags: ['imbueable', 'aoe'], note: 'Infected enemies explode on death. 40% AoE.' },
  // Ultimate
  { id: 'rog_shadow_clone', name: 'Shadow Clone', class: 'rogue', category: 'ultimate', damageType: 'shadow', skillPercent: 0.60, cooldown: 60, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['subterfuge'], note: 'Clone mimics at 60% for 15s.' },
  { id: 'rog_rain_of_arrows', name: 'Rain of Arrows', class: 'rogue', category: 'ultimate', damageType: 'physical', skillPercent: 1.00, cooldown: 60, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['marksman', 'aoe', 'imbueable'], note: '2 arrow waves. 100%/wave. Imbueable.' },
  // Key Passives
  { id: 'rog_momentum', name: 'Momentum', class: 'rogue', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['cutthroat'], note: '3 stacks of Momentum → [x]20% damage, DR, Energy regen.' },
  { id: 'rog_precision', name: 'Precision', class: 'rogue', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['marksman'], note: 'Crits stack Precision. At max → guaranteed crit + [x] bonus scaled by CSD%.' },
  { id: 'rog_victimize', name: 'Victimize', class: 'rogue', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: [], note: 'Lucky Hit vs Vulnerable → AoE explosion.' },
  { id: 'rog_exposure', name: 'Exposure', class: 'rogue', category: 'key_passive', damageType: 'none', skillPercent: 0, cooldown: 0, resourceCost: 0, resourceType: 'none', maxRanks: 1, tags: ['trap'], note: 'Trap skills reduce enemy DR. Synergy with Caltrops/traps.' },
] as const;

// ─── Combined Exports ─────────────────────────────────────────────────────────

export const ALL_SKILLS: readonly SkillDefinition[] = [
  ...BARBARIAN_SKILLS,
  ...WARLOCK_SKILLS,
  ...PALADIN_SKILLS,
  ...ROGUE_SKILLS,
] as const;

/** Get all skills for a given class */
export function getSkillsByClass(className: D4Class): SkillDefinition[] {
  return ALL_SKILLS.filter((s) => s.class === className);
}

/** Get skills matching a synergy tag (for aspect/passive/paragon lookups) */
export function getSkillsByTag(tag: SynergyTag): SkillDefinition[] {
  return ALL_SKILLS.filter((s) => s.tags.includes(tag));
}

/** Find a single skill by its unique ID */
export function getSkillById(id: string): SkillDefinition | undefined {
  return ALL_SKILLS.find((s) => s.id === id);
}

/**
 * Legacy-compatible export: flattened name/category/maxPoints per class.
 * Use this for existing components that haven't migrated to the full schema.
 */
export function getLegacySkills(className: D4Class): SkillDefinitionLegacy[] {
  return getSkillsByClass(className).map((s) => ({
    name: s.name,
    category: s.category,
    maxPoints: s.maxRanks,
  }));
}
