'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { D4Class, ClassPageData } from '@/lib/types/classes';
import { registerPinnedSection, unregisterPinnedSection } from '@/lib/scroll-engine';
import ClassSigil from '@/components/ui/ClassSigil';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

interface PinnedClassShowcaseProps {
  classes: { slug: D4Class; data: ClassPageData }[];
}

export default function PinnedClassShowcase({ classes }: PinnedClassShowcaseProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    registerPinnedSection(el, classes.length, setActiveIdx);
    return () => unregisterPinnedSection(el);
  }, [classes.length]);

  const activeClass = classes[activeIdx];
  const glowColor = activeClass?.data.meta.colorHex ?? '#c9a14a';

  return (
    <div
      className="classes-pinned"
      ref={wrapperRef}
      style={{ height: `${classes.length * 120}vh` }}
    >
      <div className="classes-stage">
        {/* Stage glow */}
        <div
          className="classes-stage-glow"
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor}18 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />

        {/* Card track */}
        <div className="classes-track">
          {classes.map((cls, i) => {
            const meta = cls.data.meta;
            let slideClass = '';
            if (i === activeIdx) slideClass = 'is-revealed';
            else if (i < activeIdx) slideClass = 'is-buried';

            return (
              <div
                key={cls.slug}
                className={`class-slide ${slideClass}`}
                data-glow={`${meta.colorHex}18`}
                style={{ '--slide-color': meta.color } as React.CSSProperties}
              >
                <div className="class-slide-text">
                  <div className="class-slide-num">
                    <strong>{ROMAN[i]}</strong> &middot; The {meta.name}
                  </div>
                  <h3 className="class-slide-name" style={{ color: meta.colorHex }}>
                    {meta.name}
                  </h3>
                  <p className="class-slide-sub">{meta.subtitle}</p>
                  <p className="class-slide-desc">
                    {meta.overview.replace(/<[^>]*>/g, '').slice(0, 200)}...
                  </p>
                  <Link href={`/class/${cls.slug}`} className="class-slide-link">
                    View Full Guide &rarr;
                  </Link>
                </div>
                <div className="class-slide-sigil">
                  <ClassSigil
                    abbr={meta.abbr}
                    color={meta.colorHex}
                    size={180}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right vertical rail */}
        <div className="classes-rail">
          {classes.map((cls, i) => (
            <button
              key={cls.slug}
              className={`classes-rail-tick ${i === activeIdx ? 'classes-rail-tick-active' : ''}`}
              style={{ color: cls.data.meta.colorHex }}
              onClick={() => {
                const wrapper = wrapperRef.current;
                if (!wrapper) return;
                const wrapperTop = wrapper.offsetTop;
                const totalHeight = wrapper.offsetHeight - window.innerHeight;
                const targetScroll = wrapperTop + (i / classes.length) * totalHeight;
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
              }}
              aria-label={`Jump to ${cls.data.meta.name}`}
            >
              {cls.data.meta.abbr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
