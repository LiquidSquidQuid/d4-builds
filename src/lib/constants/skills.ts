import type { D4Class } from '../types/classes';

export interface SkillDefinition {
  name: string;
  category: 'basic' | 'core' | 'defensive' | 'companion' | 'ultimate' | 'key_passive' | 'passive';
  maxPoints: number;
}

export const CLASS_SKILLS: Record<D4Class, SkillDefinition[]> = {
  barbarian: [
    // Basic
    { name: 'Lunging Strike', category: 'basic', maxPoints: 5 },
    { name: 'Bash', category: 'basic', maxPoints: 5 },
    { name: 'Frenzy', category: 'basic', maxPoints: 5 },
    { name: 'Flay', category: 'basic', maxPoints: 5 },
    // Core
    { name: 'Whirlwind', category: 'core', maxPoints: 5 },
    { name: 'Hammer of the Ancients', category: 'core', maxPoints: 5 },
    { name: 'Rend', category: 'core', maxPoints: 5 },
    { name: 'Upheaval', category: 'core', maxPoints: 5 },
    { name: 'Double Swing', category: 'core', maxPoints: 5 },
    // Defensive
    { name: 'Rallying Cry', category: 'defensive', maxPoints: 5 },
    { name: 'War Cry', category: 'defensive', maxPoints: 5 },
    { name: 'Challenging Shout', category: 'defensive', maxPoints: 5 },
    { name: 'Ground Stomp', category: 'defensive', maxPoints: 5 },
    { name: 'Iron Skin', category: 'defensive', maxPoints: 5 },
    // Companion
    { name: 'Ancient Leap', category: 'companion', maxPoints: 5 },
    { name: 'Charge', category: 'companion', maxPoints: 5 },
    { name: 'Kick', category: 'companion', maxPoints: 5 },
    // Ultimate
    { name: 'Call of Ancients', category: 'ultimate', maxPoints: 1 },
    { name: 'Wrath of the Berserker', category: 'ultimate', maxPoints: 1 },
    { name: 'Iron Maelstrom', category: 'ultimate', maxPoints: 1 },
    // Key Passive
    { name: 'Unconstrained', category: 'key_passive', maxPoints: 1 },
    { name: 'Walking Arsenal', category: 'key_passive', maxPoints: 1 },
    { name: 'Unbridled Rage', category: 'key_passive', maxPoints: 1 },
    { name: 'Gushing Wounds', category: 'key_passive', maxPoints: 1 },
    // Passive
    { name: 'Imposing Presence', category: 'passive', maxPoints: 3 },
    { name: 'Martial Vigor', category: 'passive', maxPoints: 3 },
    { name: 'Booming Voice', category: 'passive', maxPoints: 3 },
    { name: 'Pit Fighter', category: 'passive', maxPoints: 3 },
    { name: 'Counteroffensive', category: 'passive', maxPoints: 3 },
    { name: 'Aggressive Resistance', category: 'passive', maxPoints: 3 },
    { name: 'Prolific Fury', category: 'passive', maxPoints: 3 },
    { name: 'Endless Fury', category: 'passive', maxPoints: 3 },
    { name: 'Swiftness', category: 'passive', maxPoints: 3 },
  ],

  warlock: [
    // Basic
    { name: 'Hellion Sting', category: 'basic', maxPoints: 5 },
    { name: 'Shadow Bolt', category: 'basic', maxPoints: 5 },
    { name: 'Grasp of Shadow', category: 'basic', maxPoints: 5 },
    // Core
    { name: 'Dread Claws', category: 'core', maxPoints: 5 },
    { name: 'Blazing Scream', category: 'core', maxPoints: 5 },
    { name: 'Abyss', category: 'core', maxPoints: 5 },
    { name: 'Apocalypse', category: 'core', maxPoints: 5 },
    // Defensive
    { name: 'Dark Prison', category: 'defensive', maxPoints: 5 },
    { name: 'Nether Step', category: 'defensive', maxPoints: 5 },
    { name: 'Metamorphosis', category: 'defensive', maxPoints: 5 },
    // Companion
    { name: 'Rampage', category: 'companion', maxPoints: 5 },
    { name: 'Command Fallen', category: 'companion', maxPoints: 5 },
    // Ultimate
    { name: "Tyrant's Grasp", category: 'ultimate', maxPoints: 1 },
    { name: 'Abaddon', category: 'ultimate', maxPoints: 1 },
    // Key Passive
    { name: 'Encircling Terror', category: 'key_passive', maxPoints: 1 },
    { name: 'Abyssal Titan', category: 'key_passive', maxPoints: 1 },
    // Passive
    { name: 'Sigil of Subversion', category: 'passive', maxPoints: 3 },
  ],

  paladin: [
    // Basic
    { name: 'Advance', category: 'basic', maxPoints: 5 },
    { name: 'Zeal', category: 'basic', maxPoints: 5 },
    { name: 'Smite', category: 'basic', maxPoints: 5 },
    // Core
    { name: 'Blessed Hammer', category: 'core', maxPoints: 5 },
    { name: 'Fist of Heavens', category: 'core', maxPoints: 5 },
    { name: 'Brandish', category: 'core', maxPoints: 5 },
    { name: 'Blessed Shield', category: 'core', maxPoints: 5 },
    { name: 'Wing Strike', category: 'core', maxPoints: 5 },
    { name: 'Shield of Retribution', category: 'core', maxPoints: 5 },
    // Defensive
    { name: 'Holy Light', category: 'defensive', maxPoints: 5 },
    { name: 'Condemn', category: 'defensive', maxPoints: 5 },
    { name: 'Falling Star', category: 'defensive', maxPoints: 5 },
    // Companion
    { name: 'Fanaticism', category: 'companion', maxPoints: 5 },
    { name: 'Defiance', category: 'companion', maxPoints: 5 },
    { name: 'Conviction', category: 'companion', maxPoints: 5 },
    // Ultimate
    { name: 'Arbiter of Justice', category: 'ultimate', maxPoints: 1 },
    // Key Passive
    { name: "Disciple's Halo", category: 'key_passive', maxPoints: 1 },
  ],

  rogue: [
    // Basic
    { name: 'Heartseeker', category: 'basic', maxPoints: 5 },
    { name: 'Blade Shift', category: 'basic', maxPoints: 5 },
    { name: 'Forceful Arrow', category: 'basic', maxPoints: 5 },
    { name: 'Invigorating Strike', category: 'basic', maxPoints: 5 },
    { name: 'Puncture', category: 'basic', maxPoints: 5 },
    // Core
    { name: 'Rapid Fire', category: 'core', maxPoints: 5 },
    { name: 'Barrage', category: 'core', maxPoints: 5 },
    { name: 'Penetrating Shot', category: 'core', maxPoints: 5 },
    { name: 'Flurry', category: 'core', maxPoints: 5 },
    { name: 'Twisting Blades', category: 'core', maxPoints: 5 },
    { name: 'Dance of Knives', category: 'core', maxPoints: 5 },
    // Defensive
    { name: 'Dash', category: 'defensive', maxPoints: 5 },
    { name: 'Dark Shroud', category: 'defensive', maxPoints: 5 },
    { name: 'Shadow Step', category: 'defensive', maxPoints: 5 },
    { name: 'Caltrops', category: 'defensive', maxPoints: 5 },
    // Companion
    { name: 'Poison Trap', category: 'companion', maxPoints: 5 },
    { name: 'Death Trap', category: 'companion', maxPoints: 5 },
    { name: 'Cold Imbuement', category: 'companion', maxPoints: 5 },
    { name: 'Shadow Imbuement', category: 'companion', maxPoints: 5 },
    { name: 'Poison Imbuement', category: 'companion', maxPoints: 5 },
    // Ultimate
    { name: 'Shadow Clone', category: 'ultimate', maxPoints: 1 },
    { name: 'Rain of Arrows', category: 'ultimate', maxPoints: 1 },
    // Key Passive
    { name: 'Momentum', category: 'key_passive', maxPoints: 1 },
    { name: 'Precision', category: 'key_passive', maxPoints: 1 },
    { name: 'Victimize', category: 'key_passive', maxPoints: 1 },
    { name: 'Exposure', category: 'key_passive', maxPoints: 1 },
    // Passive
    { name: 'Weapon Mastery', category: 'passive', maxPoints: 3 },
    { name: 'Sturdy', category: 'passive', maxPoints: 3 },
    { name: 'Concussive', category: 'passive', maxPoints: 3 },
    { name: 'Exploit', category: 'passive', maxPoints: 3 },
    { name: 'Malice', category: 'passive', maxPoints: 3 },
  ],

  sorcerer: [
    // Basic
    { name: 'Fire Bolt', category: 'basic', maxPoints: 5 },
    { name: 'Frost Bolt', category: 'basic', maxPoints: 5 },
    { name: 'Arc Lash', category: 'basic', maxPoints: 5 },
    { name: 'Spark', category: 'basic', maxPoints: 5 },
    // Core
    { name: 'Fireball', category: 'core', maxPoints: 5 },
    { name: 'Frozen Orb', category: 'core', maxPoints: 5 },
    { name: 'Ball Lightning', category: 'core', maxPoints: 5 },
    { name: 'Blizzard', category: 'core', maxPoints: 5 },
    { name: 'Chain Lightning', category: 'core', maxPoints: 5 },
    { name: 'Incinerate', category: 'core', maxPoints: 5 },
    { name: 'Charged Bolts', category: 'core', maxPoints: 5 },
    // Defensive
    { name: 'Flame Shield', category: 'defensive', maxPoints: 5 },
    { name: 'Ice Armor', category: 'defensive', maxPoints: 5 },
    { name: 'Teleport', category: 'defensive', maxPoints: 5 },
    { name: 'Frost Nova', category: 'defensive', maxPoints: 5 },
    // Companion
    { name: 'Hydra', category: 'companion', maxPoints: 5 },
    { name: 'Ice Blades', category: 'companion', maxPoints: 5 },
    { name: 'Lightning Spear', category: 'companion', maxPoints: 5 },
    // Ultimate
    { name: 'Unstable Currents', category: 'ultimate', maxPoints: 1 },
    { name: 'Inferno', category: 'ultimate', maxPoints: 1 },
    { name: 'Deep Freeze', category: 'ultimate', maxPoints: 1 },
    // Key Passive
    { name: 'Combustion', category: 'key_passive', maxPoints: 1 },
    { name: 'Avalanche', category: 'key_passive', maxPoints: 1 },
    { name: 'Overflowing Energy', category: 'key_passive', maxPoints: 1 },
    { name: 'Vyr\'s Mastery', category: 'key_passive', maxPoints: 1 },
    // Passive
    { name: 'Devastation', category: 'passive', maxPoints: 3 },
    { name: 'Elemental Dominance', category: 'passive', maxPoints: 3 },
    { name: 'Glass Cannon', category: 'passive', maxPoints: 3 },
  ],

  druid: [
    // Basic
    { name: 'Storm Strike', category: 'basic', maxPoints: 5 },
    { name: 'Claw', category: 'basic', maxPoints: 5 },
    { name: 'Maul', category: 'basic', maxPoints: 5 },
    { name: 'Wind Shear', category: 'basic', maxPoints: 5 },
    { name: 'Earth Spike', category: 'basic', maxPoints: 5 },
    // Core
    { name: 'Pulverize', category: 'core', maxPoints: 5 },
    { name: 'Shred', category: 'core', maxPoints: 5 },
    { name: 'Tornado', category: 'core', maxPoints: 5 },
    { name: 'Landslide', category: 'core', maxPoints: 5 },
    { name: 'Lightning Storm', category: 'core', maxPoints: 5 },
    // Defensive
    { name: 'Earthen Bulwark', category: 'defensive', maxPoints: 5 },
    { name: 'Cyclone Armor', category: 'defensive', maxPoints: 5 },
    { name: 'Blood Howl', category: 'defensive', maxPoints: 5 },
    { name: 'Debilitating Roar', category: 'defensive', maxPoints: 5 },
    // Companion
    { name: 'Wolves', category: 'companion', maxPoints: 5 },
    { name: 'Ravens', category: 'companion', maxPoints: 5 },
    { name: 'Vine Creeper', category: 'companion', maxPoints: 5 },
    // Ultimate
    { name: 'Cataclysm', category: 'ultimate', maxPoints: 1 },
    { name: 'Grizzly Rage', category: 'ultimate', maxPoints: 1 },
    { name: 'Lacerate', category: 'ultimate', maxPoints: 1 },
    { name: 'Petrify', category: 'ultimate', maxPoints: 1 },
    // Key Passive
    { name: 'Bestial Rampage', category: 'key_passive', maxPoints: 1 },
    { name: 'Perfect Storm', category: 'key_passive', maxPoints: 1 },
    { name: 'Ursine Strength', category: 'key_passive', maxPoints: 1 },
    { name: 'Lupine Ferocity', category: 'key_passive', maxPoints: 1 },
    // Passive
    { name: 'Heart of the Wild', category: 'passive', maxPoints: 3 },
    { name: 'Predatory Instinct', category: 'passive', maxPoints: 3 },
    { name: 'Digitigrade Gait', category: 'passive', maxPoints: 3 },
  ],

  necromancer: [
    // Basic
    { name: 'Bone Splinters', category: 'basic', maxPoints: 5 },
    { name: 'Decompose', category: 'basic', maxPoints: 5 },
    { name: 'Hemorrhage', category: 'basic', maxPoints: 5 },
    { name: 'Reap', category: 'basic', maxPoints: 5 },
    // Core
    { name: 'Blood Surge', category: 'core', maxPoints: 5 },
    { name: 'Blood Lance', category: 'core', maxPoints: 5 },
    { name: 'Blight', category: 'core', maxPoints: 5 },
    { name: 'Sever', category: 'core', maxPoints: 5 },
    { name: 'Bone Spear', category: 'core', maxPoints: 5 },
    // Defensive
    { name: 'Blood Mist', category: 'defensive', maxPoints: 5 },
    { name: 'Bone Prison', category: 'defensive', maxPoints: 5 },
    { name: 'Corpse Explosion', category: 'defensive', maxPoints: 5 },
    // Companion
    { name: 'Skeletal Warriors', category: 'companion', maxPoints: 5 },
    { name: 'Skeletal Mages', category: 'companion', maxPoints: 5 },
    { name: 'Golem', category: 'companion', maxPoints: 5 },
    // Ultimate
    { name: 'Army of the Dead', category: 'ultimate', maxPoints: 1 },
    { name: 'Blood Wave', category: 'ultimate', maxPoints: 1 },
    { name: 'Bone Storm', category: 'ultimate', maxPoints: 1 },
    // Key Passive
    { name: 'Ossified Essence', category: 'key_passive', maxPoints: 1 },
    { name: 'Shadowblight', category: 'key_passive', maxPoints: 1 },
    { name: 'Kalan\'s Edict', category: 'key_passive', maxPoints: 1 },
    { name: 'Rathma\'s Vigor', category: 'key_passive', maxPoints: 1 },
    // Passive
    { name: 'Unliving Energy', category: 'passive', maxPoints: 3 },
    { name: 'Imperfectly Balanced', category: 'passive', maxPoints: 3 },
    { name: 'Hewed Flesh', category: 'passive', maxPoints: 3 },
    { name: 'Grim Harvest', category: 'passive', maxPoints: 3 },
  ],

  spiritborn: [
    // Basic
    { name: 'Thunderspike', category: 'basic', maxPoints: 5 },
    { name: 'Rock Splitter', category: 'basic', maxPoints: 5 },
    { name: 'Thrash', category: 'basic', maxPoints: 5 },
    { name: 'Withering Fist', category: 'basic', maxPoints: 5 },
    // Core
    { name: 'Quill Volley', category: 'core', maxPoints: 5 },
    { name: 'Stinger', category: 'core', maxPoints: 5 },
    { name: 'Ravager', category: 'core', maxPoints: 5 },
    { name: 'Soar', category: 'core', maxPoints: 5 },
    { name: 'Touch of Death', category: 'core', maxPoints: 5 },
    // Defensive
    { name: 'Armored Hide', category: 'defensive', maxPoints: 5 },
    { name: 'Scourge', category: 'defensive', maxPoints: 5 },
    { name: 'Vortex', category: 'defensive', maxPoints: 5 },
    // Companion
    { name: 'Payback', category: 'companion', maxPoints: 5 },
    { name: 'Concussive Stomp', category: 'companion', maxPoints: 5 },
    { name: 'Rushing Claw', category: 'companion', maxPoints: 5 },
    // Ultimate
    { name: 'The Hunter', category: 'ultimate', maxPoints: 1 },
    { name: 'The Protector', category: 'ultimate', maxPoints: 1 },
    { name: 'The Seeker', category: 'ultimate', maxPoints: 1 },
    // Key Passive
    { name: 'Resolution', category: 'key_passive', maxPoints: 1 },
    { name: 'Harmonious', category: 'key_passive', maxPoints: 1 },
    { name: 'Apex', category: 'key_passive', maxPoints: 1 },
    // Passive
    { name: 'Acceleration', category: 'passive', maxPoints: 3 },
    { name: 'Potent', category: 'passive', maxPoints: 3 },
    { name: 'Vigor', category: 'passive', maxPoints: 3 },
  ],
};

// Category display labels
export const SKILL_CATEGORIES: Record<SkillDefinition['category'], string> = {
  basic: 'Basic',
  core: 'Core',
  defensive: 'Defensive',
  companion: 'Companion',
  ultimate: 'Ultimate',
  key_passive: 'Key Passive',
  passive: 'Passive',
};
