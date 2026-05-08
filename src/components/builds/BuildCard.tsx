import Link from 'next/link';
import type { Build } from '@/lib/types/builds';
import { classData } from '@/lib/constants/classes';
import type { D4Class } from '@/lib/types/classes';

interface BuildCardProps {
  build: Build & { author?: { display_name: string } };
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export default function BuildCard({ build, showActions, onDelete }: BuildCardProps) {
  const classMeta = classData[build.class as D4Class]?.meta;

  const date = new Date(build.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="build-card card"
      style={{ borderLeftColor: classMeta?.colorHex ?? 'var(--gold-deep)' }}
    >
      <Link href={`/builds/${build.id}`} className="build-card-link">
        <div className="build-card-header">
          <span
            className="build-card-class-badge"
            style={{ color: classMeta?.colorHex }}
          >
            {classMeta?.abbr ?? '?'}
          </span>
          <h3 className="build-card-title">{build.title}</h3>
        </div>

        {build.description && (
          <p className="build-card-desc">
            {build.description.length > 120
              ? build.description.slice(0, 120) + '...'
              : build.description}
          </p>
        )}

        <div className="build-card-footer">
          <span className="build-card-meta">{classMeta?.name}</span>
          {build.season && <span className="build-card-meta">S{build.season}</span>}
          <span className="build-card-meta">{date}</span>
          <span className="build-card-meta">
            {build.is_public ? 'Public' : 'Private'}
          </span>
        </div>
      </Link>

      {showActions && (
        <div className="build-card-actions">
          <Link href={`/builds/${build.id}/edit`} className="build-card-action-btn">
            Edit
          </Link>
          {onDelete && (
            <button
              type="button"
              className="build-card-action-btn build-card-delete-btn"
              onClick={() => onDelete(build.id)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
