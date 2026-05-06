'use client';

import { useState } from 'react';
import type { BuildGearInput, BuildAction } from '@/lib/types/builds';

interface GearSlotEditorProps {
  slot: string;
  gear: BuildGearInput;
  dispatch: React.Dispatch<BuildAction>;
}

export default function GearSlotEditor({ slot, gear, dispatch }: GearSlotEditorProps) {
  const [affixInput, setAffixInput] = useState('');

  const update = (field: keyof BuildGearInput, value: string | boolean | string[]) => {
    dispatch({
      type: 'SET_GEAR',
      slot,
      payload: { ...gear, [field]: value },
    });
  };

  const addAffix = () => {
    const trimmed = affixInput.trim();
    if (trimmed && !gear.affixes.includes(trimmed)) {
      update('affixes', [...gear.affixes, trimmed]);
      setAffixInput('');
    }
  };

  const removeAffix = (index: number) => {
    update('affixes', gear.affixes.filter((_, i) => i !== index));
  };

  return (
    <div className="gear-slot-editor">
      <div className="gear-slot-editor-label">{slot}</div>

      <input
        type="text"
        value={gear.item_name}
        onChange={(e) => update('item_name', e.target.value)}
        placeholder="Item name..."
        className="build-editor-input"
      />

      <label className="gear-slot-unique-toggle">
        <input
          type="checkbox"
          checked={gear.is_unique}
          onChange={(e) => update('is_unique', e.target.checked)}
        />
        <span className={`gear-slot-unique-pip ${gear.is_unique ? 'active' : ''}`}>&#9670;</span>
        <span>Unique</span>
      </label>

      <div className="gear-slot-affixes">
        <div className="gear-slot-affix-tags">
          {gear.affixes.map((affix, i) => (
            <span key={i} className="gear-slot-affix-tag">
              {affix}
              <button
                type="button"
                onClick={() => removeAffix(i)}
                className="gear-slot-affix-remove"
                aria-label={`Remove ${affix}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="gear-slot-affix-add">
          <input
            type="text"
            value={affixInput}
            onChange={(e) => setAffixInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAffix(); } }}
            placeholder="Add affix..."
            className="build-editor-input gear-slot-affix-input"
          />
          <button
            type="button"
            onClick={addAffix}
            className="gear-slot-affix-btn"
          >
            +
          </button>
        </div>
      </div>

      <textarea
        value={gear.notes}
        onChange={(e) => update('notes', e.target.value)}
        placeholder="Notes..."
        rows={2}
        className="build-editor-textarea gear-slot-notes"
      />
    </div>
  );
}
