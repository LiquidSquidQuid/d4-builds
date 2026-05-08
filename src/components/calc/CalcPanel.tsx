'use client';

import { useState } from 'react';
import type {
  DpsResult,
  EhpResult,
  DpsInput,
  EhpInput,
  StatWeightResult,
  GearPiece,
  GearCompareResult,
} from '@/lib/calc/types';
import TheForge from './TheForge';
import TheCrucible from './TheCrucible';
import TheLoom from './TheLoom';
import TheScales from './TheScales';

type CalcTab = 'forge' | 'crucible' | 'loom' | 'scales';

interface CalcPanelProps {
  dpsResult: DpsResult | null;
  ehpResult: EhpResult | null;
  dpsInput: DpsInput | null;
  ehpInput: EhpInput | null;
  isCalculating: boolean;
  statWeights: StatWeightResult | null;
  statWeightsCalculating: boolean;
  onCalculateStatWeights: () => void;
  gearCompareResult: GearCompareResult | null;
  gearItemA: GearPiece | null;
  gearItemB: GearPiece | null;
  onSetGearA: (piece: GearPiece) => void;
  onSetGearB: (piece: GearPiece) => void;
  onClearGearCompare: () => void;
}

const INSTRUMENTS: { key: CalcTab; num: string; name: string; tagline: string; glyph: string }[] = [
  { key: 'forge', num: 'I', name: 'The Forge', tagline: 'Damage as a waterfall.', glyph: '⟡' },
  { key: 'crucible', num: 'II', name: 'The Crucible', tagline: 'Five phials, one per element.', glyph: '⫶' },
  { key: 'loom', num: 'III', name: 'The Loom', tagline: 'Stat weights as warp threads.', glyph: '⌖' },
  { key: 'scales', num: 'IV', name: 'The Scales', tagline: 'Two pieces weighed.', glyph: '⊟' },
];

export default function CalcPanel({
  dpsResult,
  ehpResult,
  dpsInput,
  ehpInput,
  isCalculating,
  statWeights,
  statWeightsCalculating,
  onCalculateStatWeights,
  gearCompareResult,
  gearItemA,
  gearItemB,
  onSetGearA,
  onSetGearB,
  onClearGearCompare,
}: CalcPanelProps) {
  const [activeTab, setActiveTab] = useState<CalcTab>('forge');
  const hasData = dpsResult || ehpResult;

  return (
    <div className="calc-panel">
      {/* Instrument tabs */}
      <div className="instruments" role="tablist" aria-label="Calc instruments">
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.key}
            className={`inst${activeTab === inst.key ? ' active' : ''}`}
            role="tab"
            aria-selected={activeTab === inst.key}
            aria-controls={`panel-${inst.key}`}
            onClick={() => setActiveTab(inst.key)}
          >
            <div className="inst-num">{inst.num}</div>
            <div className="inst-name">{inst.name}</div>
            <div className="inst-tagline">{inst.tagline}</div>
            <div className="inst-glyph">{inst.glyph}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="calc-tab-content" role="tabpanel" id={`panel-${activeTab}`}>
        {isCalculating && !hasData && (
          <div className="calc-loading">Calculating...</div>
        )}

        {!hasData && !isCalculating && (
          <div className="calc-empty">
            Add weapon stats and a skill to see calculations.
          </div>
        )}

        {activeTab === 'forge' && dpsResult && dpsInput && (
          <TheForge result={dpsResult} input={dpsInput} />
        )}

        {activeTab === 'crucible' && ehpResult && ehpInput && (
          <TheCrucible result={ehpResult} input={ehpInput} />
        )}

        {activeTab === 'loom' && (
          <TheLoom
            result={statWeights}
            isCalculating={statWeightsCalculating}
            onCalculate={onCalculateStatWeights}
          />
        )}

        {activeTab === 'scales' && (
          <TheScales
            result={gearCompareResult}
            itemA={gearItemA}
            itemB={gearItemB}
            onSetItemA={onSetGearA}
            onSetItemB={onSetGearB}
            onClear={onClearGearCompare}
          />
        )}
      </div>
    </div>
  );
}
