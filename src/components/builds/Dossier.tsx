'use client';

import { useEffect, useRef } from 'react';
import type { DpsResult, EhpResult, StatWeightResult } from '@/lib/calc/types';
import { useNumberTween } from '@/lib/hooks/useNumberTween';

interface DossierProps {
  dpsResult: DpsResult | null;
  ehpResult: EhpResult | null;
  statWeights: StatWeightResult | null;
  isCalculating: boolean;
}

interface StreamEntry {
  label: string;
  delta: number;
  kind: 'dps' | 'ehp';
  ts: number;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toFixed(0);
}

function formatDelta(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${formatNum(n)}`;
}

function RingGauge({ value, max, label, gradientId, color1, color2 }: {
  value: number;
  max: number;
  label: string;
  gradientId: string;
  color1: string;
  color2: string;
}) {
  const tweened = useNumberTween(value);
  const pct = max > 0 ? Math.min(tweened / max, 1) : 0;
  const circumference = 2 * Math.PI * 44;
  const offset = circumference * (1 - pct);

  return (
    <div className="metric">
      <div className="metric-ring" role="meter" aria-valuenow={Math.round(tweened)} aria-valuemin={0} aria-label={label}>
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(94,74,28,.4)" strokeWidth="2" />
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="metric-lab">{label}</div>
      <div className="metric-num">{formatNum(tweened)}</div>
    </div>
  );
}

export default function Dossier({ dpsResult, ehpResult, statWeights, isCalculating }: DossierProps) {
  const streamRef = useRef<StreamEntry[]>([]);
  const prevDps = useRef(0);
  const prevEhp = useRef(0);

  // Track deltas for the stream
  useEffect(() => {
    const newDps = dpsResult?.sheetDps ?? 0;
    const newEhp = ehpResult?.ehpLowest ?? 0;
    if (prevDps.current !== 0 && newDps !== prevDps.current) {
      const entry: StreamEntry = {
        label: 'DPS changed',
        delta: newDps - prevDps.current,
        kind: 'dps',
        ts: Date.now(),
      };
      streamRef.current = [entry, ...streamRef.current].slice(0, 6);
    }
    if (prevEhp.current !== 0 && newEhp !== prevEhp.current) {
      const entry: StreamEntry = {
        label: 'EHP changed',
        delta: newEhp - prevEhp.current,
        kind: 'ehp',
        ts: Date.now(),
      };
      streamRef.current = [entry, ...streamRef.current].slice(0, 6);
    }
    prevDps.current = newDps;
    prevEhp.current = newEhp;
  }, [dpsResult, ehpResult]);

  const dps = dpsResult?.sheetDps ?? 0;
  const ehp = ehpResult?.ehpLowest ?? 0;
  // Rough max estimates for gauge fill
  const dpsMax = Math.max(dps * 1.3, 1);
  const ehpMax = Math.max(ehp * 1.3, 1);

  const topWeights = statWeights?.weights.slice(0, 5) ?? [];
  const maxWeight = topWeights[0]?.dpsPercentGain ?? 1;

  return (
    <aside className="desk-right">
      <div className="dossier-eye">The Dossier · Live</div>
      <h2 className="dossier-title">
        What this build does <span className="gilded-text">right now</span>.
      </h2>
      <p className="dossier-sub">
        Every keystroke recalculates.{isCalculating && ' Calculating…'}
      </p>

      {/* Primary metrics */}
      <div className="metrics">
        <RingGauge
          value={dps}
          max={dpsMax}
          label="Sheet DPS"
          gradientId="dossier-dps"
          color1="#ff5a1f"
          color2="#f0cc6a"
        />
        <RingGauge
          value={ehp}
          max={ehpMax}
          label="EHP (Worst)"
          gradientId="dossier-ehp"
          color1="#7a9a8a"
          color2="#c9a14a"
        />
      </div>

      {/* Delta stream */}
      <div className="stream">
        <div className="stream-head">
          <div className="lab">Recent Changes</div>
        </div>
        {streamRef.current.length === 0 ? (
          <div style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', color: 'var(--vellum-faint)', fontSize: '.9rem', padding: '8px 0' }}>
            Make an edit to see live deltas.
          </div>
        ) : (
          streamRef.current.map((entry, i) => (
            <div key={i} className="stream-row">
              <div className="stream-action">{entry.label}</div>
              <div className={`stream-d ${entry.delta >= 0 ? 'up' : 'down'}`}>
                {formatDelta(entry.delta)} {entry.kind.toUpperCase()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stat weights */}
      {topWeights.length > 0 && (
        <div className="stream">
          <div className="stream-head">
            <div className="lab">Stat Priority · Live</div>
          </div>
          <div className="dossier-weights">
            {topWeights.map((w, i) => {
              const pct = maxWeight > 0 ? Math.round((w.dpsPercentGain / maxWeight) * 100) : 0;
              return (
                <div key={i} className="weight-row">
                  <div className="weight-name" style={i < 2 ? { color: 'var(--gold-bright)' } : undefined}>
                    {w.label}
                  </div>
                  <div className="weight-bar">
                    <div className="weight-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="weight-val">+{w.dpsPercentGain.toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
