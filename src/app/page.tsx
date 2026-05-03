import Hero from "@/components/landing/Hero";
import MetaSnapshot from "@/components/landing/MetaSnapshot";
import LevelingTips from "@/components/landing/LevelingTips";
import EndgameChecklist from "@/components/landing/EndgameChecklist";
import ClassSection from "@/components/class/ClassSection";
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
  return (
    <>
      <Hero />
      <MetaSnapshot tiers={tierData} />
      <LevelingTips tips={tipsData} />

      {CLASS_ORDER.map((slug) => (
        <ClassSection key={slug} data={classData[slug]} />
      ))}

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
