import { type ReactNode } from 'react';

interface ManuscriptFieldProps {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}

export default function ManuscriptField({ label, hint, children }: ManuscriptFieldProps) {
  return (
    <div className="ms-field">
      <div className="ms-field-row">
        <span className="ms-field-label">{label}</span>
        <div className="ms-field-input">{children}</div>
        {hint && <span className="ms-field-hint">{hint}</span>}
      </div>
    </div>
  );
}
