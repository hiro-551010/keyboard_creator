import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { KeyboardLayout, KeyboardParameters } from '../../types/keyboard';
import { setupScene, handleResize } from '../../lib/threejs/setupScene';
import { KeyboardRenderer } from './KeyboardRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './Viewer3D.css';

interface Viewer3DProps {
  layout: KeyboardLayout;
  parameters: KeyboardParameters;
}

export const Viewer3D: React.FC<Viewer3DProps> = ({ layout, parameters }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    keyboardRenderer: KeyboardRenderer;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // シーンをセットアップ
    const { scene, camera, renderer } = setupScene(containerRef.current);
    
    // カメラコントロール
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 50;
    controls.maxDistance = 500;

    // キーボードレンダラー
    const keyboardRenderer = new KeyboardRenderer(scene);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      keyboardRenderer,
      animationId: 0,
    };

    // リサイズハンドラー
    const cleanupResize = handleResize(containerRef.current, camera, renderer);

    // アニメーションループ
    const animate = () => {
      const current = sceneRef.current;
      if (!current) return;

      current.controls.update();
      current.renderer.render(current.scene, current.camera);
      current.animationId = requestAnimationFrame(animate);
    };
    sceneRef.current.animationId = requestAnimationFrame(animate);

    // クリーンアップ
    return () => {
      cleanupResize();
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        keyboardRenderer.clear();
        renderer.dispose();
      }
    };
  }, []);

  // レイアウトが変更されたときに更新
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.keyboardRenderer.updateLayout(layout, parameters);
      
      // カメラを適切な位置に移動
      const box = new THREE.Box3().setFromObject(sceneRef.current.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      sceneRef.current.camera.position.set(
        center.x,
        center.y,
        center.z + Math.max(size.x, size.y, size.z) * 1.5
      );
      sceneRef.current.controls.target.copy(center);
      sceneRef.current.controls.update();
    }
  }, [layout, parameters]);

  return <div ref={containerRef} className="viewer-3d" />;
};

