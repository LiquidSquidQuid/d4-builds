'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CharacterWithProgress } from '@/lib/types/characters';
import type { Build } from '@/lib/types/builds';
import type { D4Class } from '@/lib/types/classes';
import { classData } from '@/lib/constants/classes';
import { useCharacters } from '@/lib/hooks/useCharacters';
import ProgressionChecklist from './ProgressionChecklist';

interface CharacterCardProps {
  character: CharacterWithProgress;
  builds: Build[];
  onDelete: (id: string) => void;
}

export default function CharacterCard({ character, builds, onDelete }: CharacterCardProps) {
  const classMeta = classData[character.class as D4Class]?.meta;
  const { updateCharacter } = useCharacters();
  const [expanded, setExpanded] = useState(false);
  const [level, setLevel] = useState(character.level);
  const [paragon, setParagon] = useState(character.paragon);
  const [steps, setSteps] = useState(character.progression_steps);

  const activeBuild = builds.find(b => b.id === character.active_build);
  const completedCount = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;

  const handleLevelBlur = async () => {
    if (level !== character.level) {
      try { await updateCharacter(character.id, { level }); } catch { setLevel(character.level); }
    }
  };

  const handleParagonBlur = async () => {
    if (paragon !== character.paragon) {
      try { await updateCharacter(character.id, { paragon }); } catch { setParagon(character.paragon); }
    }
  };

  const handleStepToggle = (stepKey: string, completed: boolean) => {
    setSteps(prev => prev.map(s =>
      s.step_key === stepKey
        ? { ...s, completed, completed_at: completed ? new Date().toISOString() : null }
        : s
    ));
  };

  return (
    <div
      className="character-card"
      style={{ borderLeftColor: classMeta?.colorHex ?? 'var(--gold-dim)' }}
    >
      <div className="character-card-header">
        <span
          className="character-card-class-badge"
          style={{ color: classMeta?.colorHex }}
        >
          {classMeta?.abbr ?? '?'}
        </span>
        <div className="character-card-info">
          <h3 className="character-card-name">{character.name}</h3>
          <div className="character-card-meta">
            <span style={{ color: classMeta?.colorHex }}>{classMeta?.name}</span>
            {character.season && <span>S{character.season}</span>}
          </div>
        </div>

        <div className="character-card-stats">
          <div className="character-card-stat">
            <label className="character-card-stat-label">Lvl</label>
            <input
              type="number"
              value={level}
              onChange={(e) => setLevel(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              onBlur={handleLevelBlur}
              className="character-card-stat-input"
              min={1}
              max={100}
            />
          </div>
          <div className="character-card-stat">
            <label className="character-card-stat-label">Para</label>
            <input
              type="number"
              value={paragon}
              onChange={(e) => setParagon(Math.max(0, parseInt(e.target.value) || 0))}
              onBlur={handleParagonBlur}
              className="character-card-stat-input"
              min={0}
            />
          </div>
        </div>
      </div>

      {activeBuild && (
        <div className="character-card-build">
          <span className="character-card-build-label">Build:</span>
          <Link href={`/builds/${activeBuild.id}`} className="character-card-build-link">
            {activeBuild.title}
          </Link>
        </div>
      )}

      <div className="character-card-footer">
        <button
          type="button"
          className="character-card-expand"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '▾' : '▸'} Progress {completedCount}/{totalSteps}
        </button>

        <div className="character-card-actions">
          <button
            type="button"
            className="build-card-action-btn build-card-delete-btn"
            onClick={() => onDelete(character.id)}
          >
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <ProgressionChecklist
          characterId={character.id}
          steps={steps}
          onStepToggle={handleStepToggle}
        />
      )}
    </div>
  );
}
