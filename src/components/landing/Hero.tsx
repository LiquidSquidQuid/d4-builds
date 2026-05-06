export default function Hero() {
  return (
    <header className="hero" id="hero">
      <div className="hero-ember" aria-hidden="true" />
      <span className="eyebrow">Season XIII &middot; Lord of Hatred</span>
      <h1 className="hero-title display-xl">
        Build <span className="gilded-text">Encyclopedia</span>
      </h1>
      <p className="hero-subtitle script-l">
        All 8 Classes &middot; Every Viable Build &middot; Level 1 &rarr; Torment IV
      </p>
      <div className="hero-meta mono">
        Cross-referenced from Maxroll, Icy Veins, Mobalytics, D4Builds, Game8, Wowhead, SkyCoach.
      </div>
      <div className="hero-scroll-cue">
        <span>Scroll</span>
        <div className="hero-scroll-line"></div>
      </div>
    </header>
  );
}
