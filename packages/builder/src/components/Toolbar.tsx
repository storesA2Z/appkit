import React from 'react';
import { Undo2, Redo2, Download, Upload, Sparkles, Settings2, Layers, Palette, Server, FolderOpen } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';
import { importFromJson } from '@appkit/export';
import { PageTabs } from './PageTabs';
import type { RightPanel } from '../App';

interface ToolbarProps {
  rightPanel: RightPanel;
  onSetRightPanel: (panel: RightPanel) => void;
  onShowExport: () => void;
}

const panels: { id: RightPanel; label: string; icon: React.ElementType }[] = [
  { id: 'properties', label: 'Properties', icon: Settings2 },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'backend', label: 'Backend', icon: Server },
  { id: 'ai', label: 'AI', icon: Sparkles },
];

export function Toolbar({ rightPanel, onSetRightPanel, onShowExport }: ToolbarProps) {
  const undo = useAppkitStore((s) => s.undo);
  const redo = useAppkitStore((s) => s.redo);
  const historyIndex = useAppkitStore((s) => s.historyIndex);
  const historyLength = useAppkitStore((s) => s.history.length);
  const setProject = useAppkitStore((s) => s.setProject);
  const setShowProjectSwitcher = useAppkitStore((s) => s.setShowProjectSwitcher);
  const currentProjectId = useAppkitStore((s) => s.currentProjectId);
  const projects = useAppkitStore((s) => s.projects);

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.appkit.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        const layout = parsed.layout || parsed;
        if (layout.pages && layout.theme && layout.metadata) {
          setProject(layout);
        }
      } catch {}
    };
    input.click();
  };

  return (
    <header className="h-14 bg-white border-b border-surface-3 flex items-center px-4 justify-between shrink-0 shadow-panel z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Layers size={14} className="text-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-gray-900">AppKit</span>
        </div>

        <div className="w-px h-6 bg-surface-3" />

        <button
          onClick={() => setShowProjectSwitcher(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-surface-1 rounded-lg transition-colors max-w-[160px]"
          title="Switch project"
        >
          <FolderOpen size={13} className="shrink-0" />
          <span className="truncate">{currentProject?.name || 'Projects'}</span>
        </button>

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
          {panels.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSetRightPanel(id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                rightPanel === id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-surface-3 mx-0.5" />

        <button
          onClick={handleImport}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-surface-1 rounded-lg transition-colors"
          title="Import .appkit.json"
        >
          <Upload size={13} />
          Import
        </button>

        <button
          onClick={onShowExport}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Download size={13} />
          Export
        </button>
      </div>
    </header>
  );
}
