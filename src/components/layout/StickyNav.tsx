'use client';

import { useEffect, useRef } from 'react';

const navLinks: { label: string; href: string; colorVar: string }[] = [
  { label: 'Meta',       href: '#meta',    colorVar: 'var(--gold)' },
  { label: 'Tips',       href: '#tips',    colorVar: 'var(--gold)' },
  { label: 'Barb',       href: '#barbarian',    colorVar: 'var(--c-barb)' },
  { label: 'Warlock',    href: '#warlock',      colorVar: 'var(--c-warlock)' },
  { label: 'Paladin',    href: '#paladin',      colorVar: 'var(--c-paladin)' },
  { label: 'Rogue',      href: '#rogue',        colorVar: 'var(--c-rogue)' },
  { label: 'Sorc',       href: '#sorcerer',     colorVar: 'var(--c-sorc)' },
  { label: 'Druid',      href: '#druid',        colorVar: 'var(--c-druid)' },
  { label: 'Necro',      href: '#necromancer',  colorVar: 'var(--c-necro)' },
  { label: 'Spiritborn', href: '#spiritborn',   colorVar: 'var(--c-spiritborn)' },
  { label: 'Endgame',    href: '#endgame', colorVar: 'var(--gold)' },
];

export default function StickyNav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero || !navRef.current) return;

    const nav = navRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          nav.classList.remove('visible');
        } else {
          nav.classList.add('visible');
        }
      },
      { threshold: 0 }
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    const id = href.replace('#', '');
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <nav className="nav" ref={navRef}>
      <div className="nav-inner">
        <span className="nav-brand">D4 Builds</span>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav-link"
            style={{ borderLeftColor: link.colorVar }}
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
