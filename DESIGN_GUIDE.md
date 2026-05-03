# Sanctuary Codex — Design Guide

A cinematic, gothic landing page for a Diablo IV/II:R-style season guide. Hand this guide to Claude Code (CLI) when re-implementing in a real codebase, porting to a framework, or extending with new sections.

---

## 1. Voice & Aesthetic

**One line:** an illuminated manuscript bound in ironwork — gilt foil and ash, hand-set capitals, candle-lit margins.

**Tone of copy** — restrained, mythic, slightly archaic. Short sentences. Roman numerals for ordinals (I, II, III…). Avoid hype words ("amazing", "ultimate"). Prefer "the long road ahead", "before the descent", "by the third stand". When listing tactical truths, write them as commandments.

**Visual register**
- Ink black backgrounds. Never pure white anywhere.
- Gold leaf is sacred — reserve it for headings, gilded rules, accents, the flickering ember at the heart of the hero. Don't use it as a body color.
- Ember orange is the second voice — the Helltide, the alarm, the hero's living glow. One ember per scene; never compete.
- Class hues are **desaturated and gothic**, not the vibrant brand colors from the actual game. Treat them as muted heraldic dyes.
- Texture, always. A fine grain noise overlay sits over the entire viewport at low opacity. Vignette pulls the eyes inward.

**What we never do**
- No emoji.
- No gradient backgrounds spanning a whole hero (saturated purple→pink etc.). Gradients only on text or thin gilded rules.
- No flat material-design cards. Every card has a corner ornament, a gilded border, or a gilt rule above the title.
- No rounded corners > 4px. This is metalwork and parchment, not soft UI.

---

## 2. Type System

Three families, three jobs:

| Family | Variable | Role |
|---|---|---|
| **Cinzel** | `--f-display` | Display, eyebrows, capitals, all-caps headings |
| **Cormorant Garamond** | `--f-script` | Body copy, italic flourishes, descriptions |
| **JetBrains Mono** | `--f-mono` | Numerics, codex tags, level/tier labels |

**Cinzel** is the engraved capital — use sparingly and at scale. Always uppercase or small caps with wide tracking. **Cormorant** is the manuscript hand — lean on its italic for atmosphere. **Mono** is the marginalia — small, tight, technical.

### Scale (clamp() values are responsive)

```css
.display-xl  { font-size: clamp(3rem, 11vw, 9rem);  font-weight: 900; line-height: .92; letter-spacing: -.01em; }
.display-l   { font-size: clamp(2.4rem, 6.5vw, 4.8rem); font-weight: 900; line-height: .98; }
.display-m   { font-size: clamp(1.6rem, 3.2vw, 2.4rem); font-weight: 700; line-height: 1.1; }
.script-l    { font-size: clamp(1.3rem, 2.6vw, 2rem); font-weight: 300; font-style: italic; line-height: 1.35; }
.body-l      { font-size: 1.15rem; line-height: 1.7; }
.body-m      { font-size: 1rem; line-height: 1.65; }
.body-s      { font-size: .92rem; line-height: 1.55; }
.caps-s      { font-size: .6rem;  letter-spacing: .32em; font-family: Cinzel; text-transform: uppercase; }
.caps-xs     { font-size: .52rem; letter-spacing: .28em; font-family: Cinzel; text-transform: uppercase; }
.mono        { font-size: .78rem; letter-spacing: .04em; font-family: JetBrains Mono; }
```

**Eyebrow pattern** (the engraved label above any section title):

```html
<span class="eyebrow">II · The Common Wisdom</span>
```

Renders with a gold thread on either side via `::before` / `::after` — a 24px gilded rule fading to transparent.

**Gilded text** — use for the single most important word in a heading and nowhere else:

```html
<h2>Choose your <span class="gilded-text">class</span>.</h2>
```

The class clips a vertical gold gradient to the glyph and adds a 1px black drop shadow so it reads as physical leaf, not flat color.

---

## 3. Color Tokens

