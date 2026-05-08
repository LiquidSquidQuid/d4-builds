import type { ClassPageData } from '@/lib/types/classes';
import ScrollReveal from '@/components/ui/ScrollReveal';
import CalloutBox from '@/components/ui/CalloutBox';
import SkillBar from '@/components/class/SkillBar';
import GearCard from '@/components/class/GearCard';
import PhaseBlock from '@/components/class/PhaseBlock';
import StatPriority from '@/components/class/StatPriority';

interface ClassSectionProps {
  data: ClassPageData;
}

export default function ClassSection({ data, index }: ClassSectionProps & { index?: number }) {
  const { meta, skillBars, phases, callouts, gear, statPriority } = data;
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  return (
    <section
      className={`class-section ${meta.gradientClass}`}
      id={meta.slug}
      data-nav-target={meta.slug}
    >
      <div className="container">

        {/* Class header */}
        <ScrollReveal>
          {index !== undefined && (
            <span className="eyebrow">{ROMAN[index]} &middot; The {meta.name}</span>
          )}
          <div className="class-header">
            <div
              className="class-icon"
              style={{ background: meta.color }}
            >
              {meta.abbr}
            </div>
            <h2
              className="class-title"
              style={{ color: meta.color }}
            >
              {meta.name}
            </h2>
          </div>
          <p className="class-subtitle">{meta.subtitle}</p>
        </ScrollReveal>

        {/* Mechanic box */}
        <ScrollReveal>
          <div className="mechanic-box card">
            <h4>{meta.mechanic.title}</h4>
            <p>{meta.mechanic.body}</p>
          </div>
        </ScrollReveal>

        <div className="rule" />

        {/* Overview */}
        <ScrollReveal>
          <p
            className="class-overview"
            dangerouslySetInnerHTML={{ __html: meta.overview }}
          />
        </ScrollReveal>

        {/* Skill bars */}
        {skillBars.map((bar, i) => (
          <ScrollReveal key={i}>
            <SkillBar title={bar.title} skills={bar.skills} />
          </ScrollReveal>
        ))}

        {/* Callouts */}
        {callouts.map((callout, i) => (
          <ScrollReveal key={i}>
            <CalloutBox type={callout.type} label={callout.label}>
              <span dangerouslySetInnerHTML={{ __html: callout.body }} />
            </CalloutBox>
          </ScrollReveal>
        ))}

        {/* Leveling phases */}
        {phases && phases.length > 0 && (
          <>
            <div className="rule" />
            <ScrollReveal>
              <h3 className="sub-heading">Leveling Phases</h3>
            </ScrollReveal>
            <div className="stagger-group">
              {phases.map((phase, i) => (
                <ScrollReveal key={i}>
                  <PhaseBlock phase={phase} colorVar={meta.color} />
                </ScrollReveal>
              ))}
            </div>
          </>
        )}

        {/* Gear grid */}
        {gear.length > 0 && (
          <>
            <div className="rule" />
            <ScrollReveal>
              <h3 className="sub-heading">Key Gear</h3>
            </ScrollReveal>
            <ScrollReveal>
              <div className="gear-grid">
                {gear.map((item, i) => (
                  <GearCard key={i} item={item} />
                ))}
              </div>
            </ScrollReveal>
          </>
        )}

        {/* Stat priority */}
        {statPriority.stats.length > 0 && (
          <ScrollReveal>
            <h3 className="sub-heading">Stat Priority</h3>
            <StatPriority stats={statPriority.stats} />
          </ScrollReveal>
        )}

      </div>
    </section>
  );
}
