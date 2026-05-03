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

export default function ClassSection({ data }: ClassSectionProps) {
  const { meta, skillBars, phases, callouts, gear, statPriority } = data;

  return (
    <section
      className={`class-section ${meta.gradientClass}`}
      id={meta.slug}
    >
      <div className="container">

        {/* Class header */}
        <ScrollReveal>
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
          <div className="mechanic-box">
            <h4>{meta.mechanic.title}</h4>
            <p>{meta.mechanic.body}</p>
          </div>
        </ScrollReveal>

        {/* Overview */}
        <ScrollReveal>
          <p
            className="class-overview"
            dangerouslySetInnerHTML={{ __html: meta.overview }}
          />
        </ScrollReveal>

        {/* Skill bars */}
        {skillBars.map((bar, index) => (
          <ScrollReveal key={index}>
            <SkillBar title={bar.title} skills={bar.skills} />
          </ScrollReveal>
        ))}

        {/* Callouts */}
        {callouts.map((callout, index) => (
          <ScrollReveal key={index}>
            <CalloutBox type={callout.type} label={callout.label}>
              <span dangerouslySetInnerHTML={{ __html: callout.body }} />
            </CalloutBox>
          </ScrollReveal>
        ))}

        {/* Leveling phases */}
        {phases && phases.length > 0 && (
          <>
            <ScrollReveal>
              <h3 className="sub-heading">Leveling Phases</h3>
            </ScrollReveal>
            <div className="stagger-group">
              {phases.map((phase, index) => (
                <ScrollReveal key={index}>
                  <PhaseBlock phase={phase} colorVar={meta.color} />
                </ScrollReveal>
              ))}
            </div>
          </>
        )}

        {/* Gear grid */}
        {gear.length > 0 && (
          <>
            <ScrollReveal>
              <h3 className="sub-heading">Key Gear</h3>
            </ScrollReveal>
            <ScrollReveal>
              <div className="gear-grid">
                {gear.map((item, index) => (
                  <GearCard key={index} item={item} />
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
