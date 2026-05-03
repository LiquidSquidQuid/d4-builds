'use client';

import { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className }: ScrollRevealProps) {
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

  const combinedClass = ['reveal', className].filter(Boolean).join(' ');

  return (
    <div className={combinedClass} ref={ref}>
      {children}
    </div>
  );
}
