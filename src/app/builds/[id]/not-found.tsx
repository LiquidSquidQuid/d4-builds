import Link from 'next/link';

export default function BuildNotFound() {
  return (
    <div className="error-page">
      <div className="container">
        <span className="error-page-eyebrow">IV &middot; Lost</span>
        <h1 className="error-page-title">This build was not found.</h1>
        <div className="error-page-rule" />
        <p className="error-page-body">
          It may have been removed &mdash; or it remains private.
        </p>
        <div className="error-page-links">
          <Link href="/builds" className="error-page-link">Browse Builds</Link>
          <Link href="/" className="error-page-link">Return to Sanctuary</Link>
        </div>
      </div>
    </div>
  );
}
