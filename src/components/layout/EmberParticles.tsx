'use client';

import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 18;

export default function EmberParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'ember-particle';

      const left = Math.random() * 100;
      const duration = 7 + Math.random() * 9; // 7–16s
      const delay = Math.random() * -16;        // negative for immediate spread
      const size = 2 + Math.random() * 3;       // 2–5px

      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      container.appendChild(particle);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return <div className="embers" ref={containerRef} />;
}
