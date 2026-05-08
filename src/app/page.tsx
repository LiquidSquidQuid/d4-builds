import Hero from "@/components/landing/Hero";
import MetaSnapshot from "@/components/landing/MetaSnapshot";
import PinnedTipsDeck from "@/components/landing/PinnedTipsDeck";
import PinnedClassShowcase from "@/components/landing/PinnedClassShowcase";
import EndgameChecklist from "@/components/landing/EndgameChecklist";
import ScrollReveal from "@/components/ui/ScrollReveal";

import { classData } from "@/lib/constants/classes";
import { tierData } from "@/lib/constants/tier-data";
import { tipsData } from "@/lib/constants/tips-data";
import { endgameSteps } from "@/lib/constants/endgame-data";
import { sourceLinks } from "@/lib/constants/sources";

import type { D4Class } from "@/lib/types/classes";

const CLASS_ORDER: D4Class[] = [
  'barbarian',
  'warlock',
  'paladin',
  'rogue',
  'sorcerer',
  'druid',
  'necromancer',
  'spiritborn',
];

export default function Home() {
  const classEntries = CLASS_ORDER.map(slug => ({ slug, data: classData[slug] }));

  return (
    <>
      <Hero />
      <div className="rule with-mark"><span className="rule-mark" /></div>
      <MetaSnapshot tiers={tierData} />
      <div className="rule" />
      <PinnedTipsDeck tips={tipsData} />
      <div className="rule with-mark"><span className="rule-mark" /></div>
      <PinnedClassShowcase classes={classEntries} />
      <div className="rule with-mark"><span className="rule-mark" /></div>
      <EndgameChecklist steps={endgameSteps} />

      <section className="section">
        <div className="container">
          <ScrollReveal>
            <h2 className="section-title">Source Links</h2>
            <table className="link-table">
              <tbody>
                {sourceLinks.map((link) => (
                  <tr key={link.name}>
                    <td>{link.name}</td>
                    <td>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {new URL(link.url).hostname}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