```css
/* INK & STONE — backgrounds */
--ink:     #07060a;   /* page floor */
--ink-2:   #0c0a10;   /* section variant */
--stone:   #14110d;   /* card surfaces */
--stone-2: #1c1812;   /* hover surfaces */
--stone-3: #252017;   /* raised surfaces */

/* VELLUM — text */
--vellum:        #e8dcb6;   /* body */
--vellum-bright: #f5ecc9;   /* emphasized */
--vellum-dim:    #9a8e6a;   /* meta, captions */
--vellum-faint:  #5a5340;   /* deep meta, dividers */

/* GOLD LEAF — accents */
--gold:        #c9a14a;   /* primary gilt */
--gold-bright: #f0cc6a;   /* highlight */
--gold-deep:   #8a6f2e;   /* shadow */
--gold-shadow: #5e4a1c;   /* deepest gilt */

/* EMBER & BLOOD — alarms */
--ember:       #ff5a1f;   /* helltide / hero core */
--ember-deep:  #a8350c;
--ember-glow:  #ffb070;
--blood:       #7a1818;
--blood-bright:#c43030;

/* CLASS HUES (heraldic, desaturated) */
--c-barb:    #b34a2e;   /* rust red */
--c-warlock: #6f4290;   /* heretic violet */
--c-paladin: #d4a942;   /* aged gold */
--c-rogue:   #3e8a6a;   /* viridian */
--c-sorc:    #4a86b8;   /* mage blue */
--c-druid:   #6b8a3a;   /* moss */
--c-spirit:  #c87a30;   /* tiger amber */
--c-necro:   #7a9a8a;   /* corpse green-grey */
```

**Rules**
- Pages start on `--ink`. Sections that need separation step to `--ink-2`.
- Cards always sit on `--stone` (or its variants on hover).
- Body text is `--vellum`. Captions and meta drop to `--vellum-dim`. Anything fainter is reserved for dividers and ghost numerals.
- Gilt is for accents only. If the page is feeling too gold, dim half of it to `--gold-deep`.
- Class colors color the **accent rule** of a class card and one heading — never the card surface. Surfaces stay stone.

---

## 4. Spacing & Rhythm

```css
--r-1: 4px;  --r-2: 8px;   --r-3: 12px;  --r-4: 16px;  --r-5: 24px;
--r-6: 32px; --r-7: 48px;  --r-8: 64px;  --r-9: 96px;  --r-10: 128px;
```

- **Section padding**: `160px` top/bottom (`.section`) — give every section room to breathe. `96px` for tight sections.
- **Container widths**: `.wrap` 1240px, `.wrap-narrow` 880px (long-read), `.wrap-wide` 1480px (showcase grids).
- **Inline horizontal padding**: 32px on every wrap.

---

## 5. Ornaments

The four motifs that recur and bind the design together. Use them.

### Gilded rule
A horizontal divider that fades from transparent → gold-shadow → gold → gold-shadow → transparent. 1px tall. Use to separate sections that share a background.

```html
<div class="rule"></div>
```

### Gilded rule with diamond mark
The same rule but with a 14px gold diamond at center. Use to mark a major chapter break.

```html
<div class="rule with-mark"><span class="rule-mark"></span></div>
```

### Corner brackets
Every framed card (class showcase, gear card, callout) has a small L-bracket corner at top-left and bottom-right, rendered via `::before` / `::after`:

```css
.card::before, .card::after { content:''; position:absolute; width:18px; height:18px; border:1px solid var(--gold); }
.card::before { top:-1px; left:-1px; border-right:0; border-bottom:0; }
.card::after  { bottom:-1px; right:-1px; border-left:0; border-top:0; }
```

### Diamond pip
4–8px gold diamond used inline for tier marks, list bullets, and progress dots. Add a soft gold glow.

```css
.pip { width:6px; height:6px; background:var(--gold); transform:rotate(45deg); box-shadow:0 0 6px var(--gold); }
```

---

## 6. Texture & Atmosphere (global)

Three fixed layers sit above all content (z-index 999–1000). They are the page's character — do not remove.

1. **Grain** — a fractal-noise SVG turbulence rendered as background-image, opacity ~.35, `mix-blend-mode: overlay`. Sits at z-1000.
2. **Vignette** — a radial gradient from transparent center to ~55% black at the edges. z-999.
3. **Embers** — JS-spawned `.ember` and `.mote` particles inside the hero (and any section that adds a `.embers` host). Each ember randomizes size (1.5–4px), drift (±60px horizontal), and animation duration (7–16s). Motes are slower, larger, lower-opacity ash drifting upward at 18–40s.

