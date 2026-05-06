'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <div className="container">
        <span className="error-page-eyebrow">V &middot; Broken</span>
        <h1 className="error-page-title">Something has gone wrong.</h1>
        <div className="error-page-rule" />
        <p className="error-page-body">
          The darkness has claimed this page. You may try again, or return to sanctuary.
        </p>
        <div className="error-page-links">
          <button onClick={reset} className="error-page-retry">
            Try Again
          </button>
          <Link href="/" className="error-page-link">Return to Sanctuary</Link>
        </div>
      </div>
    </div>
  );
}
