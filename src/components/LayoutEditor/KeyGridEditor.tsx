import React, { useState } from 'react';
import { Key, KeyboardLayout, KeySize } from '../../types/keyboard';
import { createKey, hasKeyAtPosition, removeKey } from '../../utils/layoutUtils';
import { KeySlot } from './KeySlot';
import './KeyGridEditor.css';

interface KeyGridEditorProps {
  layout: KeyboardLayout;
  half: 'left' | 'right';
  onLayoutChange: (layout: KeyboardLayout) => void;
  gridCols?: number;
  gridRows?: number;
}

export const KeyGridEditor: React.FC<KeyGridEditorProps> = ({
  layout,
  half,
  onLayoutChange,
  gridCols = 15,
  gridRows = 5,
}) => {
  const [selectedSize, setSelectedSize] = useState<KeySize>(1);
  const [hoveredPosition, setHoveredPosition] = useState<{ row: number; col: number } | null>(null);

  const targetHalf = half === 'left' ? layout.left : layout.right;

  const handleSlotClick = (row: number, col: number) => {
    if (hasKeyAtPosition(layout, half, { row, col })) {
      // キーが存在する場合は削除
      const keyToRemove = targetHalf.keys.find(
        k => k.position.row === row && k.position.col === col
      );
      if (keyToRemove) {
        onLayoutChange(removeKey(layout, half, keyToRemove.id));
      }
    } else {
      // キーを追加
      const newKey = createKey(half, { row, col }, selectedSize);
      const updatedLayout = { ...layout };
      const updatedHalf = half === 'left' ? updatedLayout.left : updatedLayout.right;
      updatedLayout[half] = {
        ...updatedHalf,
        keys: [...updatedHalf.keys, newKey],
      };
      onLayoutChange(updatedLayout);
    }
  };

  const handleSlotRightClick = (row: number, col: number) => {
    const keyToRemove = targetHalf.keys.find(
      k => k.position.row === row && k.position.col === col
    );
    if (keyToRemove) {
      onLayoutChange(removeKey(layout, half, keyToRemove.id));
    }
  };

  const getKeyAtPosition = (row: number, col: number): Key | null => {
    return targetHalf.keys.find(
      k => k.position.row === row && k.position.col === col
    ) || null;
  };

  return (
    <div className="key-grid-editor">
      <div className="grid-controls">
        <label>
          Key Size (U):
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(parseFloat(e.target.value) as KeySize)}
          >
            <option value="1">1U</option>
            <option value="1.25">1.25U</option>
            <option value="1.5">1.5U</option>
            <option value="1.75">1.75U</option>
            <option value="2">2U</option>
            <option value="2.25">2.25U</option>
            <option value="2.5">2.5U</option>
            <option value="2.75">2.75U</option>
            <option value="3">3U</option>
          </select>
        </label>
        <div className="instructions">
          <p>Click to add key, Right-click to remove</p>
        </div>
      </div>
      <div
        className="key-grid"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        }}
      >
        {Array.from({ length: gridRows }, (_, row) =>
          Array.from({ length: gridCols }, (_, col) => {
            const key = getKeyAtPosition(row, col);
            return (
              <KeySlot
                key={`${row}-${col}`}
                keyData={key}
                position={{ row, col }}
                size={key?.size || selectedSize}
                onClick={() => handleSlotClick(row, col)}
                onRightClick={() => handleSlotRightClick(row, col)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

