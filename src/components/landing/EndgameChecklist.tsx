import type { EndgameStep } from '@/lib/types/classes';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface EndgameChecklistProps {
  steps: EndgameStep[];
}

export default function EndgameChecklist({ steps }: EndgameChecklistProps) {
  return (
    <section className="section" id="endgame" data-nav-target="endgame">
      <div className="container">
        <ScrollReveal>
          <span className="eyebrow">III &middot; The Long Road Ahead</span>
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
