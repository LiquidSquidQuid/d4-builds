interface SaveBarProps {
  saved?: boolean;
  revision?: number;
}

export default function SaveBar({ saved = true, revision = 1 }: SaveBarProps) {
  return (
    <div className="save-bar">
      <span className={`save-dot${saved ? '' : ' unsaved'}`} />
      <span>{saved ? 'Saved' : 'Unsaved'} · revision {revision}</span>
      <span style={{ color: 'var(--vellum-faint)' }}>|</span>
      <span style={{ color: 'var(--gold)' }}>⌘S</span>
    </div>
  );
}
