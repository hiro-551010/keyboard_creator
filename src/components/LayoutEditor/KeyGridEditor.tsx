import React, { useState, useRef } from 'react';
import { Key, KeyboardLayout, KeySize } from '../../types/keyboard';
import { createKey, hasKeyAtPosition, removeKey, updateKey } from '../../utils/layoutUtils';
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
  const [draggedKey, setDraggedKey] = useState<Key | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  // ドラッグ開始時の処理
  const handleDragStart = (e: React.DragEvent, key: Key) => {
    setDraggedKey(key);
    // ドラッグ中の視覚的フィードバック用に半透明にする
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = () => {
    setDraggedKey(null);
    setDragOffset(null);
    // すべてのキースロットの透明度をリセット
    if (gridRef.current) {
      const slots = gridRef.current.querySelectorAll('.key-slot');
      slots.forEach(slot => {
        if (slot instanceof HTMLElement) {
          slot.style.opacity = '1';
        }
      });
    }
  };

  // ドラッグ中の処理（グリッド上でマウスを移動）
  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedKey && gridRef.current) {
      // グリッドセル内のマウス位置を取得
      const gridRect = gridRef.current.getBoundingClientRect();
      const gridPadding = 10; // padding分を考慮
      const gridGap = 2; // gap分を考慮
      const availableWidth = gridRect.width - (gridPadding * 2);
      const availableHeight = gridRect.height - (gridPadding * 2);
      const cellWidth = (availableWidth - (gridGap * (gridCols - 1))) / gridCols;
      const cellHeight = (availableHeight - (gridGap * (gridRows - 1))) / gridRows;
      
      // マウス位置をグリッド座標系に変換（paddingを考慮）
      const mouseX = e.clientX - gridRect.left - gridPadding;
      const mouseY = e.clientY - gridRect.top - gridPadding;
      
      // 現在のセル内の相対位置を計算
      const cellStartX = col * (cellWidth + gridGap);
      const cellStartY = row * (cellHeight + gridGap);
      const relativeX = mouseX - cellStartX;
      const relativeY = mouseY - cellStartY;
      
      // セル内の相対位置（0.0 ～ 1.0）を計算
      const cellX = relativeX / cellWidth;
      const cellY = relativeY / cellHeight;
      
      // オフセットを計算（セル中央を0とする、-0.5 ～ 0.5の範囲）
      // 0.8を掛けてセル外にはみ出さないようにする
      const offsetX = Math.max(-0.4, Math.min(0.4, (cellX - 0.5) * 0.8));
      const offsetY = Math.max(-0.4, Math.min(0.4, (cellY - 0.5) * 0.8));
      
      setDragOffset({ x: offsetX, y: offsetY });
      setHoveredPosition({ row, col });
    }
  };

  // ドロップ時の処理
  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (draggedKey && dragOffset) {
      // 新しい位置を計算
      const newPosition = {
        row,
        col,
        offsetX: dragOffset.x,
        offsetY: dragOffset.y,
      };
      
      // キーの位置を更新
      const updatedLayout = updateKey(layout, half, draggedKey.id, {
        position: newPosition,
      });
      
      onLayoutChange(updatedLayout);
    } else if (draggedKey) {
      // オフセットなしで位置のみ更新
      const updatedLayout = updateKey(layout, half, draggedKey.id, {
        position: { row, col },
      });
      onLayoutChange(updatedLayout);
    }
    
    handleDragEnd();
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
          <p>Click to add key, Right-click to remove, Drag to move</p>
        </div>
      </div>
      <div
        ref={gridRef}
        className="key-grid"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        }}
        onDragLeave={() => {
          setHoveredPosition(null);
          setDragOffset(null);
        }}
      >
        {Array.from({ length: gridRows }, (_, row) =>
          Array.from({ length: gridCols }, (_, col) => {
            const key = getKeyAtPosition(row, col);
            const isDragOver = hoveredPosition?.row === row && hoveredPosition?.col === col;
            return (
              <div
                key={`${row}-${col}`}
                onDragOver={(e) => handleDragOver(e, row, col)}
                onDrop={(e) => handleDrop(e, row, col)}
                className={isDragOver ? 'drop-zone-active' : ''}
              >
                <KeySlot
                  keyData={key}
                  position={{ row, col }}
                  size={key?.size || selectedSize}
                  onClick={() => handleSlotClick(row, col)}
                  onRightClick={() => handleSlotRightClick(row, col)}
                  onDragStart={(e) => key && handleDragStart(e, key)}
                  onDragEnd={handleDragEnd}
                  draggable={!!key}
                  dragOffset={isDragOver && dragOffset ? dragOffset : (key?.position.offsetX !== undefined || key?.position.offsetY !== undefined) ? { x: key.position.offsetX ?? 0, y: key.position.offsetY ?? 0 } : null}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