```js
function spawnEmbers(field, count = 50) {
  for (let i = 0; i < count; i++) {
    const e = document.createElement('div');
    e.className = 'ember';
    e.style.left = (Math.random()*100) + '%';
    const dur = 7 + Math.random()*9;
    e.style.animationDuration = dur + 's';
    e.style.animationDelay = (-Math.random()*dur) + 's';
    const sz = 1.5 + Math.random()*2.5;
    e.style.width = e.style.height = sz + 'px';
    e.style.setProperty('--drift', (Math.random()*120 - 60) + 'px');
    e.style.opacity = .4 + Math.random()*.5;
    field.appendChild(e);
  }
}
```

**Reduced motion** — gate any rAF-driven loop and ember spawn behind `matchMedia('(prefers-reduced-motion: reduce)')`.

---

## 7. Motion System

One `requestAnimationFrame` loop drives everything. Native scroll stays — we do not transform `body`. The rAF reads `window.scrollY` (target) and lerps a `current` value toward it (ease ~0.09). Scroll-linked animations read `current` to feel smooth.

**Duties of the rAF tick**
1. Lerp `current` toward `window.scrollY`.
2. For each `[data-parallax]` element, translate Y by `(distance from viewport center) × speed × 100px`.
3. Reveal `.reveal` elements once they cross `innerHeight - 120px` from top. Stagger via `.d1`, `.d2`, `.d3`, `.d4` delay classes (40ms increments).
4. Update the page's top progress bar.
5. Compute hero parallax (background, arch silhouette, foreground pillars, hero content fade).
6. Compute pinned-section indices for **stacking class showcase** and **tips deck** — see §9.
7. Toggle nav sticky state past 0.4 viewport heights.
8. Highlight the active nav link based on which `[data-nav-target]` section is centered.

### Reveal directional variants
```css
.reveal             { opacity:0; transform:translateY(24px); transition: ... .9s cubic-bezier(.2,.7,.2,1); }
.reveal.from-left   { transform:translateX(-48px); }
.reveal.from-right  { transform:translateX(48px); }
.reveal.from-left-far { transform:translateX(-120px); }
.reveal.in          { opacity:1; transform:none; }
.reveal.d1 { transition-delay: .04s }
.reveal.d2 { transition-delay: .08s }
.reveal.d3 { transition-delay: .12s }
.reveal.d4 { transition-delay: .16s }
```

The rAF auto-assigns directional variants to deep-dive sub-blocks (callouts, skill bars, gear cards) — alternating left/right by index — so the reveal feels like an unfurling scroll, not a uniform rise.

---

## 8. Hero

The opening shot. A full-bleed cathedral arch silhouette in SVG with three depth layers, a flickering ember at its heart, ash motes drifting up.

**Structure**
```
.hero
  .embers              (JS-spawned particles)
  .hero-bg-far         (parallax 0.4 — distant glow + cathedral skyline)
  .hero-arch           (parallax 0.7 — the central arch SVG)
  .hero-pillars        (parallax 0.3 — foreground pillars)
  .hero-content
    .eyebrow
    h1.display-xl      (with .gilded-text on the key word)
    .hero-sub
    .hero-cta-row
    .hero-meta         (mono-tagged metadata strip)
```

**Title sequence** — letters of the headline are wrapped in `<span>` with `transform: translateY(60px)` and staggered transition delays. On mount, they release upward into place over 1.2s with a 30ms stagger. After that they sit still — no idle animation on the title.

**The ember** — a single radial element behind the central arch keystone, with the `.flicker` keyframe (4s loop, randomized opacity dips at 47–49% and 72–74% of the cycle to mimic a candle).

```css
@keyframes flicker {
  0%,100%{opacity:1} 47%{opacity:1} 48%{opacity:.4} 49%{opacity:1}
  72%{opacity:1} 73%{opacity:.7} 74%{opacity:1}
}
```

---

## 9. Pinned Scroll Sections

Two sections of the page are 100vh sticky stages with scroll-driven slide indices.

