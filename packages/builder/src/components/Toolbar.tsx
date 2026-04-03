import React from 'react';
import { Undo2, Redo2, Download, Sparkles, Settings2, Layers } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';
import { PageTabs } from './PageTabs';

interface ToolbarProps {
  rightPanel: 'properties' | 'ai';
  onSetRightPanel: (panel: 'properties' | 'ai') => void;
}

export function Toolbar({ rightPanel, onSetRightPanel }: ToolbarProps) {
  const undo = useAppkitStore((s) => s.undo);
  const redo = useAppkitStore((s) => s.redo);
  const historyIndex = useAppkitStore((s) => s.historyIndex);
  const historyLength = useAppkitStore((s) => s.history.length);
  const project = useAppkitStore((s) => s.project);

  const handleExportJson = () => {
    const json = JSON.stringify({ version: '1.0.0', ...project }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.metadata.name || 'appkit-project'}.appkit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 bg-white border-b border-surface-3 flex items-center px-4 justify-between shrink-0 shadow-panel z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Layers size={14} className="text-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-gray-900">AppKit</span>
        </div>

        <div className="w-px h-6 bg-surface-3" />

        <div className="flex items-center gap-0.5">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-surface-1 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= historyLength - 1}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-surface-1 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={16} />
          </button>
        </div>
      </div>

      <PageTabs />

      <div className="flex items-center gap-1.5">
        <div className="flex items-center bg-surface-1 rounded-lg p-0.5">
          <button
            onClick={() => onSetRightPanel('properties')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              rightPanel === 'properties'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings2 size={13} />
            Properties
          </button>
          <button
            onClick={() => onSetRightPanel('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              rightPanel === 'ai'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles size={13} />
            AI
          </button>
        </div>

        <div className="w-px h-6 bg-surface-3 mx-1" />

        <button
          onClick={handleExportJson}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Download size={13} />
          Export
        </button>
      </div>
    </header>
  );
}
