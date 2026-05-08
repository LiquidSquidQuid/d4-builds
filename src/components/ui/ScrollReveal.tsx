'use client';

import { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}

const DIRECTION_CLASS: Record<string, string> = {
  left: 'from-left',
  right: 'from-right',
};

export default function ScrollReveal({ children, className, direction }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const dirClass = direction ? DIRECTION_CLASS[direction] : undefined;
  const combinedClass = ['reveal', dirClass, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClass} ref={ref}>
      {children}
    </div>
  );
}
