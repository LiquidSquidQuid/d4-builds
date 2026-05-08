import type { TierEntry } from '@/lib/types/classes';
import ScrollReveal from '@/components/ui/ScrollReveal';

const CLASS_COLORS: Record<string, string> = {
  barbarian: 'var(--c-barb)',
  warlock: 'var(--c-warlock)',
  paladin: 'var(--c-paladin)',
  rogue: 'var(--c-rogue)',
  sorcerer: 'var(--c-sorc)',
  druid: 'var(--c-druid)',
  necromancer: 'var(--c-necro)',
  spiritborn: 'var(--c-spiritborn)',
};

interface MetaSnapshotProps {
  tiers: TierEntry[];
}

export default function MetaSnapshot({ tiers }: MetaSnapshotProps) {
  return (
    <section className="section" id="meta" data-nav-target="meta">
      <div className="container">
        <ScrollReveal>
          <span className="eyebrow">I &middot; Season 13 &middot; Consensus Tier List</span>
          <h2 className="section-title">Meta Snapshot</h2>
          <p className="section-desc">
            Rankings aggregated from 6+ sources. Builds listed by cross-source consensus.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="ledger">
            {tiers.map((entry, index) => {
              if (entry.isBTier) {
                return (
                  <div key={index} className="ledger-row" style={{ borderLeftColor: 'var(--vellum-faint)' }}>
                    <div className="ledger-rank" style={{ color: 'var(--vellum-dim)' }}>B</div>
                    <div className="ledger-build" style={{ color: 'var(--vellum-dim)' }}>{entry.build}</div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className="ledger-row"
                  style={{ borderLeftColor: CLASS_COLORS[entry.classSlug] }}
                >
                  <div className="ledger-rank" style={{ color: entry.tierColor }}>{entry.tier}</div>
                  <div className="ledger-build">{entry.build}</div>
                  <div className="ledger-class" style={{ color: CLASS_COLORS[entry.classSlug] }}>{entry.className}</div>
                  <div className="ledger-meta">{entry.playstyle}</div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
