export default function ProfileLoading() {
  return (
    <div className="profile-hero">
      <div className="container">
        <div className="profile-header">
          <div className="skeleton-block skeleton-avatar" />
          <div style={{ flex: 1 }}>
            <div className="skeleton-block skeleton-title" />
            <div className="skeleton-block skeleton-line-short" />
          </div>
        </div>
        <div className="skeleton-card" style={{ marginTop: '16px' }}>
          <div className="skeleton-block skeleton-line-short" />
          <div className="skeleton-block skeleton-line" />
          <div className="skeleton-block skeleton-line" />
        </div>
        <div className="skeleton-card" style={{ marginTop: '16px' }}>
          <div className="skeleton-block skeleton-line-short" />
          <div className="skeleton-block skeleton-line" />
        </div>
      </div>
    </div>
  );
}
