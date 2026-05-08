'use client';

import type { EhpResult, EhpInput } from '@/lib/calc/types';

interface TheCrucibleProps {
  result: EhpResult;
  input: EhpInput;
}

const ELEMENTS = [
  { key: 'physical', label: 'Physical', glyph: '⊕', c1: '#c8c8d8', c2: '#9090a8' },
  { key: 'fire', label: 'Fire', glyph: '∴', c1: 'var(--ember-glow)', c2: 'var(--ember-deep)' },
  { key: 'cold', label: 'Cold', glyph: '≈', c1: '#c0e8e0', c2: '#5a8a8a' },
  { key: 'lightning', label: 'Lightning', glyph: '⚡', c1: '#d0c0e8', c2: '#7a5aa8' },
  { key: 'poison', label: 'Poison', glyph: '☠', c1: '#a8c0a0', c2: '#5a7a4a' },
];

function fmt(n: number): string {
  if (n === Infinity) return '∞';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return Math.round(n).toLocaleString();
}

export default function TheCrucible({ result }: TheCrucibleProps) {
  // Get EHP per element
  const ehpValues = ELEMENTS.map((el) => ({
    ...el,
    ehp: el.key === 'physical' ? result.ehpPhysical : (result.ehpByElement[el.key] ?? 0),
  }));

  const maxEhp = Math.max(...ehpValues.map(e => e.ehp === Infinity ? 0 : e.ehp), 1);
  const weakest = ehpValues.reduce((a, b) => (a.ehp < b.ehp ? a : b));

  return (
    <div className="crucible">
      <div className="phials">
        {ehpValues.map((el) => {
          const isWeakest = el.key === weakest.key;
          const heightPct = el.ehp === Infinity ? 100 : Math.round((el.ehp / maxEhp) * 100);

          return (
            <div key={el.key} className={`phial${isWeakest ? ' weakest' : ''}`}>
              <div className="phial-glyph" style={{ color: el.c1 }}>{el.glyph}</div>
              <div className={`phial-name${isWeakest ? ' weak' : ''}`}>{el.label}</div>
              <div
                className="phial-tube"
                role="meter"
                aria-valuenow={Math.round(el.ehp)}
                aria-label={`EHP vs ${el.label}`}
              >
                <div
                  className="phial-fill"
                  style={{
                    height: `${heightPct}%`,
                    background: `linear-gradient(180deg, ${el.c1}, ${el.c2})`,
                  }}
                />
              </div>
              <div className={`phial-val${isWeakest ? ' weak-val' : ''}`}>{fmt(el.ehp)}</div>
            </div>
          );
        })}
      </div>

      <div className="soft-spot">
        <div className="soft-spot-lab">Soft Spot · {weakest.label}</div>
        <h3 className="soft-spot-title">You break in {weakest.label.toLowerCase()}.</h3>
        <p className="soft-spot-body">
          This element passes through your defenses more easily than the others.
          Consider adding {weakest.label} resistance or related damage reduction.
        </p>
        <div className="soft-spot-val">
          <span>Weakest EHP</span>
          <span className="soft-spot-num">{fmt(weakest.ehp)}</span>
        </div>
      </div>
    </div>
  );
}
