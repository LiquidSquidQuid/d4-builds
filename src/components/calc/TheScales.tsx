'use client';

import type { GearCompareResult, GearPiece } from '@/lib/calc/types';

interface TheScalesProps {
  result: GearCompareResult | null;
  itemA: GearPiece | null;
  itemB: GearPiece | null;
  onSetItemA: (piece: GearPiece) => void;
  onSetItemB: (piece: GearPiece) => void;
  onClear: () => void;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString();
}

function signFmt(n: number): string {
  return (n > 0 ? '+' : '') + fmt(n);
}

function GearSlotCard({ item, side }: { item: GearPiece | null; side: 'left' | 'right' }) {
  if (!item) {
    return (
      <div className={`scale-card${side === 'right' ? ' right' : ''}`}>
        <div className="scale-slot">—</div>
        <div className="scale-name" style={{ color: 'var(--vellum-faint)', fontStyle: 'italic' }}>
          No item selected
        </div>
      </div>
    );
  }

  return (
    <div className={`scale-card${side === 'right' ? ' right' : ''}`} style={{ '--c': item.isUnique ? 'var(--gold-bright)' : 'var(--ember)' } as React.CSSProperties}>
      <div className="scale-slot">{item.slot} · {side === 'left' ? 'Equipped' : 'Candidate'}</div>
      <div className="scale-name">{item.itemName}</div>
      <div className="scale-rare">{item.isUnique ? 'Unique' : 'Legendary'}</div>
      <ul>
        {item.affixes.map((a, i) => (
          <li key={i}>
            {a.label}: {a.value}{a.isGreaterAffix ? ' (GA)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TheScales({ result, itemA, itemB, onClear }: TheScalesProps) {
  // Calculate balance angle from DPS delta (capped at ±15°)
  const dpsDelta = result?.dpsDelta ?? 0;
  const angle = Math.max(-15, Math.min(15, dpsDelta / 10000));

  if (!itemA && !itemB) {
    return (
      <div className="scales">
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', color: 'var(--vellum-dim)', fontSize: '1.1rem' }}>
            Select two gear pieces to compare.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="scales">
      <div className="scale-row">
        <GearSlotCard item={itemA} side="left" />

        <div className="balance" role="img" aria-label={result ? `Balance tilts toward ${result.winner === 'A' ? 'left' : result.winner === 'B' ? 'right' : 'neither'} by ${fmt(Math.abs(dpsDelta))} DPS` : 'Balance even'}>
          <svg viewBox="0 0 240 280" aria-hidden="true">
            {/* Vertical post */}
            <line x1="120" y1="40" x2="120" y2="240" stroke="var(--gold-shadow)" strokeWidth="1" opacity=".4" />
            {/* Beam */}
            <g transform={`translate(120 140) rotate(${angle})`} style={{ transition: 'transform 0.6s ease-out' }}>
              <line x1="-100" y1="0" x2="100" y2="0" stroke="url(#scale-beam)" strokeWidth="3" strokeLinecap="round" />
              {/* Left tray */}
              <line x1="-100" y1="0" x2="-100" y2="40" stroke="var(--ember)" strokeWidth="2" opacity=".7" />
              <circle cx="-100" cy="50" r="22" fill="var(--stone)" stroke="var(--ember)" strokeWidth="1.5" />
              <text x="-100" y="56" fontFamily="Cinzel" fontSize="13" fontWeight="900" fill="var(--ember-glow)" textAnchor="middle">L</text>
              {/* Right tray */}
              <line x1="100" y1="0" x2="100" y2="40" stroke="var(--gold-bright)" strokeWidth="2" opacity=".7" />
              <circle cx="100" cy="50" r="22" fill="var(--stone)" stroke="var(--gold-bright)" strokeWidth="1.5" />
              <text x="100" y="56" fontFamily="Cinzel" fontSize="13" fontWeight="900" fill="var(--gold-bright)" textAnchor="middle">R</text>
            </g>
            {/* Pivot + base */}
            <polygon points="120,140 110,168 130,168" fill="var(--gold)" />
            <line x1="80" y1="170" x2="160" y2="170" stroke="var(--gold-deep)" strokeWidth="2" />
            <defs>
              <linearGradient id="scale-beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ff5a1f" />
                <stop offset=".5" stopColor="#c9a14a" />
                <stop offset="1" stopColor="#f0cc6a" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <GearSlotCard item={itemB} side="right" />
      </div>

      {result && (
        <div className="verdict-card">
          <div className="verdict-lab">Verdict</div>
          <div className="verdict-v">
            {result.winner === 'tie'
              ? 'The items are equivalent.'
              : <>The {result.winner === 'B' ? 'candidate' : 'equipped'} item wins by <span className="gilded-text">{signFmt(Math.abs(result.dpsDelta))} DPS · {signFmt(Math.abs(result.ehpDelta))} EHP</span>.</>
            }
          </div>
          <button
            type="button"
            onClick={onClear}
            style={{
              marginTop: 12,
              fontFamily: 'var(--f-mono)',
              fontSize: '.65rem',
              color: 'var(--vellum-faint)',
              background: 'none',
              border: '1px solid var(--gold-shadow)',
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            Clear comparison
          </button>
        </div>
      )}
    </div>
  );
}
