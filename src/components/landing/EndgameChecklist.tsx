import type { EndgameStep } from '@/lib/types/classes';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface EndgameChecklistProps {
  steps: EndgameStep[];
}

export default function EndgameChecklist({ steps }: EndgameChecklistProps) {
  return (
    <section className="section" id="endgame">
      <div className="container">
        <ScrollReveal>
          <p className="section-label">Post Level 70</p>
          <h2 className="section-title">Endgame Progression</h2>
        </ScrollReveal>

        <ScrollReveal>
          <ol className="checklist stagger-group">
            {steps.map((step, index) => (
              <li key={index}>{step.text}</li>
            ))}
          </ol>
        </ScrollReveal>
      </div>
    </section>
  );
}
