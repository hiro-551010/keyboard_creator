import * as THREE from 'three';
import { KeyboardLayout, KeyboardParameters } from '../../types/keyboard';
import { keyPositionTo3D, keySizeToWidth } from './keyGeometry';

// トップケースを生成
export function generateTopCaseGeometry(
  layout: KeyboardLayout,
  parameters: KeyboardParameters,
  half: 'left' | 'right'
): THREE.BufferGeometry {
  const keyHalf = half === 'left' ? layout.left : layout.right;
  const keyUnit = parameters.keyUnit;

  // プレートの境界を計算
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
  const margin = parameters.caseClearance + 5;
  minX -= margin;
  maxX += margin;
  minY -= margin;
  maxY += margin;

  // 外側の形状
  const outerShape = new THREE.Shape();
  outerShape.moveTo(minX, minY);
  outerShape.lineTo(maxX, minY);
  outerShape.lineTo(maxX, maxY);
  outerShape.lineTo(minX, maxY);
  outerShape.lineTo(minX, minY);

  // 内側の形状（プレートのサイズ）
  const innerMargin = parameters.caseClearance;
  const innerMinX = minX + parameters.caseWallThickness + innerMargin;
  const innerMaxX = maxX - parameters.caseWallThickness - innerMargin;
  const innerMinY = minY + parameters.caseWallThickness + innerMargin;
  const innerMaxY = maxY - parameters.caseWallThickness - innerMargin;

  const innerShape = new THREE.Path();
  innerShape.moveTo(innerMinX, innerMinY);
  innerShape.lineTo(innerMaxX, innerMinY);
  innerShape.lineTo(innerMaxX, innerMaxY);
  innerShape.lineTo(innerMinX, innerMaxY);
  innerShape.lineTo(innerMinX, innerMinY);
  outerShape.holes.push(innerShape);

  const extrudeSettings = {
    depth: parameters.caseWallThickness,
    bevelEnabled: false,
  };

  return new THREE.ExtrudeGeometry(outerShape, extrudeSettings);
}

// ボトムケースを生成（シンプルなボックス形状）
export function generateBottomCaseGeometry(
  layout: KeyboardLayout,
  parameters: KeyboardParameters,
  half: 'left' | 'right'
): THREE.BufferGeometry {
  const keyHalf = half === 'left' ? layout.left : layout.right;
  const keyUnit = parameters.keyUnit;

  // プレートの境界を計算
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
  const margin = parameters.caseClearance + 5;
  minX -= margin;
  maxX += margin;
  minY -= margin;
  maxY += margin;

  // ボトムケースの形状（BoxGeometryを使用してより簡単に）
  const width = maxX - minX;
  const height = maxY - minY;
  const depth = parameters.caseHeight + parameters.caseBottomThickness;

  return new THREE.BoxGeometry(width, height, depth);
}

// トップケースのメッシュを作成
export function createTopCaseMesh(
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

  const margin = parameters.caseClearance + 5;
  minX -= margin;
  maxX += margin;
  minY -= margin;
  maxY += margin;

  const geometry = generateTopCaseGeometry(layout, parameters, half);
  const caseMaterial = material || new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.2,
    roughness: 0.8,
  });

  const mesh = new THREE.Mesh(geometry, caseMaterial);
  mesh.position.x = (minX + maxX) / 2;
  mesh.position.y = (minY + maxY) / 2;
  mesh.position.z = parameters.plateThickness + parameters.caseWallThickness / 2;

  return mesh;
}

// ボトムケースのメッシュを作成
export function createBottomCaseMesh(
  layout: KeyboardLayout,
  parameters: KeyboardParameters,
  half: 'left' | 'right',
  material?: THREE.Material
): THREE.Mesh {
  const keyHalf = half === 'left' ? layout.left : layout.right;
  const keyUnit = parameters.keyUnit;

  // プレートの境界を計算
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

  const margin = parameters.caseClearance + 5;
  minX -= margin;
  maxX += margin;
  minY -= margin;
  maxY += margin;

  const width = maxX - minX;
  const height = maxY - minY;
  const depth = parameters.caseHeight + parameters.caseBottomThickness;

  const geometry = new THREE.BoxGeometry(width, height, depth);
  const caseMaterial = material || new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.2,
    roughness: 0.8,
  });

  const mesh = new THREE.Mesh(geometry, caseMaterial);
  mesh.position.x = (minX + maxX) / 2;
  mesh.position.y = (minY + maxY) / 2;
  mesh.position.z = -depth / 2;

  return mesh;
}

