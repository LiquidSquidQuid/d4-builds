export default function BuildDetailLoading() {
  return (
    <div className="build-detail">
      <div className="container">
        <div className="build-detail-header">
          <div className="skeleton-block skeleton-avatar" />
          <div style={{ flex: 1 }}>
            <div className="skeleton-block skeleton-title" />
            <div className="skeleton-block skeleton-line-medium" />
          </div>
        </div>
        <div className="skeleton-block skeleton-line" style={{ marginTop: '24px' }} />
        <div className="skeleton-block skeleton-line" />
        <div style={{ display: 'flex', gap: '6px', margin: '16px 0' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton-block skeleton-skill-slot" />
          ))}
        </div>
        <div className="gear-grid" style={{ marginTop: '16px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card" style={{ height: '80px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
