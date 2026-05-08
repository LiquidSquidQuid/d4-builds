'use client';

import type { ClassPageData } from '@/lib/types/classes';
import ScrollReveal from '@/components/ui/ScrollReveal';
import CalloutBox from '@/components/ui/CalloutBox';
import ClassSigil from '@/components/ui/ClassSigil';
import RotationStrip from '@/components/ui/RotationStrip';
import GearCard from '@/components/class/GearCard';
import PhaseBlock from '@/components/class/PhaseBlock';
import StatPriority from '@/components/class/StatPriority';

interface ClassSectionProps {
  data: ClassPageData;
}

export default function ClassSection({ data }: ClassSectionProps) {
  const { meta, skillBars, phases, callouts, gear, statPriority } = data;

  // Build rotation slots from the first skill bar (active rotation)
  const rotationBar = skillBars[0];
  const rotationSlots = rotationBar
    ? rotationBar.skills.map((skill, i) => ({
        name: skill.name,
        tag: skill.label,
        // Mark the "Core" skill as active (spam slot)
        active: skill.label === 'Core',
        icon: undefined,
      }))
    : [];

  return (
    <section
      className={`class-section ${meta.gradientClass}`}
      id={meta.slug}
      style={{ '--class-color': meta.colorHex } as React.CSSProperties}
    >
      {/* ── CHAPTER PLATE ── */}
      <header className="chapter-plate">
        <div className="container">
          <div className="chapter-plate-grid">
            <div>
              <div className="chapter-roman">I</div>
              <span className="caps-s" style={{ color: meta.color, letterSpacing: '.32em', fontSize: '.62rem' }}>
                The {meta.name}
              </span>
              <h1 className="chapter-title" style={{ marginTop: 10 }}>
                The <span className="gilded-text" style={{
                  background: `linear-gradient(180deg, ${meta.colorHex}, ${meta.colorHex}cc)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>{meta.name}</span>.
              </h1>
              <p className="chapter-sub">{meta.subtitle}</p>
            </div>
            <div className="sigil-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClassSigil abbr={meta.abbr} color={meta.colorHex} size={340} />
            </div>
          </div>
        </div>

        {/* Meta strip */}
        <div className="container">
          <div className="chapter-meta">
            <div className="chapter-meta-cell">
              <div className="lab">Class</div>
              <div className="val">{meta.name}</div>
            </div>
            <div className="chapter-meta-cell">
              <div className="lab">Archetype</div>
              <div className="val">{meta.subtitle.split('·')[0]?.trim() ?? '—'}</div>
            </div>
            <div className="chapter-meta-cell">
              <div className="lab">Mechanic</div>
              <div className="val">{meta.mechanic.title.replace('Class Mechanic: ', '')}</div>
            </div>
            <div className="chapter-meta-cell">
              <div className="lab">Style</div>
              <div className="val">{meta.subtitle.split('·').slice(1, 3).join(' · ').trim() || '—'}</div>
            </div>
            <div className="chapter-meta-cell">
              <div className="lab">Season</div>
              <div className="val">XIII</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── FOLIO I — OVERVIEW + MECHANIC ── */}
      <section className="folio" id="overview">
        <div className="container">
          <div className="folio-head">
            <div className="folio-num">I</div>
            <div>
              <span className="eyebrow" style={{ marginBottom: 4 }}>Overview</span>
              <div className="folio-title">The common wisdom.</div>
              <div className="folio-sub">Why this build earns its place this season.</div>
            </div>
          </div>

          <ScrollReveal>
            <div className="overview-grid">
              <div className="overview-text">
                <p dangerouslySetInnerHTML={{ __html: meta.overview }} />
              </div>
              <aside className="mechanic-plate">
                <div className="lab">The Mechanic</div>
                <h3>{meta.mechanic.title.replace('Class Mechanic: ', '')}</h3>
                <p className="body">{meta.mechanic.body}</p>
              </aside>
            </div>
          </ScrollReveal>

          {/* Callouts */}
          {callouts.map((callout, i) => (
            <ScrollReveal key={i}>
              <CalloutBox type={callout.type} label={callout.label}>
                <span dangerouslySetInnerHTML={{ __html: callout.body }} />
              </CalloutBox>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── FOLIO II — ROTATION ── */}
      {rotationSlots.length > 0 && (
        <section className="folio" id="rotation">
          <div className="container">
            <div className="folio-head">
              <div className="folio-num">II</div>
              <div>
                <span className="eyebrow" style={{ marginBottom: 4 }}>Rotation</span>
                <div className="folio-title">{rotationBar?.title ?? 'The six slots.'}</div>
                <div className="folio-sub">Active skill rotation — cycle on cooldown.</div>
              </div>
            </div>

            <ScrollReveal>
              <RotationStrip slots={rotationSlots} />
            </ScrollReveal>

            {/* Additional skill bars (passives, etc.) */}
            {skillBars.slice(1).map((bar, i) => (
              <ScrollReveal key={i}>
                <h3 className="sub-heading" style={{ marginTop: 48 }}>{bar.title}</h3>
                <div className="skill-bar">
                  {bar.skills.map((skill, j) => (
                    <div key={j} className="skill-slot">
                      <span className="skill-slot-label">{skill.label}</span>
                      <span className="skill-slot-name">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      <div className="rule with-mark"><span className="rule-mark" /></div>

      {/* ── FOLIO III — PHASES ── */}
      {phases && phases.length > 0 && (
        <section className="folio" id="phases">
          <div className="container">
            <div className="folio-head">
              <div className="folio-num">III</div>
              <div>
                <span className="eyebrow" style={{ marginBottom: 4 }}>Phases</span>
                <div className="folio-title">The long road.</div>
                <div className="folio-sub">Each phase has its own sub-rotation.</div>
              </div>
            </div>

            {phases.map((phase, i) => (
              <PhaseBlock
                key={i}
                phase={phase}
                direction={i % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        </section>
      )}

      <div className="rule" />

      {/* ── FOLIO IV — GEAR ── */}
      {gear.length > 0 && (
        <section className="folio" id="gear">
          <div className="container">
            <div className="folio-head">
              <div className="folio-num">IV</div>
              <div>
                <span className="eyebrow" style={{ marginBottom: 4 }}>Gear</span>
                <div className="folio-title">Key pieces for the climb.</div>
                <div className="folio-sub">Aspects in italics. Greater affixes in gold.</div>
              </div>
            </div>

            <ScrollReveal>
              <div className="gear-ledger">
                {gear.map((item, i) => (
                  <GearCard key={i} item={item} rarity="legendary" />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <div className="rule" />

      {/* ── FOLIO V — STAT PRIORITY ── */}
      {statPriority.stats.length > 0 && (
        <section className="folio" id="stats">
          <div className="container">
            <div className="folio-head">
              <div className="folio-num">V</div>
              <div>
                <span className="eyebrow" style={{ marginBottom: 4 }}>Priority</span>
                <div className="folio-title">What every affix is worth.</div>
                <div className="folio-sub">Bars sized by marginal gain.</div>
              </div>
            </div>

            <ScrollReveal>
              <StatPriority stats={statPriority.stats} />
            </ScrollReveal>
          </div>
        </section>
      )}
    </section>
  );
}
