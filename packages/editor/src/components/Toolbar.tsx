import React from 'react';
import { Layers, Download, MessageSquare, Play } from 'lucide-react';
import { useEditorStore, type EditorMode } from '../store/editor-store';

const modes: { id: EditorMode; label: string }[] = [
  { id: 'design', label: 'Design' },
  { id: 'code', label: 'Code' },
];

export function Toolbar() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const currentProject = useEditorStore((s) => s.currentProject);
  const toggleAiSidebar = useEditorStore((s) => s.toggleAiSidebar);
  const aiSidebarOpen = useEditorStore((s) => s.aiSidebarOpen);

  const handleExport = () => {
    // Future: zip and download project
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
        <span className="text-[11px] text-ide-text truncate max-w-[160px]">
          {currentProject?.name ?? 'No Project'}
        </span>
      </div>

      <div className="flex bg-ide-surface rounded-full p-0.5">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3.5 py-1 text-[11px] font-medium rounded-full transition-all ${
              mode === m.id ? 'bg-ide-accent text-white shadow-glow' : 'text-ide-text hover:text-ide-text-bright'
            }`}
          >{m.label}</button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-ide-text hover:text-ide-text-bright hover:bg-ide-hover rounded transition-colors"
          title="Run preview"
        >
          <Play size={11} /> Run
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 transition-opacity"
        >
          <Download size={11} /> Export
        </button>
        <span className="w-px h-4 bg-ide-border" />
        <button
          onClick={toggleAiSidebar}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded transition-colors ${
            aiSidebarOpen ? 'text-ide-accent bg-ide-accent-dim' : 'text-ide-text hover:text-ide-text-bright hover:bg-ide-hover'
          }`}
        >
          <MessageSquare size={11} /> AI
        </button>
      </div>
    </header>
  );
}
