export const GEAR_SLOTS = [
  'Helm',
  'Chest',
  'Gloves',
  'Pants',
  'Boots',
  'Amulet',
  'Ring 1',
  'Ring 2',
  'Weapon',
  'Offhand',
] as const;

export type GearSlotName = (typeof GEAR_SLOTS)[number];
