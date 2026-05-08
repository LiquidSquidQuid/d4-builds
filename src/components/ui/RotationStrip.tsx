interface RotationSlot {
  name: string;
  meta?: string;
  tag?: string;
  icon?: string;
  active?: boolean;
}

interface RotationStripProps {
  slots: RotationSlot[];
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export default function RotationStrip({ slots }: RotationStripProps) {
  return (
    <div className="rotation" role="list" aria-label="Skill rotation">
      {slots.map((slot, i) => (
        <div
          key={i}
          className={`rot-slot${slot.active ? ' active' : ''}`}
          role="listitem"
          aria-current={slot.active ? 'true' : undefined}
        >
          <div className="rot-num">{ROMAN[i] ?? (i + 1)}</div>
          <div className="rot-icon">{slot.icon ?? '◆'}</div>
          <div className="rot-name">{slot.name}</div>
          {slot.meta && <div className="rot-meta">{slot.meta}</div>}
          {slot.tag && <div className="rot-tag">{slot.tag}</div>}
        </div>
      ))}
    </div>
  );
}
