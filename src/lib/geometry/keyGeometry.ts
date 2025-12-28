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
  const x = key.position.col * keyUnit - (half === 'left' ? parameters.splitDistance / 2 : -parameters.splitDistance / 2);
  const y = -key.position.row * keyUnit;
  const z = 0;
  return new THREE.Vector3(x, y, z);
}

// キーの幅を計算（U単位からmm）
export function keySizeToWidth(keySize: number, keyUnit: number = 19.05): number {
  return keySize * keyUnit;
}

