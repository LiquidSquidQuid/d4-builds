import type { GearItem } from '@/lib/types/classes';

interface GearCardProps {
  item: GearItem;
}

export default function GearCard({ item }: GearCardProps) {
  return (
    <div className="gear-card card">
      <div className="gear-card-label">{item.label}</div>
      <div className="gear-card-name">{item.name}</div>
      <div className="gear-card-desc">{item.desc}</div>
    </div>
  );
}
