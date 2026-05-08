import type { PhaseData } from '@/lib/types/classes';
import ScrollReveal from '@/components/ui/ScrollReveal';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

interface PhaseBlockProps {
  phase: PhaseData;
  colorVar?: string;
  direction?: 'left' | 'right';
}

export default function PhaseBlock({ phase, direction }: PhaseBlockProps) {
  return (
    <ScrollReveal direction={direction}>
      <div className="phase">
        <div className="phase-tag">
          <div className="phase-roman">{ROMAN[phase.number] ?? phase.number}</div>
          <div className="phase-name">{phase.title}</div>
          <div className="phase-range">{phase.levels}</div>
        </div>
        <div className="phase-body-text">
          <div dangerouslySetInnerHTML={{ __html: phase.body }} />
        </div>
      </div>
    </ScrollReveal>
  );
}
