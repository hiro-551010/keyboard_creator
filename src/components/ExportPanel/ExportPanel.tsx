import React from 'react';
import { KeyboardLayout, KeyboardParameters } from '../../types/keyboard';
import { createPlateMesh } from '../../lib/geometry/plateGenerator';
import { createTopCaseMesh, createBottomCaseMesh } from '../../lib/geometry/caseGenerator';
import { exportMeshAsSTL } from '../../lib/export/stlExporter';
import './ExportPanel.css';

interface ExportPanelProps {
  layout: KeyboardLayout;
  parameters: KeyboardParameters;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  layout,
  parameters,
}) => {
  const handleExport = (
    part: 'plate' | 'topCase' | 'bottomCase',
    half: 'left' | 'right'
  ) => {
    let mesh;
    
    switch (part) {
      case 'plate':
        mesh = createPlateMesh(layout, parameters, half);
        break;
      case 'topCase':
        mesh = createTopCaseMesh(layout, parameters, half);
        break;
      case 'bottomCase':
        mesh = createBottomCaseMesh(layout, parameters, half);
        break;
    }

    if (mesh) {
      const filename = `${half}-${part}`;
      exportMeshAsSTL(mesh, filename);
      
      // メモリをクリーンアップ
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  };

  const hasKeys = (half: 'left' | 'right') => {
    return half === 'left' ? layout.left.keys.length > 0 : layout.right.keys.length > 0;
  };

  return (
    <div className="export-panel">
      <h3>Export STL</h3>
      <div className="export-grid">
        <div className="export-section">
          <h4>Left Half</h4>
          <div className="export-buttons">
            <button
              onClick={() => handleExport('plate', 'left')}
              disabled={!hasKeys('left')}
            >
              Plate
            </button>
            <button
              onClick={() => handleExport('topCase', 'left')}
              disabled={!hasKeys('left')}
            >
              Top Case
            </button>
            <button
              onClick={() => handleExport('bottomCase', 'left')}
              disabled={!hasKeys('left')}
            >
              Bottom Case
            </button>
          </div>
        </div>
        <div className="export-section">
          <h4>Right Half</h4>
          <div className="export-buttons">
            <button
              onClick={() => handleExport('plate', 'right')}
              disabled={!hasKeys('right')}
            >
              Plate
            </button>
            <button
              onClick={() => handleExport('topCase', 'right')}
              disabled={!hasKeys('right')}
            >
              Top Case
            </button>
            <button
              onClick={() => handleExport('bottomCase', 'right')}
              disabled={!hasKeys('right')}
            >
              Bottom Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

