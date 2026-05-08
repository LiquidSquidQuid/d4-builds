'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Title letter stagger animation
    const el = titleRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    requestAnimationFrame(() => {
      el.classList.add('hero-title-revealed');
    });
  }, []);

  return (
    <header className="hero" id="hero">
      {/* Parallax depth layers */}
      <div className="hero-bg-far" data-parallax="0.4" aria-hidden="true">
        <svg viewBox="0 0 1200 600" className="hero-svg-far" preserveAspectRatio="xMidYEnd slice">
          <ellipse cx="600" cy="580" rx="500" ry="120" fill="url(#heroGlow)" opacity="0.15" />
          <rect x="100" y="200" width="40" height="400" fill="currentColor" opacity="0.04" />
          <rect x="1060" y="200" width="40" height="400" fill="currentColor" opacity="0.04" />
          <defs>
            <radialGradient id="heroGlow">
              <stop offset="0%" stopColor="var(--ember)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="hero-arch" data-parallax="0.7" aria-hidden="true">
        <svg viewBox="0 0 400 600" className="hero-svg-arch" preserveAspectRatio="xMidYEnd meet">
          <path
            d="M 80 600 L 80 200 Q 80 40 200 40 Q 320 40 320 200 L 320 600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.12"
          />
          <path
            d="M 100 600 L 100 210 Q 100 60 200 60 Q 300 60 300 210 L 300 600"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.06"
          />
        </svg>
      </div>

      <div className="hero-pillars" data-parallax="0.3" aria-hidden="true">
        <svg viewBox="0 0 1200 600" className="hero-svg-pillars" preserveAspectRatio="xMidYEnd slice">
          <rect x="180" y="250" width="24" height="350" fill="currentColor" opacity="0.05" />
          <rect x="996" y="250" width="24" height="350" fill="currentColor" opacity="0.05" />
          <rect x="240" y="300" width="12" height="300" fill="currentColor" opacity="0.03" />
          <rect x="948" y="300" width="12" height="300" fill="currentColor" opacity="0.03" />
        </svg>
      </div>

      <div className="hero-ember" aria-hidden="true" />

      <div className="hero-content">
        <span className="eyebrow">Season XIII &middot; Lord of Hatred</span>
        <h1 className="hero-title display-xl" ref={titleRef}>
          Build <span className="gilded-text">Encyclopedia</span>
        </h1>
        <p className="hero-subtitle script-l">
          All 8 Classes &middot; Every Viable Build &middot; Level 1 &rarr; Torment IV
        </p>
        <div className="hero-meta mono">
          Cross-referenced from Maxroll, Icy Veins, Mobalytics, D4Builds, Game8, Wowhead, SkyCoach.
        </div>
        <div className="hero-scroll-cue">
          <span>Scroll</span>
          <div className="hero-scroll-line"></div>
        </div>
      </div>
    </header>
  );
}
