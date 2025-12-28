import * as THREE from 'three';

// STL形式でエクスポート（ASCII形式）
export function exportSTL(geometry: THREE.BufferGeometry, filename: string) {
  const vertices = geometry.attributes.position.array;
  const indices = geometry.index ? geometry.index.array : null;

  let stlContent = `solid ${filename}\n`;

  if (indices) {
    // Indexed geometry
    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i] * 3;
      const i1 = indices[i + 1] * 3;
      const i2 = indices[i + 2] * 3;

      const v0 = new THREE.Vector3(vertices[i0], vertices[i0 + 1], vertices[i0 + 2]);
      const v1 = new THREE.Vector3(vertices[i1], vertices[i1 + 1], vertices[i1 + 2]);
      const v2 = new THREE.Vector3(vertices[i2], vertices[i2 + 1], vertices[i2 + 2]);

      const normal = new THREE.Vector3()
        .subVectors(v1, v0)
        .cross(new THREE.Vector3().subVectors(v2, v0))
        .normalize();

      stlContent += `  facet normal ${normal.x} ${normal.y} ${normal.z}\n`;
      stlContent += `    outer loop\n`;
      stlContent += `      vertex ${v0.x} ${v0.y} ${v0.z}\n`;
      stlContent += `      vertex ${v1.x} ${v1.y} ${v1.z}\n`;
      stlContent += `      vertex ${v2.x} ${v2.y} ${v2.z}\n`;
      stlContent += `    endloop\n`;
      stlContent += `  endfacet\n`;
    }
  } else {
    // Non-indexed geometry
    for (let i = 0; i < vertices.length; i += 9) {
      const v0 = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
      const v1 = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
      const v2 = new THREE.Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);

      const normal = new THREE.Vector3()
        .subVectors(v1, v0)
        .cross(new THREE.Vector3().subVectors(v2, v0))
        .normalize();

      stlContent += `  facet normal ${normal.x} ${normal.y} ${normal.z}\n`;
      stlContent += `    outer loop\n`;
      stlContent += `      vertex ${v0.x} ${v0.y} ${v0.z}\n`;
      stlContent += `      vertex ${v1.x} ${v1.y} ${v1.z}\n`;
      stlContent += `      vertex ${v2.x} ${v2.y} ${v2.z}\n`;
      stlContent += `    endloop\n`;
      stlContent += `  endfacet\n`;
    }
  }

  stlContent += `endsolid ${filename}\n`;

  // Blobを作成してダウンロード
  const blob = new Blob([stlContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.stl`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// メッシュからSTLをエクスポート
export function exportMeshAsSTL(mesh: THREE.Mesh, filename: string) {
  const geometry = mesh.geometry.clone();
  
  // メッシュのワールド変換を適用
  geometry.applyMatrix4(mesh.matrixWorld);
  
  exportSTL(geometry, filename);
}

