'use client';

import { useEffect, useRef } from 'react';

const EMBER_COUNT = 50;
const MOTE_COUNT = 12;

export default function EmberParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    if (!container) return;

    // Embers — small, fast, drifting
    for (let i = 0; i < EMBER_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'ember-particle';
      particle.setAttribute('aria-hidden', 'true');

      const left = Math.random() * 100;
      const duration = 7 + Math.random() * 9;
      const delay = Math.random() * -duration;
      const size = 1.5 + Math.random() * 2.5;
      const drift = Math.random() * 120 - 60;

      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.setProperty('--drift', `${drift}px`);
      particle.style.opacity = String(0.4 + Math.random() * 0.5);

      container.appendChild(particle);
    }

    // Motes — larger, slower ash
    for (let i = 0; i < MOTE_COUNT; i++) {
      const mote = document.createElement('div');
      mote.className = 'ember-mote';
      mote.setAttribute('aria-hidden', 'true');

      const left = Math.random() * 100;
      const duration = 18 + Math.random() * 22;
      const delay = Math.random() * -duration;
      const size = 3 + Math.random() * 4;

      mote.style.left = `${left}%`;
      mote.style.animationDuration = `${duration}s`;
      mote.style.animationDelay = `${delay}s`;
      mote.style.width = `${size}px`;
      mote.style.height = `${size}px`;
      mote.style.opacity = String(0.15 + Math.random() * 0.2);

      container.appendChild(mote);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return <div className="embers" ref={containerRef} aria-hidden="true" />;
}
