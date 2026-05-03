interface CalloutBoxProps {
  type: 'info' | 'warning';
  label?: string;
  children: React.ReactNode;
}

export default function CalloutBox({ type, label, children }: CalloutBoxProps) {
  const className = type === 'warning' ? 'callout warning' : 'callout';

  return (
    <div className={className}>
      {label && <div className="callout-label">{label}</div>}
      {children}
    </div>
  );
}
