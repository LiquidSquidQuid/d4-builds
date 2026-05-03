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
    <section className="section" id="meta">
      <div className="container">
        <ScrollReveal>
          <p className="section-label">Season 13 · Consensus Tier List</p>
          <h2 className="section-title">Meta Snapshot</h2>
          <p className="section-desc">
            Rankings aggregated from 6+ sources. Builds listed by cross-source consensus.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <table className="tier-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Build</th>
                <th>Class</th>
                <th>Playstyle</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((entry, index) => {
                if (entry.isBTier) {
                  return (
                    <tr key={index}>
                      <td style={{ color: '#a0a0a0' }}>B</td>
                      <td colSpan={3} style={{ color: 'var(--vellum-dim)' }}>
                        {entry.build}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={index}>
                    <td style={{ color: entry.tierColor, fontWeight: entry.tierWeight }}>
                      {entry.tier}
                    </td>
                    <td style={{ color: 'var(--vellum-bright)' }}>{entry.build}</td>
                    <td style={{ color: CLASS_COLORS[entry.classSlug] }}>{entry.className}</td>
                    <td style={{ color: 'var(--vellum-dim)' }}>{entry.playstyle}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollReveal>
      </div>
    </section>
  );
}
