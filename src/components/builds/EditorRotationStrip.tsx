'use client';

import type { BuildSkillInput, BuildAction } from '@/lib/types/builds';
import { type Dispatch } from 'react';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

interface EditorRotationStripProps {
  skills: BuildSkillInput[];
  dispatch: Dispatch<BuildAction>;
  spamIndex?: number;
}

export default function EditorRotationStrip({ skills, dispatch, spamIndex = 2 }: EditorRotationStripProps) {
  const slots = Array.from({ length: 6 }, (_, i) => skills[i]);

  const handleDragStart = (e: React.DragEvent, fromIdx: number) => {
    e.dataTransfer.setData('text/plain', String(fromIdx));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(fromIdx) || fromIdx === toIdx) return;

    const fromSkill = skills[fromIdx];
    const toSkill = skills[toIdx];
    if (fromSkill) dispatch({ type: 'SET_SKILL', index: toIdx, payload: { ...fromSkill, slot: toIdx } });
    if (toSkill) dispatch({ type: 'SET_SKILL', index: fromIdx, payload: { ...toSkill, slot: fromIdx } });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="rot ed-rot" role="list" aria-label="Skill rotation editor">
      {slots.map((skill, i) => {
        const isEmpty = !skill?.skill_name;
        const isActive = i === spamIndex && !isEmpty;
        const cellClass = `rot-cell${isActive ? ' active' : ''}${isEmpty ? ' empty' : ''}`;

        return (
          <div
            key={i}
            className={cellClass}
            role="listitem"
            draggable={!isEmpty}
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
          >
            <div className="rot-num">{ROMAN[i]}</div>
            <div className="rot-plate">
              {isEmpty ? '+' : skill.skill_name.charAt(0).toUpperCase()}
            </div>
            <div className="rot-name">
              {isEmpty ? 'drop a skill' : skill.skill_name}
            </div>
            {/* Rank pips */}
            <div className="rot-rank">
              {Array.from({ length: 5 }, (_, p) => (
                <span
                  key={p}
                  className={`pip${p < (skill?.points ?? 0) ? '' : ' off'}`}
                />
              ))}
            </div>
            <div className="rot-tag" style={isEmpty ? { color: 'var(--vellum-faint)' } : undefined}>
              {isEmpty ? 'empty' : (skill.is_passive ? 'Passive' : 'Active')}
            </div>
          </div>
        );
      })}
    </div>
  );
}
