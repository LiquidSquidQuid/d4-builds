'use client';

import { useState, type Dispatch } from 'react';
import type { BuildGearInput, BuildAction } from '@/lib/types/builds';
import GearSlotEditor from './GearSlotEditor';

interface GearPegboardProps {
  gear: Record<string, BuildGearInput>;
  dispatch: Dispatch<BuildAction>;
}

const COLUMNS = [
  ['Helm', 'Chest', 'Gloves', 'Pants'],
  ['Weapon', 'Offhand'],
  ['Boots', 'Amulet', 'Ring 1', 'Ring 2'],
];

function getRarityClass(g: BuildGearInput): string {
  if (!g.item_name) return '';
  if (g.is_unique) return 'unique';
  if (g.affix_data && g.affix_data.some(a => a.isGreaterAffix)) return 'legendary';
  return 'filled';
}

export default function GearPegboard({ gear, dispatch }: GearPegboardProps) {
  const [editingSlot, setEditingSlot] = useState<string | null>(null);

  return (
    <>
      <div className="pegboard">
        {COLUMNS.map((col, ci) => (
          <div key={ci} className="peg-col">
            {col.map((slot) => {
              const g = gear[slot];
              if (!g) return null;
              const hasItem = !!g.item_name;
              const rarity = getRarityClass(g);
              const isEditing = editingSlot === slot;
              const cellClass = [
                'peg-cell',
                hasItem ? `filled ${rarity}` : 'empty',
                isEditing ? 'active' : '',
              ].filter(Boolean).join(' ');

              return (
                <div
                  key={slot}
                  className={cellClass}
                  onClick={() => setEditingSlot(isEditing ? null : slot)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${slot}: ${hasItem ? g.item_name : 'empty'}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setEditingSlot(isEditing ? null : slot);
                    }
                  }}
                >
                  <div className="peg-slot">{slot}</div>
                  <div className="peg-name">
                    {hasItem ? g.item_name : 'awaiting inscription'}
                  </div>
                  {hasItem && (
                    <div className="peg-rare">
                      {g.is_unique ? 'Unique' : 'Legendary'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Inline editor for selected slot */}
      {editingSlot && gear[editingSlot] && (
        <div className="peg-editor-panel" style={{ marginTop: 24 }}>
          <GearSlotEditor
            slot={editingSlot}
            gear={gear[editingSlot]}
            dispatch={dispatch}
          />
        </div>
      )}
    </>
  );
}
