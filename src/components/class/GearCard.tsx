import type { GearItem } from '@/lib/types/classes';

interface GearCardProps {
  item: GearItem;
  rarity?: 'legendary' | 'unique' | 'mythic';
  affixes?: { name: string; greater?: boolean }[];
}

export default function GearCard({ item, rarity, affixes }: GearCardProps) {
  const rarityClass = rarity ?? '';

  return (
    <div className={`gear-card-v2 ${rarityClass}`}>
      <div className="slot">{item.label}</div>
      <div className="name">{item.name}</div>
      {affixes && affixes.length > 0 ? (
        <ul>
          {affixes.map((affix, i) => (
            <li key={i} className={affix.greater ? 'greater' : ''}>
              {affix.name}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{
          fontFamily: 'var(--f-body)',
          fontSize: '.95rem',
          color: 'var(--vellum-dim)',
          fontStyle: 'italic',
          lineHeight: 1.45,
        }}>
          {item.desc}
        </p>
      )}
    </div>
  );
}
