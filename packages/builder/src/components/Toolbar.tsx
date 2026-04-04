import React from 'react';
import { Undo2, Redo2, Download, Upload, FolderOpen, Layers } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';
import { ThemeSelector } from './ThemeSelector';

export type BuilderMode = 'design' | 'code' | 'preview';

interface ToolbarProps {
  mode: BuilderMode;
  onModeChange: (mode: BuilderMode) => void;
  onShowExport: () => void;
  onShowImport: () => void;
  onShowCommandPalette: () => void;
}

const modes: { id: BuilderMode; label: string }[] = [
  { id: 'design', label: 'Design' },
  { id: 'code', label: 'Code' },
  { id: 'preview', label: 'Preview' },
];

export function Toolbar({ mode, onModeChange, onShowExport, onShowImport, onShowCommandPalette }: ToolbarProps) {
  const undo = useAppkitStore((s) => s.undo);
  const redo = useAppkitStore((s) => s.redo);
  const historyIndex = useAppkitStore((s) => s.historyIndex);
  const historyLength = useAppkitStore((s) => s.history.length);
  const setProject = useAppkitStore((s) => s.setProject);
  const setShowProjectSwitcher = useAppkitStore((s) => s.setShowProjectSwitcher);
  const currentProjectId = useAppkitStore((s) => s.currentProjectId);
  const projects = useAppkitStore((s) => s.projects);
  const currentProject = projects.find((p) => p.id === currentProjectId);

  const handleImportJson = () => {
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
    <header className="h-11 bg-ide-toolbar border-b border-ide-border flex items-center px-4 justify-between shrink-0 z-10">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-ide-accent to-purple-700 flex items-center justify-center">
            <Layers size={11} className="text-white" />
          </div>
          <span className="font-bold text-xs tracking-tight text-ide-text-bright">appkit</span>
        </div>
        <span className="w-px h-4 bg-ide-border" />
        <button
          onClick={() => setShowProjectSwitcher(true)}
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-ide-text hover:text-ide-text-bright hover:bg-ide-hover rounded transition-colors max-w-[140px]"
        >
          <FolderOpen size={11} className="shrink-0" />
          <span className="truncate">{currentProject?.name || 'Projects'}</span>
        </button>
        <span className="w-px h-4 bg-ide-border" />
        <div className="flex items-center gap-0.5">
          <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 rounded text-ide-text hover:text-ide-text-bright hover:bg-ide-hover disabled:opacity-20 transition-colors">
            <Undo2 size={13} />
          </button>
          <button onClick={redo} disabled={historyIndex >= historyLength - 1} className="p-1.5 rounded text-ide-text hover:text-ide-text-bright hover:bg-ide-hover disabled:opacity-20 transition-colors">
            <Redo2 size={13} />
          </button>
        </div>
      </div>

      <div data-tour="mode-switcher" className="flex bg-ide-surface rounded-full p-0.5">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`px-3.5 py-1 text-[11px] font-medium rounded-full transition-all ${
              mode === m.id ? 'bg-ide-accent text-white shadow-glow' : 'text-ide-text hover:text-ide-text-bright'
            }`}
          >{m.label}</button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <span data-tour="theme-selector"><ThemeSelector /></span>
        <span className="w-px h-4 bg-ide-border" />
        <div className="flex items-center gap-1 px-2 py-1 bg-ide-hover rounded text-[10px] text-ide-text">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Saved
        </div>
        <button data-tour="command-palette" onClick={onShowCommandPalette} className="px-2 py-1 bg-ide-hover rounded text-[10px] text-ide-text-dim hover:text-ide-text transition-colors">⌘K</button>
        <span data-tour="import-btn" className="flex items-center gap-1">
          <button onClick={handleImportJson} className="flex items-center gap-1 px-2 py-1 text-[11px] text-ide-text hover:text-ide-text-bright hover:bg-ide-hover rounded transition-colors" title="Import JSON">
            <Upload size={11} /> JSON
          </button>
          <button onClick={onShowImport} className="flex items-center gap-1 px-2 py-1 text-[11px] text-ide-text hover:text-ide-text-bright hover:bg-ide-hover rounded transition-colors" title="Import RN/Expo project">
            <Upload size={11} /> RN
          </button>
        </span>
        <button data-tour="export-btn" onClick={onShowExport} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 transition-opacity">
          <Download size={11} /> Export
        </button>
      </div>
    </header>
  );
}
