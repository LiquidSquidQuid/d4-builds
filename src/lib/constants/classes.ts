import type { ClassPageData, D4Class } from '../types/classes';

const CLASS_DATA: ClassPageData[] = [
  // ─── BARBARIAN ───────────────────────────────────────────────────────────────
  {
    meta: {
      slug: 'barbarian',
      name: 'Barbarian',
      abbr: 'B',
      color: 'var(--c-barb)',
      colorHex: '#c94a3a',
      gradientClass: 'class-grad-barb',
      subtitle: 'Arsenal System · Shouts · Fury · Berserking · Dust Devils',
      mechanic: {
        title: 'Class Mechanic: Arsenal',
        body: 'Assign weapons per skill. Technique slot = passive bonus from any weapon type. WW → Two-Handed Slashing (Furious bleed). Polearm Technique for damage at high HP.',
      },
      overview:
        '<strong>Whirlwind</strong> — hold one button, fire conversion via Bursting (lvl 15), Dust Devils spawn automatically, Gohr\'s auto-fires Mighty Throw. <strong>HotA/Ancient Leap</strong> — fire melee summoner, Ancestral modifier spawns Ancients mimicking swings, generatorless (spam HotA only), Bul-Kathos\' Pride 5pc + Arreat\'s Bearing for triple Ancients. <strong>Rend</strong> — bleed DoT, apply and move on. <strong>Lunging Strike</strong> — best zero-unique starter, transitions to WW/HotA at 70.',
    },
    skillBars: [
      {
        title: 'WW Skill Bar',
        skills: [
          { label: 'Basic', name: 'Lunging Strike' },
          { label: 'Core', name: 'Whirlwind' },
          { label: 'Shout', name: 'Rallying Cry' },
          { label: 'Shout', name: 'War Cry' },
          { label: 'Shout', name: 'Challenging' },
          { label: 'Ultimate', name: 'Call of Ancients' },
        ],
      },
    ],
    phases: [
      {
        number: 1,
        title: 'Generator + Core',
        levels: 'Levels 1–15',
        body: 'Lunging Strike → Enhanced → Battle. WW → Enhanced → Furious. Rallying Cry chain. War Cry → Power. <strong>Bursting at 15 = fire conversion.</strong>',
      },
      {
        number: 2,
        title: 'Core Max + Transition',
        levels: 'Levels 16–40',
        body: 'Max WW ranks 2–5. Max Lunging Strike. Ground Stomp for CC. Transition to WW as primary once you find <strong>Aspect of Anger Management</strong> from Obol glove gambles.',
      },
      {
        number: 3,
        title: 'Ultimate + Key Passives',
        levels: 'Levels 40–55',
        body: 'Wrath of Berserker → Prime → Supreme. <strong>Unconstrained</strong> (extends Berserking). Swiftness, Pit Fighter, Counteroffensive, Aggressive Resistance, Prolific Fury, Endless Fury.',
      },
      {
        number: 4,
        title: 'Endgame Transition',
        levels: 'Levels 55–70',
        body: 'Swap Ground Stomp → <strong>Iron Skin</strong> (procs Tibault\'s Unstoppable). Drop Lunging Strike. Add Call of Ancients. Gohr\'s + Tibault\'s + Crown of Lucion + Ring of Starless Skies. Imposing Presence, Martial Vigor, Booming Voice for remaining points.',
      },
    ],
    callouts: [
      {
        type: 'warning',
        label: 'Warning',
        body: '<strong>Do NOT start with Whirlwind.</strong> Fury costs make early WW miserable. Use Lunging Strike + HotA lvl 1–30, then transition once you have fury sustain.',
      },
    ],
    gear: [
      {
        label: 'WW · Gloves',
        name: "Gohr's Devastating Grips",
        desc: 'Auto Mighty Throw while spinning. Cube upgrade commons to target.',
      },
      {
        label: 'WW · Pants',
        name: "Tibault's Will",
        desc: 'Fury sustain via Unstoppable from Iron Skin. Mandatory.',
      },
      {
        label: 'HotA · Talisman',
        name: "Bul-Kathos' Pride (5pc)",
        desc: 'Reduced Fury, CDR, Ancient Skill damage, +1 Ancient per cast.',
      },
      {
        label: 'HotA · Unique',
        name: "Arreat's Bearing",
        desc: '+1 Ancient per non-Call skill cast. Triple Ancients.',
      },
      {
        label: 'HotA · Chest',
        name: 'The Relentless Heart',
        desc: 'New HotA chest. Ramping damage multiplier.',
      },
      {
        label: 'Universal',
        name: 'Ring of Starless Skies',
        desc: 'Resource cost reduction + offensive stats. Best ring for all Barb builds.',
      },
    ],
    statPriority: {
      stats: [
        { name: 'Strength', primary: true },
        { name: 'Crit Chance' },
        { name: 'Attack Speed' },
        { name: 'Fury Cost Red.' },
        { name: 'Max Life' },
        { name: 'Armor' },
      ],
    },
  },

  // ─── WARLOCK ─────────────────────────────────────────────────────────────────
  {
    meta: {
      slug: 'warlock',
      name: 'Warlock',
      abbr: 'W',
      color: 'var(--c-warlock)',
      colorHex: '#7b3fa0',
      gradientClass: 'class-grad-warlock',
      subtitle: 'Soul Shards · Wrath + Dominance · Shadowform · Demonform · Sigils',
      mechanic: {
        title: 'Soul Shards',
        body: '<strong>Mastermind</strong> (Laalish) — Abyss/stealth builds. Recasts don\'t break Shadowform, +30% Abyss in stealth. <strong>Ritualist</strong> (Vollach) — Occult/Overpower builds. Empowered Apocalypse. <strong>Vanguard</strong> — orbiting spell. Each has 2 Fragment upgrades.',
      },
      overview:
        'Six distinct endgame builds. <strong>Blazing Abyss</strong> — permanent stealth, Abyss pulses. <strong>Apocalypse</strong> — 100-stack ramp → screen nuke, Hands of Worldbreaker makes it a Sigil skill. <strong>Dread Claws</strong> — best leveler, circular AoE from you AND demon. <strong>Abaddon Summoner</strong> — demon army, no uniques required. <strong>Blazing Scream</strong> — bouncing heads, Lesser Demon tag for unique synergies. <strong>Tyrant\'s Grasp</strong> — Demonform melee, Flesh of Abaddon talisman.',
    },
    skillBars: [
      {
        title: 'Dread Claws Leveling (Best Warlock Starter)',
        skills: [
          { label: 'Basic', name: 'Hellion Sting' },
          { label: 'Core', name: 'Dread Claws' },
          { label: 'Mobility', name: 'Nether Step' },
          { label: 'Summon', name: 'Rampage' },
          { label: 'Resource', name: 'Command Fallen' },
          { label: 'CC', name: 'Dark Prison' },
        ],
      },
    ],
    phases: [
      {
        number: 1,
        title: 'Basics',
        levels: '1–10',
        body: 'Hellion Sting (Wrath gen). <strong>Dread Claws</strong> (lvl 3) — frontal wave. <strong>Nether Step</strong> (lvl 4) — teleport + Shadowform. <strong>Rampage</strong> (lvl 8) — summon demon.',
      },
      {
        number: 2,
        title: 'Encircling Terror',
        levels: '10–20',
        body: '<strong>Encircling Terror</strong> (lvl 15) — Dread Claws → circular AoE around you AND your demon. <strong>Abyssal Titan</strong> (lvl 20) — reposition demon free. Max Dread Claws ranks.',
      },
      {
        number: 3,
        title: 'Soul Shard + Resources',
        levels: '20–35',
        body: '<strong>Command Fallen - Fallen Rush</strong> (lvl 30) — generates both Wrath AND Dominance. <strong>Dark Prison - Chain Aura</strong> — defense package. Complete Warlock quest → <strong>Mastermind Shard + Laalish</strong>. Drop Hellion Sting at 34.',
      },
      {
        number: 4,
        title: 'Stealth Engine',
        levels: '35–70',
        body: 'Add <strong>Metamorphosis</strong> — attack while stealthed. <strong>Sigil of Subversion</strong> for Hex. Igni+Prid rune auto-casts Dark Prison → free bar slot. Farm <strong>Litany of Sable</strong> + <strong>Footfalls of the Waning World</strong>. Shadow of Harash + Rite of the Nameless double set in lategame.',
      },
    ],
    callouts: [],
    gear: [
      {
        label: 'Dread Claws',
        name: 'Litany of Sable',
        desc: 'Core Dread Claws unique. Cube upgrade to target.',
      },
      {
        label: 'Apocalypse',
        name: 'Hands of the Worldbreaker',
        desc: 'Turns Apocalypse into Sigil skill. Mandatory for that build.',
      },
      {
        label: 'Universal',
        name: 'Anathema of the Primes',
        desc: 'Converts Archfiend skills to Wrath cost. BiS for Tyrant\'s Grasp + others.',
      },
      {
        label: 'Boots',
        name: 'Footfalls of the Waning World',
        desc: 'Frequent teleports. Extends Rampage/Command Fallen duration.',
      },
      {
        label: 'Talisman',
        name: "Shadow of Harash · Rite of the Nameless · Flesh of Abaddon · Horazon's Chains",
        desc: 'Build-specific sets. Shadow of Harash for Abyss, Rite for Sigil, Flesh for Demonform, Horazon\'s for Blazing Scream.',
      },
    ],
    statPriority: {
      stats: [
        { name: 'Willpower', primary: true },
        { name: 'Attack Speed' },
        { name: 'Crit Chance' },
        { name: 'Shadow/Fire Dmg' },
        { name: 'Max Life' },
      ],
    },
  },

  // ─── PALADIN ─────────────────────────────────────────────────────────────────
  {
    meta: {
      slug: 'paladin',
      name: 'Paladin',
      abbr: 'P',
      color: 'var(--c-paladin)',
      colorHex: '#d4a942',
      gradientClass: 'class-grad-paladin',
      subtitle: 'Oaths · Arbiter Form · Auras · Faith · Resolve',
      mechanic: {
        title: 'Oaths & Arbiter Form',
        body: '<strong>Disciple</strong> (most builds) — Disciple skill with CD → Arbiter form 4.5s. Arbiter = empowered Evade, damage scaling, Ascension buff. <strong>Judicator</strong> — Judgement detonation builds. <strong>Juggernaut</strong> — tank/thorns. <strong>Zealot</strong> — attack speed stacking. <strong>Resolve</strong> = defensive stacks, 20% DR while any remain.',
      },
      overview:
        'Widest competitive spread of any class. Mobalytics has <strong>10 S-tier Paladin builds</strong>. <strong>Auradin</strong> — kill by running near enemies, Holy Light Aura scales with Attack Speed + Armor (Castle paragon node), Dawnfire + Sundered Knight + Griswald (Cube). <strong>Hammerdin</strong> — D2 classic, Disciple\'s Halo orbits hammers, Argent Veil auto-casts via Arbiter Evade, needs boots with "Attacks Reduce Evade CD". Also S-tier: Wing Strike, Thorns/Shield of Retribution, Fist of Heavens, Zeal, Brandish, Blessed Shield, Support.',
    },
    skillBars: [
      {
        title: 'Auradin Skill Bar',
        skills: [
          { label: 'Mobility', name: 'Falling Star' },
          { label: 'Aura', name: 'Holy Light' },
          { label: 'Aura', name: 'Fanaticism' },
          { label: 'Aura', name: 'Defiance' },
          { label: 'Utility', name: 'Advance' },
          { label: 'Ultimate', name: 'Arbiter of Justice' },
        ],
      },
      {
        title: 'Hammerdin Skill Bar',
        skills: [
          { label: 'Basic', name: 'Advance' },
          { label: 'Core', name: 'Blessed Hammer' },
          { label: 'Mobility', name: 'Falling Star' },
          { label: 'CC', name: 'Condemn' },
          { label: 'Aura', name: 'Fanaticism' },
          { label: 'Aura', name: 'Defiance' },
        ],
      },
    ],
    phases: [],
    callouts: [],
    gear: [
      {
        label: 'Auradin · Gloves',
        name: 'Dawnfire',
        desc: 'Holy Light → Fire damage/sec that grows per kill. Build-enabling.',
      },
      {
        label: 'Auradin · Weapon',
        name: 'Sundered Knight + Griswald',
        desc: 'Cube lets you run BOTH. Consecration = 160–200% Aura Potency.',
      },
      {
        label: 'Hammerdin · Ring',
        name: 'Argent Veil',
        desc: 'Auto-casts Blessed Hammer on Arbiter Evade. The Exodia piece.',
      },
      {
        label: 'Hammerdin · Weapon',
        name: "Herald's Morningstar",
        desc: '1H Mace boosting Blessed Hammer directly.',
      },
      {
        label: 'Talisman',
        name: "Light's Epiphany (5pc)",
        desc: "5pc: Arbiter casts ALL Ultimates + 500%× Disciple damage. Also: Cathan's Iron Conviction for Auradin, Righteous Will for boss pushing.",
      },
    ],
    statPriority: {
      stats: [
        { name: 'Strength', primary: true },
        { name: 'Attack Speed' },
        { name: 'Armor' },
        { name: 'CDR' },
        { name: 'Aura Potency' },
        { name: 'Max Life' },
      ],
    },
  },

  // ─── ROGUE ───────────────────────────────────────────────────────────────────
  {
    meta: {
      slug: 'rogue',
      name: 'Rogue',
      abbr: 'R',
      color: 'var(--c-rogue)',
      colorHex: '#3aa87c',
      gradientClass: 'class-grad-rogue',
      subtitle: 'Combo Points · Energy · Imbuements · Specializations',
      mechanic: {
        title: 'Specializations',
        body: 'Unlock lvl 15. <strong>Combo Points</strong> — build 3 with Basic, consume for damage + Lucky Hit. <strong>Nilfur\'s Narrow Eye 5pc</strong> auto-triggers Heartseeker 3× per Core cast = no manual Combo Points needed. <strong>Inner Sight</strong> — 25%× Crit Damage proc.',
      },
      overview:
        '<strong>Death Trap (S+)</strong> — highest burst in game, trap + nuke. <strong>Dance of Knives (S)</strong> — channel indefinitely, snapshot Combo Points, Fan of Knives shotgun. <strong>Rapid Fire (A)</strong> — 10 arrows + Ruckus ricochet, cleanest leveling→endgame pipeline. <strong>Penetrating Shot (A)</strong> — Confluence groups enemies, pierce all. <strong>Barrage (A)</strong> — Windforce unique. <strong>Flurry (A)</strong> — melee hybrid, Transporter dash. All use Cold Imbuement → Freeze → Shatter. Swap Overflow → Shadow Dancer once energy is solved.',
    },
    skillBars: [
      {
        title: 'Rapid Fire Skill Bar (Best Leveler)',
        skills: [
          { label: 'Basic', name: 'Heartseeker' },
          { label: 'Core', name: 'Rapid Fire' },
          { label: 'Agility', name: 'Dash' },
          { label: 'Subterfuge', name: 'Dark Shroud' },
          { label: 'Imbuement', name: 'Cold Imbuement' },
          { label: 'Ultimate', name: 'Shadow Clone' },
        ],
      },
    ],
    phases: [],
    callouts: [],
    gear: [
      {
        label: 'Bow',
        name: 'Eaglehorn',
        desc: 'Massive Rapid Fire/Pen Shot boost. Potential double hit.',
      },
      {
        label: 'DoK',
        name: "Death's Pavane",
        desc: 'Up to 90%× damage for Dance of Knives.',
      },
      {
        label: 'Ring',
        name: 'Ring of Starless Skies',
        desc: '50% Resource Cost Red. Enables infinite channeling.',
      },
      {
        label: 'Weapon',
        name: 'Azurewrath',
        desc: 'Explodes Frozen enemies from Cold Imbuement.',
      },
      {
        label: 'Talisman',
        name: "Nilfur's Narrow Eye (5pc)",
        desc: 'Auto Heartseeker 3× per Core cast. No manual Combo Points.',
      },
    ],
    statPriority: {
      stats: [
        { name: 'Dexterity', primary: true },
        { name: 'Crit Chance' },
        { name: 'Attack Speed' },
        { name: 'Energy Cost Red.' },
        { name: 'Max Life' },
      ],
    },
  },

  // ─── SORCERER ────────────────────────────────────────────────────────────────
  {
    meta: {
      slug: 'sorcerer',
      name: 'Sorcerer',
      abbr: 'S',
      color: 'var(--c-sorc)',
      colorHex: '#5ba3d9',
      gradientClass: 'class-grad-sorcerer',
      subtitle: 'Enchantments · Mana · Elemental Conversion · Unstable Currents · Crackling Energy',
      mechanic: {
        title: 'Enchantment System + LoH Changes',
        body: 'Slot skills for passive effects. LoH adds elemental conversion variants to every skill. <strong>Shock skill ranks</strong> are the meta stat — they scale damage, Unstable Currents duration, AND Crackling Energy generation simultaneously.',
      },
      overview:
        '<strong>Ball Lightning / Ballkuna (S+)</strong> — consensus #1 overall build across all sources. Orbs travel slowly hitting everything repeatedly. Unstable Currents for screen-wide Crackling explosions. <strong>Static Field Blizzard / Shockuna (S)</strong> — Blizzard converted to Lightning variant, scales triple with Shock ranks. Fractured Winterglass chase unique. <strong>Hydra (A)</strong> — summon-caster turrets, fire/frost/lightning variants, great safety. <strong>Crackling Energy (A)</strong> — pure shock, low gear dependency. <strong>Fireball/Frozen Orb (B)</strong> — viable but lower ceiling than shock.',
    },
    skillBars: [],
    phases: [],
    callouts: [],
    gear: [],
    statPriority: {
      stats: [
        { name: 'Intelligence', primary: true },
        { name: 'Shock Skill Ranks' },
        { name: 'Crit Chance' },
        { name: 'Mana Cost Red.' },
        { name: 'CDR' },
        { name: 'Max Life' },
      ],
    },
  },

  // ─── DRUID ───────────────────────────────────────────────────────────────────
  {
    meta: {
      slug: 'druid',
      name: 'Druid',
      abbr: 'D',
      color: 'var(--c-druid)',
      colorHex: '#6b9e3a',
      gradientClass: 'class-grad-druid',
      subtitle: 'Spirit Boons · Shapeshifting · Companions · Storm · Form Selector',
      mechanic: {
        title: 'LoH Changes',
        body: 'New form selector node — pick Bear (tank) or Wolf (speed). Insatiable Fury cooldown removal for constant mobility. Spirit Boons grant passive bonuses.',
      },
      overview:
        '<strong>Pulverize (S — Mobalytics)</strong> — Werebear slam, Overpower ground pound, simple and tanky. <strong>Rabies Lacerate (S — Icy Veins)</strong> — poison DoT werewolf, infect and spread plague. <strong>Wolf Companion (A)</strong> — pack leader pet build. <strong>Cataclysm (A)</strong> — storm ultimate. <strong>Stormslide (A)</strong> — hybrid storm+shape. <strong>Tornado (A–B)</strong> — classic storm. <strong>Shred (B)</strong> — werewolf melee. <strong>Boulder (B)</strong> — wrecking ball.',
    },
    skillBars: [],
    phases: [],
    callouts: [
      {
        type: 'info',
        body: 'Game8 dropped Druid to B-tier overall due to high Pit struggles vs other classes. Still viable for all non-leaderboard content.',
      },
    ],
    gear: [],
    statPriority: {
      stats: [
        { name: 'Willpower', primary: true },
        { name: 'Crit Chance' },
        { name: 'Companion/Storm Dmg' },
        { name: 'Spirit Cost Red.' },
        { name: 'Max Life' },
      ],
    },
  },

  // ─── NECROMANCER ─────────────────────────────────────────────────────────────
  {
    meta: {
      slug: 'necromancer',
      name: 'Necromancer',
      abbr: 'N',
      color: 'var(--c-necro)',
      colorHex: '#7ab0a0',
      gradientClass: 'class-grad-necromancer',
      subtitle: 'Book of the Dead · Essence · Minions · Corpse Skills · Direct Command',
      mechanic: {
        title: 'LoH Rework',
        body: 'Largest power jump of any returning class. <strong>Direct minion control</strong> — point warriors/mages at targets. Book of the Dead keeps minions alive during sacrifice. <strong>Sever</strong> gets built-in teleport via Inexorable Reaper. Skeletal Mages → core slot. <strong>Undercrown</strong> pushes warrior cap past 20.',
      },
      overview:
        '<strong>Shadowblight (A)</strong> — no-minion Shadow DoT. Stack Blight, Corpse Explosion, Ebonpiercer, Soulrift. Trigger Shadowblight passive ASAP. Attack Speed is king. <strong>Blood Wave (A)</strong> — Kessime\'s Legacy pants, massive AoE via Blood rework. <strong>Summoner/Zerg (A)</strong> — "Lazy Necro Zerg" with 20+ warriors via Undercrown. Direct command for elite focus. Mendeln explosions chain. <strong>Bone Spirit (B)</strong> — burst single-target. <strong>Blood Lance (B)</strong> — ranged tether. <strong>Army of Dead (B)</strong> — ultimate burst. <strong>Sever (B)</strong> — fast blaster with teleport.',
    },
    skillBars: [],
    phases: [],
    callouts: [],
    gear: [],
    statPriority: {
      stats: [
        { name: 'Intelligence', primary: true },
        { name: 'Crit Chance' },
        { name: 'Attack Speed' },
        { name: 'Shadow/Blood Dmg' },
        { name: 'Essence Cost Red.' },
        { name: 'Max Life' },
      ],
    },
  },

  // ─── SPIRITBORN ──────────────────────────────────────────────────────────────
  {
    meta: {
      slug: 'spiritborn',
      name: 'Spiritborn',
      abbr: 'SB',
      color: 'var(--c-spiritborn)',
      colorHex: '#d98a30',
      gradientClass: 'class-grad-spiritborn',
      subtitle: 'Spirit Hall · Vigor · Guardian Spirits · Evade Mechanics',
      mechanic: {
        title: 'Spirit Hall',
        body: 'Primary + Secondary Guardian. <strong>Gorilla</strong> — all skills = Gorilla, Thorn damage, Barrier on attack. <strong>Eagle</strong> — evade resets, movement. <strong>Jaguar</strong> — max Ferocity, kill speed. <strong>Centipede</strong> — poison, sustain.',
      },
      overview:
        'Under-the-radar this expansion. <strong>Evade Eagle (A)</strong> — evade spam with constant resets, Poison variant pushes high Pit. <strong>Quill Volley (A)</strong> — Rod of Kepeleke makes it Basic+Core. Gorilla primary + Jaguar secondary. Speed-farming king. <strong>Payback (A)</strong> — counter-based Gorilla tank. <strong>Rock Splitter (Leveling)</strong> — best Spiritborn leveler per Mobalytics.',
    },
    skillBars: [],
    phases: [],
    callouts: [
      {
        type: 'info',
        body: 'Thunder Spike evade reset mechanic may have been relocated. Watch hotfix notes.',
      },
    ],
    gear: [],
    statPriority: {
      stats: [
        { name: 'Dexterity', primary: true },
        { name: 'Crit Chance' },
        { name: 'Attack Speed' },
        { name: 'Vigor Cost Red.' },
        { name: 'Max Life' },
      ],
    },
  },
];

// Record keyed by slug for easy lookup
export const classData: Record<D4Class, ClassPageData> = Object.fromEntries(
  CLASS_DATA.map((c) => [c.meta.slug, c])
) as Record<D4Class, ClassPageData>;
