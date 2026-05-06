import type { TipData } from '@/lib/types/classes';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface LevelingTipsProps {
  tips: TipData[];
}

export default function LevelingTips({ tips }: LevelingTipsProps) {
  return (
    <section className="section" id="tips">
      <div className="container">
        <ScrollReveal>
          <span className="eyebrow">II &middot; The Common Wisdom</span>
          <h2 className="section-title">Leveling &amp; Systems Guide</h2>
        </ScrollReveal>

        <div className="stagger-group">
          {tips.map((tip, index) => (
            <ScrollReveal key={index}>
              <div className="phase-block">
                <div
                  className="phase-body"
                  dangerouslySetInnerHTML={{ __html: tip.body }}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