### 9a · Common Wisdom (tips deck)
- Outer `.tips-pinned` is **700vh tall** — gives a generous scroll range for 7 truths.
- Inside, `.tips-stage` is `position: sticky; top:0; height:100vh`, holding the truth cards on top of one another.
- A massive ghost roman numeral (28–55vw, opacity .045) sits center-stage as a watermark behind the active truth.
- 7 ticks below the deck mark progress; the active tick brightens, past ticks dim halfway, future ticks stay faint.
- Scroll-driven index: `idx = floor(scrolled * 7 * 0.9999)` where `scrolled = -rect.top / (height - innerHeight)`, clamped 0..1.
- Only the slide whose index matches `idx` gets `.is-active` (opacity 1, translateY 0). Others sit at translateY +40 / opacity 0.
- The watermark roman swaps in lockstep.

### 9b · Class Showcase (stacking cards)
- Outer `.classes-pinned` is **480vh tall** for 4 classes.
- Same sticky stage pattern, but cards are absolutely-positioned siblings inside a centered `.classes-track` (82vw × 78vh).
- The active card has `.is-revealed` (opacity 1, full scale). Past cards get `.is-buried` — opacity .25, blur 1px, scale .97, translateY -12px — they settle behind the new card like ledger pages stacking up.
- Stage glow (a class-tinted radial gradient inside `.classes-stage::before`) interpolates color as the index changes: `--stage-color` is set from `slidesEls[idx].dataset.glow`.
- Right-side vertical rail with one tick per class, clickable to jump.

**Common contract for both pinned sections**
- The stage element is inside the tall outer wrapper, not a sibling of it. `position: sticky; top: 0; height: 100vh` only works if there's vertical room around it inside the same scroll container.
- Reveal class transitions on `transform` and `opacity` only — never animate `top`, `left`, `width`, `height`.

---

## 10. Component Patterns

### Class card (in showcase)
```html
<div class="class-slide" data-glow="rgba(179,74,46,.18)" style="--slide-color: var(--c-barb)">
  <div class="class-slide-text">
    <div class="class-slide-num"><strong>I</strong> · The Wanderer</div>
    <div class="class-slide-tier"><span class="pip"></span> S-Tier · Spin to Win</div>
    <h3 class="class-slide-name">Barbarian</h3>
    <p class="class-slide-sub">Whirlwind · Fire conversion · Dust devils</p>
    <p class="class-slide-desc">…</p>
    <div class="class-slide-tags">
      <span class="class-slide-tag">Melee</span>
      <span class="class-slide-tag">Polearm + Slashing</span>
    </div>
  </div>
  <div class="class-slide-sigil">
    <div class="sigil-svg" data-sigil="sigil-barb" style="color: var(--c-barb)"></div>
  </div>
</div>
```

The card name uses `--slide-color` so each class colors its own headline. Corner brackets pick up that color too.

### Sigil
A bespoke SVG per class, dual-rotating: the outer ring rotates 80s clockwise; the inner element rotates 60s counter-clockwise. `currentColor` flows through every stroke, so the sigil tints from `style="color: var(--c-barb)"`. Sigils live in a separate `sigils.html` file as `<template>` elements and are fetched + cloned into placeholder `[data-sigil]` hosts at init.

### Tier ledger row
```html
<div class="ledger-row" data-tier="S" style="--row-color: var(--c-warlock)">
  <div class="ledger-rank">S</div>
  <div class="ledger-class">Warlock</div>
  <div class="ledger-build">Dread Claws · Blazing Abyss</div>
  <div class="ledger-meta"><span class="pip"></span> A-tier solo · S-tier party</div>
</div>
```
- Each row has a thin left border in `--row-color` (1px → 3px on hover).
- Tier letter sits in a hand-set serif at 2rem in `--gold-bright`.
- Hover lifts the row 2px with a deeper stone background.

### Tip card (pinned crossfade)
```html
<div class="tip-pin">
  <div class="tip-pin-num">III</div>
  <div class="tip-pin-body">
    <strong>Hoard Obols until 70.</strong> At max level, vendors deal in 850 item-power gear. A holy war chest, paid for at coppers.
  </div>
</div>
```
- Numeral and body are separated by a 1px gold rule.
- Body uses `--f-script` italic at 1.7rem.
- Strong inside body is small caps Cinzel, all uppercase, gold-bright — the truth's title.

### Skill bar (deep dive)
A 6-column grid showing the skill rotation in priority order. Each cell:
- 56px circular icon placeholder bordered in `--gold-deep`.
- Skill name in caps below, level pill (`Lvl 1` etc.) in mono to the right.
- The active "spam" skill has a brighter border + a 6px outer gold glow.

