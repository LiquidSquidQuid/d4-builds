'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import LoginButton from '@/components/auth/LoginButton';
import UserMenu from '@/components/auth/UserMenu';

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
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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
        <div className="nav-auth">
          <Link href="/builds" className="nav-builds-link">
            Builds
          </Link>
          {user ? <UserMenu user={user} /> : <LoginButton />}
        </div>
      </div>
    </nav>
  );
}
