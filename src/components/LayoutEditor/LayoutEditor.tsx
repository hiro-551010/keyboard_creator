import React, { useState } from 'react';
import { KeyboardLayout } from '../../types/keyboard';
import { createEmptyLayout } from '../../utils/layoutUtils';
import { KeyGridEditor } from './KeyGridEditor';
import './LayoutEditor.css';

interface LayoutEditorProps {
  layout: KeyboardLayout;
  onLayoutChange: (layout: KeyboardLayout) => void;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
  layout,
  onLayoutChange,
}) => {
  const [activeHalf, setActiveHalf] = useState<'left' | 'right'>('left');

  const handleClear = (half: 'left' | 'right') => {
    const updatedLayout = { ...layout };
    updatedLayout[half] = { keys: [] };
    onLayoutChange(updatedLayout);
  };

  return (
    <div className="layout-editor">
      <div className="editor-header">
        <h2>Layout Editor</h2>
        <div className="half-selector">
          <button
            className={activeHalf === 'left' ? 'active' : ''}
            onClick={() => setActiveHalf('left')}
          >
            Left Half
          </button>
          <button
            className={activeHalf === 'right' ? 'active' : ''}
            onClick={() => setActiveHalf('right')}
          >
            Right Half
          </button>
        </div>
      </div>
      <div className="editor-actions">
        <button onClick={() => handleClear(activeHalf)}>
          Clear {activeHalf === 'left' ? 'Left' : 'Right'}
        </button>
        <button onClick={() => onLayoutChange(createEmptyLayout())}>
          Clear All
        </button>
      </div>
      <KeyGridEditor
        layout={layout}
        half={activeHalf}
        onLayoutChange={onLayoutChange}
      />
    </div>
  );
};

