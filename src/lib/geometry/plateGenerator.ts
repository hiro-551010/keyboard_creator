import * as THREE from 'three';
import { KeyboardLayout, KeyboardParameters } from '../../types/keyboard';
import { keyPositionTo3D, keySizeToWidth, createSwitchHoleGeometry } from './keyGeometry';

// プレートを生成
export function generatePlateGeometry(
  layout: KeyboardLayout,
  parameters: KeyboardParameters,
  half: 'left' | 'right'
): THREE.BufferGeometry {
  const keyHalf = half === 'left' ? layout.left : layout.right;
  const keyUnit = parameters.keyUnit;

  // プレートのベース形状を計算（すべてのキーを囲む矩形）
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  keyHalf.keys.forEach(key => {
    const pos = keyPositionTo3D(key, parameters, half, keyUnit);
    const width = keySizeToWidth(key.size, keyUnit);
    minX = Math.min(minX, pos.x - width / 2);
    maxX = Math.max(maxX, pos.x + width / 2);
    minY = Math.min(minY, pos.y - keyUnit / 2);
    maxY = Math.max(maxY, pos.y + keyUnit / 2);
  });

  // マージンを追加
  const margin = 5;
  minX -= margin;
  maxX += margin;
  minY -= margin;
  maxY += margin;

  // プレートの形状を作成
  const shape = new THREE.Shape();
  shape.moveTo(minX, minY);
  shape.lineTo(maxX, minY);
  shape.lineTo(maxX, maxY);
  shape.lineTo(minX, maxY);
  shape.lineTo(minX, minY);

  // キーのホールを切り抜き
  keyHalf.keys.forEach(key => {
    const pos = keyPositionTo3D(key, parameters, half, keyUnit);
    const holeGeometry = createSwitchHoleGeometry(
      key.size,
      parameters.switchHoleSize,
      parameters.plateThickness + 1 // 完全に切り抜くため少し大きく
    );
    
    // ホールを形状として追加（Boolean operationの代替として、単純な形状で表現）
    // 実際の実装では、three-csgなどのライブラリを使用するか、サーバー側で処理
  });

  // シンプルな実装: 矩形プレートを生成
  const extrudeSettings = {
    depth: parameters.plateThickness,
    bevelEnabled: false,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// メッシュとしてプレートを作成
export function createPlateMesh(
  layout: KeyboardLayout,
  parameters: KeyboardParameters,
  half: 'left' | 'right',
  material?: THREE.Material
): THREE.Mesh {
  const keyHalf = half === 'left' ? layout.left : layout.right;
  const keyUnit = parameters.keyUnit;

  // プレートの境界を計算（位置合わせ用）
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  keyHalf.keys.forEach(key => {
    const pos = keyPositionTo3D(key, parameters, half, keyUnit);
    const width = keySizeToWidth(key.size, keyUnit);
    minX = Math.min(minX, pos.x - width / 2);
    maxX = Math.max(maxX, pos.x + width / 2);
    minY = Math.min(minY, pos.y - keyUnit / 2);
    maxY = Math.max(maxY, pos.y + keyUnit / 2);
  });

  const margin = 5;
  minX -= margin;
  maxX += margin;
  minY -= margin;
  maxY += margin;

  const geometry = generatePlateGeometry(layout, parameters, half);
  const plateMaterial = material || new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.3,
    roughness: 0.7,
  });

  const mesh = new THREE.Mesh(geometry, plateMaterial);
  mesh.position.x = (minX + maxX) / 2;
  mesh.position.y = (minY + maxY) / 2;
  mesh.position.z = -parameters.plateThickness / 2;

  return mesh;
}

// キーのホールを別メッシュとして作成（視覚化用）
export function createKeyHoles(
  layout: KeyboardLayout,
  parameters: KeyboardParameters,
  half: 'left' | 'right',
  material?: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const keyHalf = half === 'left' ? layout.left : layout.right;
  const keyUnit = parameters.keyUnit;

  const holeMaterial = material || new THREE.MeshBasicMaterial({
    color: 0x444444,
    transparent: true,
    opacity: 0.5,
  });

  keyHalf.keys.forEach(key => {
    const pos = keyPositionTo3D(key, parameters, half, keyUnit);
    // スイッチホールを円柱として表示（より視覚的）
    const holeGeometry = new THREE.CylinderGeometry(
      parameters.switchHoleSize / 2,
      parameters.switchHoleSize / 2,
      parameters.plateThickness + 0.1,
      32
    );
    const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);
    holeMesh.position.copy(pos);
    holeMesh.position.z = 0;
    holeMesh.rotation.x = Math.PI / 2; // 横に回転
    group.add(holeMesh);
  });

  return group;
}

