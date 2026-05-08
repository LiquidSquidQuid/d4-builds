'use client';

import { useEffect, useRef, useState } from 'react';

export function useNumberTween(target: number, duration = 400): number {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);
  const raf = useRef<number>(0);

  useEffect(() => {
    // Respect reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target);
      prev.current = target;
      return;
    }

    const from = prev.current;
    const delta = target - from;
    if (delta === 0) return;

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = t * (2 - t); // ease-out
      setDisplay(from + delta * eased);
      if (t < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        prev.current = target;
      }
    };

    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return display;
}
