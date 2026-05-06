'use client';

import type { ProgressionStep } from '@/lib/types/characters';
import { PROGRESSION_KEYS } from '@/lib/constants/progression';
import { useCharacters } from '@/lib/hooks/useCharacters';

interface ProgressionChecklistProps {
  characterId: string;
  steps: ProgressionStep[];
  onStepToggle: (stepKey: string, completed: boolean) => void;
}

export default function ProgressionChecklist({ characterId, steps, onStepToggle }: ProgressionChecklistProps) {
  const { toggleStep } = useCharacters();

  const getStep = (key: string) => steps.find(s => s.step_key === key);

  const handleToggle = async (key: string, currentlyCompleted: boolean) => {
    const newState = !currentlyCompleted;
    onStepToggle(key, newState);
    try {
      await toggleStep(characterId, key, newState);
    } catch {
      // Revert on failure
      onStepToggle(key, currentlyCompleted);
    }
  };

  const completedCount = steps.filter(s => s.completed).length;

  return (
    <div className="progression-checklist">
      <div className="progression-header">
        <span className="progression-count">{completedCount}/{PROGRESSION_KEYS.length}</span>
      </div>
      <div className="progression-steps">
        {PROGRESSION_KEYS.map(({ key, label }) => {
          const step = getStep(key);
          const completed = step?.completed ?? false;
          const completedAt = step?.completed_at
            ? new Date(step.completed_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : null;

          return (
            <label
              key={key}
              className={`progression-step ${completed ? 'progression-step-completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={completed}
                onChange={() => handleToggle(key, completed)}
                className="progression-step-check"
              />
              <span className="progression-step-label">{label}</span>
              {completedAt && (
                <span className="progression-step-date">{completedAt}</span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
