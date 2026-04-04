import React, { useRef } from 'react';
import { useEditorStore } from '../store/editor-store';

export function VSCodePane() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vscodePort = useEditorStore((s) => s.vscodePort);
  const currentProject = useEditorStore((s) => s.currentProject);
  const vscodeReady = useEditorStore((s) => s.vscodeReady);

  const folderParam = currentProject ? `?folder=${encodeURIComponent(currentProject.path)}` : '';
  const src = `http://localhost:${vscodePort}${folderParam}`;

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center bg-ide-bg text-ide-text-dim">
        <p className="text-sm">Create or open a project to start coding</p>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {!vscodeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-ide-bg z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-ide-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-ide-text-dim">Starting VS Code Server...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        className="w-full h-full border-none"
        title="VS Code Editor"
        onLoad={() => useEditorStore.getState().setVSCodeReady(true)}
      />
    </div>
  );
}
