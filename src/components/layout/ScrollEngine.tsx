'use client';

import { useEffect } from 'react';
import { initScrollEngine, destroyScrollEngine, rescanDOM } from '@/lib/scroll-engine';

export default function ScrollEngine() {
  useEffect(() => {
    // Delay init slightly to ensure DOM is ready
    const timer = setTimeout(() => {
      initScrollEngine();
      rescanDOM();
    }, 100);

    return () => {
      clearTimeout(timer);
      destroyScrollEngine();
    };
  }, []);

  return null;
}
