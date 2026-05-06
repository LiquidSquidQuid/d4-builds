export default function BuildFeedLoading() {
  return (
    <div className="build-feed">
      <div className="container">
        <div className="skeleton-block skeleton-title" />
        <div className="skeleton-block skeleton-filters" />
        <div className="build-feed-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-block skeleton-line-short" />
              <div className="skeleton-block skeleton-line" />
              <div className="skeleton-block skeleton-line-medium" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
