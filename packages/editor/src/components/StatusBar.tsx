import React from 'react';
import { useEditorStore } from '../store/editor-store';

export function StatusBar() {
  const vscodeReady = useEditorStore((s) => s.vscodeReady);
  const snackConnected = useEditorStore((s) => s.snackConnected);
  const currentProject = useEditorStore((s) => s.currentProject);
  const mode = useEditorStore((s) => s.mode);

  return (
    <footer className="h-6 bg-ide-toolbar border-t border-ide-border flex items-center px-3 text-[10px] text-ide-text-dim shrink-0">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${vscodeReady ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          VS Code {vscodeReady ? 'Ready' : 'Starting...'}
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${snackConnected ? 'bg-emerald-400' : 'bg-ide-text-dim'}`} />
          Snack {snackConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        {currentProject && <span>{currentProject.name}</span>}
        <span className="capitalize">{mode} mode</span>
      </div>
    </footer>
  );
}
