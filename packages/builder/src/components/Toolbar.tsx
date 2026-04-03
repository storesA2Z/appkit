import React from 'react';
import { Undo2, Redo2, Download, Bot } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';
import { PageTabs } from './PageTabs';

interface ToolbarProps {
  onToggleAi?: () => void;
  showAi?: boolean;
}

export function Toolbar({ onToggleAi, showAi }: ToolbarProps) {
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
    <header className="h-12 bg-white border-b flex items-center px-4 justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="font-bold text-lg tracking-tight">appkit</div>
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= historyLength - 1}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={16} />
          </button>
        </div>
      </div>

      <PageTabs />

      <div className="flex items-center gap-2">
        {onToggleAi && (
          <button
            onClick={onToggleAi}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              showAi ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bot size={14} />
            AI
          </button>
        )}
        <button
          onClick={handleExportJson}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          <Download size={14} />
          Export
        </button>
      </div>
    </header>
  );
}
