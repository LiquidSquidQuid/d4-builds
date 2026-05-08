'use client';

import { useEffect, useState } from 'react';

interface JumpRailProps {
  sections: { id: string; label: string }[];
}

export default function JumpRail({ sections }: JumpRailProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY + window.innerHeight * 0.4;
      let current = sections[0]?.id ?? '';
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= y) current = s.id;
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [sections]);

  return (
    <nav className="jump-rail" role="navigation" aria-label="Chapter navigation">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={activeId === s.id ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
