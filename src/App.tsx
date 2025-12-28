import React, { useState } from 'react';
import { KeyboardLayout, KeyboardParameters, DEFAULT_PARAMETERS } from './types/keyboard';
import { createEmptyLayout } from './utils/layoutUtils';
import { LayoutEditor } from './components/LayoutEditor/LayoutEditor';
import { Viewer3D } from './components/Viewer3D/Viewer3D';
import { ParameterPanel } from './components/ParameterPanel/ParameterPanel';
import { ExportPanel } from './components/ExportPanel/ExportPanel';
import './App.css';

function App() {
  const [layout, setLayout] = useState<KeyboardLayout>(createEmptyLayout());
  const [parameters, setParameters] = useState<KeyboardParameters>(DEFAULT_PARAMETERS);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Keyboard Creator</h1>
        <p>Design your split keyboard layout and generate 3D models</p>
      </header>
      <div className="app-content">
        <div className="app-sidebar">
          <LayoutEditor layout={layout} onLayoutChange={setLayout} />
          <ParameterPanel parameters={parameters} onParametersChange={setParameters} />
          <ExportPanel layout={layout} parameters={parameters} />
        </div>
        <div className="app-main">
          <Viewer3D layout={layout} parameters={parameters} />
        </div>
      </div>
    </div>
  );
}

export default App;
