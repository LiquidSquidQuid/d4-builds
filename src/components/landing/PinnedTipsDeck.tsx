'use client';

import { useEffect, useRef, useState } from 'react';
import type { TipData } from '@/lib/types/classes';
import { registerPinnedSection, unregisterPinnedSection } from '@/lib/scroll-engine';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

interface PinnedTipsDeckProps {
  tips: TipData[];
}

export default function PinnedTipsDeck({ tips }: PinnedTipsDeckProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Reduced motion: don't pin
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    registerPinnedSection(el, tips.length, setActiveIdx);
    return () => unregisterPinnedSection(el);
  }, [tips.length]);

  return (
    <div
      className="tips-pinned"
      ref={wrapperRef}
      id="tips"
      data-nav-target="tips"
      style={{ height: `${tips.length * 100}vh` }}
    >
      <div className="tips-stage">
        {/* Ghost watermark numeral */}
        <div className="tips-watermark" aria-hidden="true">
          {ROMAN[activeIdx] ?? ''}
        </div>

        {/* Tip cards */}
        {tips.map((tip, i) => (
          <div
            key={i}
            className={`tip-pin ${i === activeIdx ? 'is-active' : ''}`}
          >
            <div className="tip-pin-num">{ROMAN[i]}</div>
            <div className="tip-pin-rule" />
            <div
              className="tip-pin-body"
              dangerouslySetInnerHTML={{ __html: tip.body }}
            />
          </div>
        ))}

        {/* Progress ticks */}
        <div className="tips-ticks">
          {tips.map((_, i) => (
            <div
              key={i}
              className={`tips-tick ${
                i === activeIdx ? 'tips-tick-active' : i < activeIdx ? 'tips-tick-past' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
