import type { PhaseData } from '@/lib/types/classes';

interface PhaseBlockProps {
  phase: PhaseData;
  colorVar: string;
}

export default function PhaseBlock({ phase, colorVar }: PhaseBlockProps) {
  return (
    <div className="phase-block card">
      <div className="phase-header">
        <div
          className="phase-number"
          style={{
            background: `rgba(0, 0, 0, 0.3)`,
            color: colorVar,
            border: `1px solid ${colorVar}`,
          }}
        >
          {phase.number}
        </div>
        <span className="phase-title">{phase.title}</span>
        <span className="phase-levels">{phase.levels}</span>
      </div>
      <div
        className="phase-body"
        dangerouslySetInnerHTML={{ __html: phase.body }}
      />
    </div>
  );
}
