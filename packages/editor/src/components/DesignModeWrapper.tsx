import React, { useCallback, useState } from 'react';
import BuilderApp from '@appkit/builder/src/App';
import { useAppkitStore } from '@appkit/builder/src/store/appkit-store';
import { useEditorStore } from '../store/editor-store';
import { ArrowRightLeft } from 'lucide-react';

export function DesignModeWrapper() {
  const currentProject = useEditorStore((s) => s.currentProject);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleSyncToCode = useCallback(async () => {
    if (!currentProject) return;

    setSyncing(true);
    try {
      const layout = useAppkitStore.getState().project;
      const res = await fetch('/api/sync-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout, projectPath: currentProject.path }),
      });
      const data = await res.json();
      if (data.ok) {
        setLastSync(`Synced ${data.fileCount} files`);
      } else {
        setLastSync(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setLastSync(`Error: ${err.message}`);
    }
    setSyncing(false);
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center text-ide-text-dim">
        <p className="text-sm">Create or open a project to use Design mode</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-8 bg-ide-toolbar border-b border-ide-border flex items-center justify-between px-3 shrink-0">
        <span className="text-[10px] text-ide-text">
          Design Mode — {currentProject.name}
        </span>
        <div className="flex items-center gap-2">
          {lastSync && (
            <span className="text-[9px] text-ide-text-dim">{lastSync}</span>
          )}
          <button
            onClick={handleSyncToCode}
            disabled={syncing}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-ide-text-bright bg-ide-surface hover:bg-ide-hover rounded transition-colors disabled:opacity-50"
          >
            <ArrowRightLeft size={10} />
            {syncing ? 'Syncing...' : 'Sync to Code'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <BuilderApp />
      </div>
    </div>
  );
}
