import React from 'react';
import { KeyboardParameters } from '../../types/keyboard';
import './ParameterPanel.css';

interface ParameterPanelProps {
  parameters: KeyboardParameters;
  onParametersChange: (parameters: KeyboardParameters) => void;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  parameters,
  onParametersChange,
}) => {
  const updateParameter = <K extends keyof KeyboardParameters>(
    key: K,
    value: KeyboardParameters[K]
  ) => {
    onParametersChange({
      ...parameters,
      [key]: value,
    });
  };

  return (
    <div className="parameter-panel">
      <h3>Parameters</h3>
      
      <div className="parameter-group">
        <h4>Basic Settings</h4>
        <div className="parameter-item">
          <label>Key Unit (mm)</label>
          <input
            type="number"
            value={parameters.keyUnit}
            onChange={(e) => updateParameter('keyUnit', parseFloat(e.target.value) || 19.05)}
            step="0.1"
          />
        </div>
        <div className="parameter-item">
          <label>Key Spacing (mm)</label>
          <input
            type="number"
            value={parameters.keySpacing}
            onChange={(e) => updateParameter('keySpacing', parseFloat(e.target.value) || 19.05)}
            step="0.1"
          />
        </div>
      </div>

      <div className="parameter-group">
        <h4>Plate Settings</h4>
        <div className="parameter-item">
          <label>Plate Thickness (mm)</label>
          <input
            type="number"
            value={parameters.plateThickness}
            onChange={(e) => updateParameter('plateThickness', parseFloat(e.target.value) || 1.5)}
            step="0.1"
          />
        </div>
        <div className="parameter-item">
          <label>Switch Hole Size (mm)</label>
          <input
            type="number"
            value={parameters.switchHoleSize}
            onChange={(e) => updateParameter('switchHoleSize', parseFloat(e.target.value) || 14.0)}
            step="0.1"
          />
        </div>
      </div>

      <div className="parameter-group">
        <h4>Case Settings</h4>
        <div className="parameter-item">
          <label>Wall Thickness (mm)</label>
          <input
            type="number"
            value={parameters.caseWallThickness}
            onChange={(e) => updateParameter('caseWallThickness', parseFloat(e.target.value) || 3.0)}
            step="0.1"
          />
        </div>
        <div className="parameter-item">
          <label>Bottom Thickness (mm)</label>
          <input
            type="number"
            value={parameters.caseBottomThickness}
            onChange={(e) => updateParameter('caseBottomThickness', parseFloat(e.target.value) || 3.0)}
            step="0.1"
          />
        </div>
        <div className="parameter-item">
          <label>Case Height (mm)</label>
          <input
            type="number"
            value={parameters.caseHeight}
            onChange={(e) => updateParameter('caseHeight', parseFloat(e.target.value) || 20.0)}
            step="0.1"
          />
        </div>
        <div className="parameter-item">
          <label>Clearance (mm)</label>
          <input
            type="number"
            value={parameters.caseClearance}
            onChange={(e) => updateParameter('caseClearance', parseFloat(e.target.value) || 2.0)}
            step="0.1"
          />
        </div>
      </div>

      <div className="parameter-group">
        <h4>Keyboard Settings</h4>
        <div className="parameter-item">
          <label>Split Distance (mm)</label>
          <input
            type="number"
            value={parameters.splitDistance}
            onChange={(e) => updateParameter('splitDistance', parseFloat(e.target.value) || 100.0)}
            step="1"
          />
        </div>
        <div className="parameter-item">
          <label>Tent Angle (degrees)</label>
          <input
            type="number"
            value={parameters.tentAngle}
            onChange={(e) => updateParameter('tentAngle', parseFloat(e.target.value) || 0)}
            step="1"
          />
        </div>
      </div>
    </div>
  );
};

