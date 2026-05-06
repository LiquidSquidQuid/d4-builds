'use client';

import type { D4Class } from '@/lib/types/classes';
import type { BuildSkillInput, BuildAction } from '@/lib/types/builds';
import { getLegacySkills, type SkillCategory } from '@/lib/constants/skills';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  basic: 'Basic',
  core: 'Core',
  defensive: 'Defensive',
  brawling: 'Brawling',
  weapon_mastery: 'Weapon Mastery',
  companion: 'Companion',
  ultimate: 'Ultimate',
  key_passive: 'Key Passive',
  passive: 'Passive',
  archfiend: 'Archfiend',
  sigil: 'Sigil',
  aura: 'Aura',
  valor: 'Valor',
  justice: 'Justice',
  agility: 'Agility',
  subterfuge: 'Subterfuge',
  imbuement: 'Imbuement',
};

interface SkillPickerProps {
  classSlug: D4Class;
  skills: BuildSkillInput[];
  dispatch: React.Dispatch<BuildAction>;
}

const EMPTY_SKILL: BuildSkillInput = {
  skill_name: '',
  points: 1,
  slot: null,
  is_passive: false,
  notes: '',
};

export default function SkillPicker({ classSlug, skills, dispatch }: SkillPickerProps) {
  const availableSkills = getLegacySkills(classSlug);
  const categories = [...new Set(availableSkills.map(s => s.category))];

  const handleSkillChange = (index: number, field: keyof BuildSkillInput, value: string | number | boolean | null) => {
    const updated = { ...skills[index], [field]: value };

    // Auto-set maxPoints based on selected skill
    if (field === 'skill_name') {
      const def = availableSkills.find(s => s.name === value);
      if (def) {
        updated.points = Math.min(updated.points, def.maxPoints);
      }
    }

    dispatch({ type: 'SET_SKILL', index, payload: updated });
  };

  const getMaxPoints = (skillName: string): number => {
    const def = availableSkills.find(s => s.name === skillName);
    return def?.maxPoints ?? 5;
  };

  return (
    <div className="skill-picker">
      <h3 className="build-editor-section-title">Skill Bar</h3>
      <div className="skill-picker-slots">
        {skills.map((skill, index) => (
          <div key={index} className={`skill-picker-slot ${skill.is_passive ? 'is-passive' : ''}`}>
            <div className="skill-picker-slot-header">
              <span className="skill-picker-slot-number">
                {skill.is_passive ? 'P' : index + 1}
              </span>
              <button
                type="button"
                className="skill-picker-remove"
                onClick={() => dispatch({ type: 'REMOVE_SKILL', index })}
                aria-label="Remove skill"
              >
                &times;
              </button>
            </div>

            <div className="skill-picker-field">
              <input
                list={`skills-${index}`}
                value={skill.skill_name}
                onChange={(e) => handleSkillChange(index, 'skill_name', e.target.value)}
                placeholder="Type or select skill..."
                className="build-editor-input"
              />
              <datalist id={`skills-${index}`}>
                {categories.map(cat => (
                  <optgroup key={cat} label={CATEGORY_LABELS[cat]}>
                    {availableSkills
                      .filter(s => s.category === cat)
                      .map(s => (
                        <option key={s.name} value={s.name} />
                      ))}
                  </optgroup>
                ))}
              </datalist>
            </div>

            <div className="skill-picker-controls">
              <div className="skill-picker-points">
                <label className="skill-picker-label">Pts</label>
                <input
                  type="number"
                  min={1}
                  max={getMaxPoints(skill.skill_name)}
                  value={skill.points}
                  onChange={(e) => handleSkillChange(index, 'points', Math.max(1, Math.min(getMaxPoints(skill.skill_name), parseInt(e.target.value) || 1)))}
                  className="build-editor-input skill-picker-points-input"
                />
              </div>

              {!skill.is_passive && (
                <div className="skill-picker-slot-assign">
                  <label className="skill-picker-label">Slot</label>
                  <select
                    value={skill.slot ?? ''}
                    onChange={(e) => handleSkillChange(index, 'slot', e.target.value ? parseInt(e.target.value) : null)}
                    className="build-editor-select skill-picker-slot-select"
                  >
                    <option value="">—</option>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              <label className="skill-picker-passive-toggle">
                <input
                  type="checkbox"
                  checked={skill.is_passive}
                  onChange={(e) => {
                    handleSkillChange(index, 'is_passive', e.target.checked);
                    if (e.target.checked) {
                      handleSkillChange(index, 'slot', null);
                    }
                  }}
                />
                <span>Passive</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="skill-picker-add"
        onClick={() => dispatch({ type: 'ADD_SKILL' })}
      >
        + Add Skill
      </button>
    </div>
  );
}
