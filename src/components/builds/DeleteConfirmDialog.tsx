'use client';

interface DeleteConfirmDialogProps {
  buildTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmDialog({
  buildTitle,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">Delete Build</h3>
        <p className="dialog-text">
          Are you sure you want to delete <strong>{buildTitle}</strong>? This cannot be undone.
        </p>
        <div className="dialog-actions">
          <button
            className="dialog-confirm-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            className="dialog-cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
