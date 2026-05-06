'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CharacterWithProgress } from '@/lib/types/characters';
import type { Build } from '@/lib/types/builds';
import { useCharacters } from '@/lib/hooks/useCharacters';
import CharacterCard from './CharacterCard';
import CharacterForm from './CharacterForm';
import DeleteConfirmDialog from '@/components/builds/DeleteConfirmDialog';

interface MyCharactersListProps {
  characters: CharacterWithProgress[];
  builds: Build[];
}

export default function MyCharactersList({ characters: initialCharacters, builds }: MyCharactersListProps) {
  const router = useRouter();
  const { createCharacter, deleteCharacter, loading } = useCharacters();
  const [characters, setCharacters] = useState(initialCharacters);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CharacterWithProgress | null>(null);

  const handleCreate = async (state: Parameters<typeof createCharacter>[0]) => {
    await createCharacter(state);
    setShowForm(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCharacter(deleteTarget.id);
      setCharacters(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } catch {
      // error handled by hook
    }
  };

  return (
    <>
      {showForm ? (
        <CharacterForm
          builds={builds}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      ) : (
        <button
          type="button"
          className="login-btn"
          onClick={() => setShowForm(true)}
          style={{ marginBottom: characters.length > 0 ? '12px' : '0' }}
        >
          + Add Character
        </button>
      )}

      {characters.length === 0 && !showForm && (
        <p className="profile-empty">No characters tracked yet.</p>
      )}

      <div className="character-list">
        {characters.map(char => (
          <CharacterCard
            key={char.id}
            character={char}
            builds={builds}
            onDelete={() => setDeleteTarget(char)}
          />
        ))}
      </div>

      {deleteTarget && (
        <DeleteConfirmDialog
          buildTitle={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={loading}
        />
      )}
    </>
  );
}
