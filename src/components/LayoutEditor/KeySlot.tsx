import React from 'react';
import { Key } from '../../types/keyboard';
import './KeySlot.css';

interface KeySlotProps {
  keyData: Key | null;
  position: { row: number; col: number };
  size: number; // サイズ（U単位）
  onClick: () => void;
  onRightClick?: () => void;
}

export const KeySlot: React.FC<KeySlotProps> = ({
  keyData,
  position,
  size,
  onClick,
  onRightClick,
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick?.();
  };

  return (
    <div
      className={`key-slot ${keyData ? 'occupied' : 'empty'}`}
      style={{
        gridColumn: `span ${size}`,
      }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      title={keyData ? `Key ${keyData.size}U` : 'Click to add key'}
    >
      {keyData && (
        <div className="key-content">
          {keyData.size}U
        </div>
      )}
    </div>
  );
};