### Allocation table
Phase-blocked tables: a `.alloc-chapter` per phase (Levels 1–15, 15–35, 35–60, 60+), each with its own `.subhead` (e.g. "Phase II — The Helltide") and a 3-column allocation row (Skill / Points / Note). Phases alternate slide-in direction.

### Gear card
```html
<div class="gear-card" style="--gear-rarity: var(--gold-bright)">
  <div class="gear-slot">Helmet</div>
  <div class="gear-name">Harlequin Crest</div>
  <div class="gear-rarity">Mythic Unique</div>
  <ul class="gear-affixes">
    <li>+4 to All Skills</li>
    <li>Damage Reduction (×)</li>
    <li>+2 Ranks Hardened</li>
  </ul>
</div>
```
Border in `--gear-rarity` (gold for mythic, ember for legendary, etc.). Slot label is mono caps, name is Cinzel.

### Endgame checklist
Numbered ordinals in giant Cinzel caps (3rem) at the left of each item. A 1px gold thread runs vertically connecting numerals — drawn via the `::before` of the `<ol>`. Each `<li>` slides in from alternating sides with a 50ms stagger.

---

## 11. Navigation

A thin top bar that stays transparent over the hero, then snaps to a stone background with a gold underline once you scroll 0.4vh past it. Links route to anchor sections via `data-target` on `.nav-link` elements; smooth scroll handled in JS.

The page also has a top progress bar — a 1px gold thread that fills left-to-right as the user reads, sitting just under the nav.

---

## 12. File Structure

```
index.html              entry point
sigils.html             <template>s for class sigils, fetched at init
styles/
  base.css              reset, tokens, type, layout, ornaments, helpers
  hero.css              hero layout, parallax layers, ember/mote, title sequence
  sections.css          tier ledger, tips pinned, class showcase, choose-grid
  details.css           per-class deep dives, skill bar, gear, endgame, footer
scripts/
  scroll.js             single rAF: lerp, parallax, reveals, pinned indices, nav
```

Keep the split. CSS files map 1:1 to vertical sections of the page so a contributor can locate a rule by where it shows up on screen.

---

## 13. Accessibility

- Every section uses semantic landmarks (`<section>`, `<h2>`, `<ol>`).
- All images and decorative SVG sigils are `aria-hidden="true"`. Text content carries the meaning.
- Focus states are explicit — every interactive element gets a 1px gold outline at 2px offset on `:focus-visible`.
- The pinned scroll sections degrade gracefully without JS (they become normal stacked cards). `prefers-reduced-motion` short-circuits the rAF and ember spawn, leaving only static reveal states (opacity 1, transform none).
- Color contrast: `--vellum` on `--ink` clears AA at all sizes. `--vellum-dim` is reserved for ≥16px regular and never carries primary information.

---

## 14. Implementation order (when porting)

1. **Tokens + type** — get `:root` and the type utility classes rendering correctly. Verify Cinzel + Cormorant + JetBrains Mono load and the eyebrow renders with its gold thread.
2. **Layout primitives** — `.wrap`, `.section`, `.rule`, `.rule.with-mark`. Drop a few placeholder sections in to confirm vertical rhythm.
3. **Texture stack** — grain overlay, vignette. The page should already feel right at this point with no real content.
4. **Hero** — static first (no parallax), then layer the rAF + ember spawn + flicker.
5. **rAF engine** — write `scroll.js`'s tick once, generic. Hook `.reveal` first; everything else plugs in.
6. **Sections in source order** — tier ledger → pinned tips → pinned class showcase → deep dives → endgame → footer. Verify each before moving on.
7. **Sigils** — last. They're decorative; everything must read without them.
8. **Reduced motion + a11y** — sweep at the end.

---

## 15. What to ask before extending

If asked to add a new section, get answers to these three questions before designing it:

1. **Is it a chapter or a footnote?** Chapters get a 160px section, an eyebrow with roman numeral, and a gilded rule above. Footnotes are inline.
2. **Is the data tabular, sequential, or atmospheric?** Tabular → ledger pattern. Sequential → pinned scroll deck. Atmospheric → a parallax stage with little text.
3. **Does it need its own color voice?** If yes, pick from the existing class hues or introduce one new heraldic color — never a saturated primary.

Default to less. The page is a manuscript; whitespace is a sentence.
