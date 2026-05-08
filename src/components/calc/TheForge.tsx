'use client';

import type { DpsResult, DpsInput } from '@/lib/calc/types';

interface TheForgeProps {
  result: DpsResult;
  input: DpsInput;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString();
}

function formatShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return fmt(n);
}

interface WfRow {
  label: string;
  value: number;
  multiplier?: string;
  type: 'base' | 'gain' | 'loss' | 'final';
  pct: number; // bar width percentage
}

export default function TheForge({ result, input }: TheForgeProps) {
  const { breakdown } = result;
  const maxVal = result.sheetDps;

  // Build waterfall rows from the breakdown
  const weaponDmg = breakdown.weaponAvgDamage;
  const skillMult = breakdown.skillMultiplier;
  const mainStatMult = breakdown.mainStatMultiplier;
  const addMult = breakdown.additiveMultiplier;
  const globalProd = breakdown.globalMultiplierProduct;
  const critMult = breakdown.critWeightedMultiplier;

  const baseDmg = weaponDmg * skillMult * mainStatMult;
  const afterAdd = baseDmg * addMult;
  const afterGlobal = afterAdd * globalProd;
  const afterCrit = afterGlobal * critMult;

  const rows: WfRow[] = [
    { label: 'Weapon DPS', value: weaponDmg, type: 'base', pct: maxVal > 0 ? (weaponDmg / maxVal) * 100 : 10 },
    { label: 'Skill ×', value: baseDmg, multiplier: `×${skillMult.toFixed(2)}`, type: 'gain', pct: maxVal > 0 ? (baseDmg / maxVal) * 100 : 20 },
    { label: 'Main Stat', value: baseDmg * mainStatMult / skillMult, multiplier: `×${mainStatMult.toFixed(2)}`, type: 'gain', pct: maxVal > 0 ? ((baseDmg * mainStatMult / skillMult) / maxVal) * 100 : 30 },
    { label: 'Additive', value: afterAdd, multiplier: `×${addMult.toFixed(2)}`, type: 'gain', pct: maxVal > 0 ? (afterAdd / maxVal) * 100 : 50 },
    { label: 'Global ×', value: afterGlobal, multiplier: `×${globalProd.toFixed(2)}`, type: 'gain', pct: maxVal > 0 ? (afterGlobal / maxVal) * 100 : 70 },
    { label: 'Crit (Avg)', value: afterCrit, multiplier: `×${critMult.toFixed(2)}`, type: 'gain', pct: maxVal > 0 ? (afterCrit / maxVal) * 100 : 85 },
  ];

  if (input.enemyDrMultiplier < 1) {
    rows.push({
      label: 'Enemy DR',
      value: result.effectiveDpsVsArmor,
      multiplier: `×${input.enemyDrMultiplier.toFixed(2)}`,
      type: 'loss',
      pct: maxVal > 0 ? (result.effectiveDpsVsArmor / maxVal) * 100 : 80,
    });
  }

  rows.push({
    label: 'Sheet DPS',
    value: result.sheetDps,
    type: 'final',
    pct: 100,
  });

  // Gauge
  const circumference = 2 * Math.PI * 44;
  const gaugePct = 0.78; // approximate fill
  const gaugeOffset = circumference * (1 - gaugePct);

  return (
    <div className="forge">
      <div className="waterfall">
        {rows.map((row, i) => {
          const barClass = `wf-bar-fill ${row.type}`;
          const isLast = row.type === 'final';

          if (isLast) {
            return (
              <div key={i}>
                <div className="wf-divider" />
                <div className="wf-final-row">
                  <div className="wf-final-label">Sheet DPS · Single Target</div>
                  <div className="wf-final-val">{fmt(row.value)}</div>
                </div>
              </div>
            );
          }

          return (
            <div key={i} className="wf-row">
              <div className="wf-label">{row.label}</div>
              <div className="wf-bar-track">
                <div className={barClass} style={{ width: `${Math.min(row.pct, 100)}%` }} />
                {row.multiplier && (
                  <span className="wf-multiplier">{row.multiplier}</span>
                )}
              </div>
              <div className={`wf-val${row.type === 'gain' ? ' gain' : ''}${row.type === 'loss' ? ' loss' : ''}`}>
                {row.type === 'loss' ? `−${fmt(Math.abs(result.sheetDps - row.value))}` : fmt(row.value)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="forge-side">
        <div className="gauge-card">
          <div className="gauge" role="meter" aria-valuenow={Math.round(result.sheetDps)} aria-label="Sheet DPS gauge">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(94,74,28,.4)" strokeWidth="2" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="url(#forge-gauge)"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={gaugeOffset}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="forge-gauge" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ff5a1f" />
                  <stop offset="1" stopColor="#f0cc6a" />
                </linearGradient>
              </defs>
            </svg>
            <div className="gauge-center">
              <div className="gauge-num">{formatShort(result.sheetDps)}</div>
              <div className="gauge-lab">Sheet DPS</div>
            </div>
          </div>
        </div>

        <div className="legend">
          <div className="legend-row"><div className="legend-sw base" /><div className="legend-text"><strong>Base</strong> — weapon and skill before multipliers.</div></div>
          <div className="legend-row"><div className="legend-sw gain" /><div className="legend-text"><strong>Gain</strong> — multiplicative bonus from a stat or aspect.</div></div>
          <div className="legend-row"><div className="legend-sw loss" /><div className="legend-text"><strong>Loss</strong> — incoming DR, resists, falloff.</div></div>
          <div className="legend-row"><div className="legend-sw final" /><div className="legend-text"><strong>Final</strong> — what lands on the elite.</div></div>
        </div>
      </div>
    </div>
  );
}
