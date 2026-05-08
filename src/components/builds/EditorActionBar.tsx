interface EditorActionBarProps {
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
  disabled?: boolean;
  mode: 'create' | 'edit';
}

export default function EditorActionBar({ onSubmit, onCancel, loading, disabled, mode }: EditorActionBarProps) {
  return (
    <div className="ed-actions">
      <button type="button" onClick={onCancel}>Cancel</button>
      <button type="button">Duplicate</button>
      <button type="button">Export</button>
      <button
        type="button"
        className="primary"
        onClick={onSubmit}
        disabled={loading || disabled}
      >
        {loading ? 'Saving…' : mode === 'create' ? 'Publish' : 'Save'}
      </button>
    </div>
  );
}
