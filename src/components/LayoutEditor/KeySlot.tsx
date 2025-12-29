import React from 'react';
import { Key } from '../../types/keyboard';
import './KeySlot.css';

interface KeySlotProps {
  keyData: Key | null;
  position: { row: number; col: number };
  size: number; // サイズ（U単位）
  onClick: () => void;
  onRightClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  draggable?: boolean;
  dragOffset?: { x: number; y: number } | null; // ドラッグ中のオフセットまたは保存されたオフセット
}

export const KeySlot: React.FC<KeySlotProps> = ({
  keyData,
  position,
  size,
  onClick,
  onRightClick,
  onDragStart,
  onDragEnd,
  draggable = false,
  dragOffset = null,
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick?.();
  };

  // オフセットに基づいてtransformを計算
  const transform = dragOffset
    ? `translate(${dragOffset.x * 100}%, ${dragOffset.y * 100}%)`
    : undefined;

  return (
    <div
      className={`key-slot ${keyData ? 'occupied' : 'empty'} ${draggable ? 'draggable' : ''}`}
      style={{
        gridColumn: `span ${size}`,
        transform,
        position: dragOffset ? 'relative' : undefined,
        zIndex: dragOffset ? 10 : undefined,
      }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      title={keyData ? `Key ${keyData.size}U - Drag to move` : 'Click to add key'}
    >
      {keyData && (
        <div className="key-content">
          {keyData.size}U
        </div>
      )}
    </div>
  );
};

