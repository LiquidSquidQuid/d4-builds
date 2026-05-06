import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="container">
        <span className="error-page-eyebrow">IV &middot; Lost</span>
        <h1 className="error-page-title">The path you seek does not exist.</h1>
        <div className="error-page-rule" />
        <p className="error-page-body">
          The scroll you follow has crumbled &mdash; or perhaps it was never written.
        </p>
        <div className="error-page-links">
          <Link href="/" className="error-page-link">Return to Sanctuary</Link>
          <Link href="/builds" className="error-page-link">Browse Builds</Link>
        </div>
      </div>
    </div>
  );
}
