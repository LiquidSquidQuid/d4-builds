'use client';

import { useState, useEffect } from 'react';
import type { StatWeightResult } from '@/lib/calc/types';

interface TheLoomProps {
  result: StatWeightResult | null;
  isCalculating: boolean;
  onCalculate: () => void;
}

type SortMode = 'dps' | 'ehp' | 'combined';

export default function TheLoom({ result, isCalculating, onCalculate }: TheLoomProps) {
  const [mode, setMode] = useState<SortMode>('dps');
  const [lockedStat, setLockedStat] = useState<string | null>(null);

  useEffect(() => {
    if (!result && !isCalculating) onCalculate();
  }, [result, isCalculating, onCalculate]);

  if (isCalculating || !result) {
    return (
      <div className="loom">
        <div className="loom-canvas" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', color: 'var(--vellum-dim)' }}>
            {isCalculating ? 'Weaving the loom…' : 'Add stats to begin weaving.'}
          </p>
        </div>
      </div>
    );
  }

  const sorted = [...result.weights].sort((a, b) => {
    if (mode === 'dps') return b.dpsPercentGain - a.dpsPercentGain;
    if (mode === 'ehp') return b.ehpPercentGain - a.ehpPercentGain;
    return (b.dpsPercentGain + b.ehpPercentGain) - (a.dpsPercentGain + a.ehpPercentGain);
  });

  const maxGain = sorted[0]
    ? (mode === 'dps' ? sorted[0].dpsPercentGain : mode === 'ehp' ? sorted[0].ehpPercentGain : sorted[0].dpsPercentGain + sorted[0].ehpPercentGain)
    : 1;

  return (
    <div className="loom">
      <div className="loom-canvas">
        {sorted.map((w) => {
          const gain = mode === 'dps' ? w.dpsPercentGain : mode === 'ehp' ? w.ehpPercentGain : w.dpsPercentGain + w.ehpPercentGain;
          const widthPct = maxGain > 0 ? Math.round((gain / maxGain) * 100) : 0;
          const heightPx = Math.max(3, Math.min(9, Math.round((gain / maxGain) * 9)));
          const isLocked = lockedStat === w.stat;

          return (
            <div
              key={w.stat}
              className={`loom-row${isLocked ? ' locked' : ''}`}
              onClick={() => setLockedStat(isLocked ? null : w.stat)}
              role="button"
              tabIndex={0}
              aria-label={`${w.label}: ${gain.toFixed(1)}% gain`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLockedStat(isLocked ? null : w.stat);
                }
              }}
            >
              <div className="loom-name">{w.label}</div>
              <div className="loom-thread">
                <div className="loom-warp" />
                <div
                  className="loom-weft"
                  style={{ width: `${widthPct}%`, height: `${heightPx}px` }}
                />
              </div>
              <div className="loom-val">+{gain.toFixed(1)}</div>
            </div>
          );
        })}
      </div>

      <div className="loom-side">
        <div className="loom-card">
          <div className="loom-card-lab">Locked Focus</div>
          <div className="loom-card-val">
            {lockedStat ? sorted.find(w => w.stat === lockedStat)?.label ?? '—' : 'None'}
          </div>
          <div className="loom-card-note">
            {lockedStat ? 'Click the row again to unlock.' : 'Click any row to lock it as focus.'}
          </div>
          <div className="loom-controls">
            <button className={mode === 'dps' ? 'on' : ''} onClick={() => setMode('dps')}>DPS</button>
            <button className={mode === 'ehp' ? 'on' : ''} onClick={() => setMode('ehp')}>EHP</button>
            <button className={mode === 'combined' ? 'on' : ''} onClick={() => setMode('combined')}>Both</button>
          </div>
        </div>
        <div className="loom-card">
          <div className="loom-card-lab">Method</div>
          <div className="loom-card-val">Δ +1 perturb</div>
          <div className="loom-card-note">Each weight is the marginal gain from adding +1 of that stat.</div>
        </div>
        <div className="loom-card">
          <div className="loom-card-lab">Use this for</div>
          <div className="loom-card-val" style={{ fontSize: '1.1rem' }}>Inscription</div>
          <div className="loom-card-note">When choosing between two affixes, pick the thicker thread.</div>
        </div>
      </div>
    </div>
  );
}
