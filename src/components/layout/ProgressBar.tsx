'use client';

import { useEffect, useRef } from 'react';

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let rafId: number;

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      if (bar) {
        bar.style.transform = `scaleX(${progress})`;
        bar.style.width = '100%';
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div className="progress-bar" ref={barRef} />;
}
