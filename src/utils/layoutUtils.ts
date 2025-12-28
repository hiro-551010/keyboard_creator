import { Key, KeyPosition, KeyboardLayout, KeySize } from '../types/keyboard';

// キーIDを生成
export function generateKeyId(half: 'left' | 'right', row: number, col: number): string {
  return `${half}-${row}-${col}`;
}

// 新しいキーを作成
export function createKey(
  half: 'left' | 'right',
  position: KeyPosition,
  size: KeySize = 1
): Key {
  return {
    id: generateKeyId(half, position.row, position.col),
    position,
    size,
  };
}

// キーを追加
export function addKey(layout: KeyboardLayout, half: 'left' | 'right', key: Key): KeyboardLayout {
  const updatedLayout = { ...layout };
  const targetHalf = half === 'left' ? updatedLayout.left : updatedLayout.right;
  updatedLayout[half] = {
    ...targetHalf,
    keys: [...targetHalf.keys, key],
  };
  return updatedLayout;
}

// キーを削除
export function removeKey(layout: KeyboardLayout, half: 'left' | 'right', keyId: string): KeyboardLayout {
  const updatedLayout = { ...layout };
  const targetHalf = half === 'left' ? updatedLayout.left : updatedLayout.right;
  updatedLayout[half] = {
    ...targetHalf,
    keys: targetHalf.keys.filter(k => k.id !== keyId),
  };
  return updatedLayout;
}

// キーを更新
export function updateKey(
  layout: KeyboardLayout,
  half: 'left' | 'right',
  keyId: string,
  updates: Partial<Key>
): KeyboardLayout {
  const updatedLayout = { ...layout };
  const targetHalf = half === 'left' ? updatedLayout.left : updatedLayout.right;
  updatedLayout[half] = {
    ...targetHalf,
    keys: targetHalf.keys.map(k => 
      k.id === keyId ? { ...k, ...updates } : k
    ),
  };
  return updatedLayout;
}

// 空のレイアウトを作成
export function createEmptyLayout(): KeyboardLayout {
  return {
    left: { keys: [] },
    right: { keys: [] },
  };
}

// 位置にキーが存在するかチェック
export function hasKeyAtPosition(
  layout: KeyboardLayout,
  half: 'left' | 'right',
  position: KeyPosition
): boolean {
  const targetHalf = half === 'left' ? layout.left : layout.right;
  return targetHalf.keys.some(
    k => k.position.row === position.row && k.position.col === position.col
  );
}

