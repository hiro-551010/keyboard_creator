import * as THREE from 'three';
import { KeyboardLayout, KeyboardParameters } from '../../types/keyboard';
import { createPlateMesh, createKeyHoles } from '../../lib/geometry/plateGenerator';
import { createTopCaseMesh, createBottomCaseMesh } from '../../lib/geometry/caseGenerator';

export class KeyboardRenderer {
  private scene: THREE.Scene;
  private leftPlateMesh?: THREE.Mesh;
  private rightPlateMesh?: THREE.Mesh;
  private leftHoles?: THREE.Group;
  private rightHoles?: THREE.Group;
  private leftTopCase?: THREE.Mesh;
  private rightTopCase?: THREE.Mesh;
  private leftBottomCase?: THREE.Mesh;
  private rightBottomCase?: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  updateLayout(layout: KeyboardLayout, parameters: KeyboardParameters) {
    // 既存のメッシュを削除
    this.clear();

    // 左プレート
    if (layout.left.keys.length > 0) {
      this.leftPlateMesh = createPlateMesh(layout, parameters, 'left');
      this.scene.add(this.leftPlateMesh);
      
      this.leftHoles = createKeyHoles(layout, parameters, 'left');
      this.scene.add(this.leftHoles);

      // 左ケース
      this.leftTopCase = createTopCaseMesh(layout, parameters, 'left');
      this.scene.add(this.leftTopCase);
      this.leftBottomCase = createBottomCaseMesh(layout, parameters, 'left');
      this.scene.add(this.leftBottomCase);
    }

    // 右プレート
    if (layout.right.keys.length > 0) {
      this.rightPlateMesh = createPlateMesh(layout, parameters, 'right');
      this.scene.add(this.rightPlateMesh);
      
      this.rightHoles = createKeyHoles(layout, parameters, 'right');
      this.scene.add(this.rightHoles);

      // 右ケース
      this.rightTopCase = createTopCaseMesh(layout, parameters, 'right');
      this.scene.add(this.rightTopCase);
      this.rightBottomCase = createBottomCaseMesh(layout, parameters, 'right');
      this.scene.add(this.rightBottomCase);
    }
  }

  private disposeMesh(mesh?: THREE.Mesh) {
    if (mesh) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  }

  private disposeGroup(group?: THREE.Group) {
    if (group) {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      this.scene.remove(group);
    }
  }

  clear() {
    this.disposeMesh(this.leftPlateMesh);
    this.leftPlateMesh = undefined;
    this.disposeMesh(this.rightPlateMesh);
    this.rightPlateMesh = undefined;
    this.disposeGroup(this.leftHoles);
    this.leftHoles = undefined;
    this.disposeGroup(this.rightHoles);
    this.rightHoles = undefined;
    this.disposeMesh(this.leftTopCase);
    this.leftTopCase = undefined;
    this.disposeMesh(this.rightTopCase);
    this.rightTopCase = undefined;
    this.disposeMesh(this.leftBottomCase);
    this.leftBottomCase = undefined;
    this.disposeMesh(this.rightBottomCase);
    this.rightBottomCase = undefined;
  }
}

