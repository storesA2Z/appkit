import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editor-store';
import { snackBridge } from '../services/snack-bridge';

export function PreviewPane() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentProject = useEditorStore((s) => s.currentProject);
  const setSnackConnected = useEditorStore((s) => s.setSnackConnected);

  useEffect(() => {
    if (iframeRef.current) {
      snackBridge.attach(iframeRef.current);
    }
    return () => snackBridge.detach();
  }, []);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center bg-ide-bg text-ide-text-dim">
        <p className="text-sm">Preview will appear here</p>
      </div>
    );
  }

  const snackUrl = 'https://snack.expo.dev/embedded?platform=web&preview=true&theme=dark';

  return (
    <div className="h-full flex flex-col bg-ide-bg">
      <div className="h-8 bg-ide-toolbar border-b border-ide-border flex items-center px-3 text-[10px] text-ide-text shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${currentProject ? 'bg-emerald-400' : 'bg-ide-text-dim'}`} />
          <span>Preview</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative" style={{ width: 375, height: 812, maxHeight: '100%' }}>
          <div className="absolute inset-0 rounded-[3rem] border-[3px] border-ide-border bg-black overflow-hidden">
            <iframe
              ref={iframeRef}
              src={snackUrl}
              className="w-full h-full border-none"
              title="Expo Snack Preview"
              onLoad={() => setSnackConnected(true)}
              allow="cross-origin-isolated"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
