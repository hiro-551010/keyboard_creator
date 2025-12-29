import * as THREE from 'three';
import { Key } from '../../types/keyboard';
import { KeyboardParameters } from '../../types/keyboard';

// キーのスイッチホール（正方形）を生成
export function createSwitchHoleGeometry(
  keySize: number,
  holeSize: number,
  plateThickness: number
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const halfHole = holeSize / 2;
  
  // 正方形のスイッチホール
  shape.moveTo(-halfHole, -halfHole);
  shape.lineTo(halfHole, -halfHole);
  shape.lineTo(halfHole, halfHole);
  shape.lineTo(-halfHole, halfHole);
  shape.lineTo(-halfHole, -halfHole);

  const extrudeSettings = {
    depth: plateThickness,
    bevelEnabled: false,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// キーの位置を3D座標に変換
export function keyPositionTo3D(
  key: Key,
  parameters: KeyboardParameters,
  half: 'left' | 'right',
  keyUnit: number = 19.05
): THREE.Vector3 {
  // グリッド座標をベースに計算
  let x = key.position.col * keyUnit;
  let y = -key.position.row * keyUnit;
  
  // オフセットを適用（グリッドセルサイズに対する相対値）
  const offsetX = key.position.offsetX ?? 0;
  const offsetY = key.position.offsetY ?? 0;
  x += offsetX * keyUnit;
  y -= offsetY * keyUnit; // Y軸は下向きなので符号を反転
  
  // 左右のハーフのオフセットを適用
  x -= (half === 'left' ? parameters.splitDistance / 2 : -parameters.splitDistance / 2);
  
  const z = 0;
  return new THREE.Vector3(x, y, z);
}

// キーの幅を計算（U単位からmm）
export function keySizeToWidth(keySize: number, keyUnit: number = 19.05): number {
  return keySize * keyUnit;
}

