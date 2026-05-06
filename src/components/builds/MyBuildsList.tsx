'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Build } from '@/lib/types/builds';
import { useBuilds } from '@/lib/hooks/useBuilds';
import BuildCard from './BuildCard';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface MyBuildsListProps {
  builds: Build[];
}

export default function MyBuildsList({ builds: initialBuilds }: MyBuildsListProps) {
  const router = useRouter();
  const { deleteBuild, loading } = useBuilds();
  const [builds, setBuilds] = useState(initialBuilds);
  const [deleteTarget, setDeleteTarget] = useState<Build | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBuild(deleteTarget.id);
      setBuilds(prev => prev.filter(b => b.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } catch {
      // error handled by hook
    }
  };

  if (builds.length === 0) {
    return <p className="profile-empty">No builds yet. Create your first build to get started.</p>;
  }

  return (
    <>
      <div className="profile-builds-list">
        {builds.map(build => (
          <BuildCard
            key={build.id}
            build={build}
            showActions
            onDelete={() => setDeleteTarget(build)}
          />
        ))}
      </div>

      {deleteTarget && (
        <DeleteConfirmDialog
          buildTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={loading}
        />
      )}
    </>
  );
}
