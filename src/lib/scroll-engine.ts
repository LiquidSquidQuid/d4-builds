/**
 * rAF Scroll Engine — single loop driving all scroll-linked effects.
 * Parallax, pinned section indices, active nav, progress bar.
 */

let target = 0;
let current = 0;
const ease = 0.09;
let rafId: number | null = null;
let isRunning = false;

// Cached DOM references
let parallaxEls: HTMLElement[] = [];
let progressBar: HTMLElement | null = null;
let pinnedSections: { el: HTMLElement; count: number; callback: (idx: number) => void }[] = [];
let navTargets: { id: string; el: HTMLElement }[] = [];
let activeNavCallback: ((id: string) => void) | null = null;

function tick() {
  if (!isRunning) return;

  target = window.scrollY;
  current += (target - current) * ease;

  const vh = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight - vh;

  // 1. Parallax
  for (const el of parallaxEls) {
    const speed = parseFloat(el.dataset.parallax ?? '0');
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - vh / 2;
    el.style.transform = `translateY(${center * speed * -0.5}px)`;
  }

  // 2. Pinned section indices
  for (const section of pinnedSections) {
    const rect = section.el.getBoundingClientRect();
    const totalHeight = section.el.offsetHeight - vh;
    if (totalHeight <= 0) continue;
    const scrolled = Math.max(0, Math.min(1, -rect.top / totalHeight));
    const idx = Math.min(section.count - 1, Math.floor(scrolled * section.count * 0.9999));
    section.callback(idx);
  }

  // 3. Progress bar
  if (progressBar && docHeight > 0) {
    const progress = current / docHeight;
    progressBar.style.transform = `scaleX(${Math.min(1, progress)})`;
  }

  // 4. Active nav
  if (activeNavCallback && navTargets.length > 0) {
    let closest = navTargets[0];
    let minDist = Infinity;
    for (const nt of navTargets) {
      const rect = nt.el.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - vh / 2);
      if (dist < minDist) {
        minDist = dist;
        closest = nt;
      }
    }
    activeNavCallback(closest.id);
  }

  rafId = requestAnimationFrame(tick);
}

export function initScrollEngine() {
  if (isRunning) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  isRunning = true;
  target = window.scrollY;
  current = target;

  // Cache parallax elements
  parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));

  // Cache progress bar
  progressBar = document.querySelector('.progress-bar');

  // Cache nav targets
  navTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-target]')).map(el => ({
    id: el.dataset.navTarget!,
    el,
  }));

  rafId = requestAnimationFrame(tick);
}

export function destroyScrollEngine() {
  isRunning = false;
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  parallaxEls = [];
  progressBar = null;
  pinnedSections = [];
  navTargets = [];
  activeNavCallback = null;
}

/** Register a pinned section for index tracking */
export function registerPinnedSection(el: HTMLElement, count: number, callback: (idx: number) => void) {
  pinnedSections.push({ el, count, callback });
}

/** Unregister a pinned section */
export function unregisterPinnedSection(el: HTMLElement) {
  pinnedSections = pinnedSections.filter(s => s.el !== el);
}

/** Register callback for active nav changes */
export function onActiveNavChange(callback: (id: string) => void) {
  activeNavCallback = callback;
}

/** Re-scan DOM for parallax and nav target elements */
export function rescanDOM() {
  parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  navTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-target]')).map(el => ({
    id: el.dataset.navTarget!,
    el,
  }));
}
