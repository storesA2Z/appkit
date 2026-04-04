import React, { useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { useAppkitStore } from '../store/appkit-store';

export function CodeEditor() {
  const project = useAppkitStore((s) => s.project);
  const currentPage = useAppkitStore((s) => s.currentPage);
  const setProject = useAppkitStore((s) => s.setProject);

  const code = useMemo(() => JSON.stringify(project, null, 2), [project]);

  const handleChange = (value: string | undefined) => {
    if (!value) return;
    try {
      const parsed = JSON.parse(value);
      if (parsed.pages && parsed.theme && parsed.metadata) {
        setProject(parsed);
      }
    } catch {
      // invalid JSON while typing — ignore
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-ide-border bg-ide-toolbar">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-ide-text-dim">Editing:</span>
          <span className="text-ide-text-bright font-mono">{currentPage}.json</span>
        </div>
        <div className="text-[10px] text-ide-text-dim">
          Changes auto-apply on valid JSON
        </div>
      </div>
      <div className="flex-1">
        <Editor
          defaultLanguage="json"
          value={code}
          onChange={handleChange}
          theme="vs-dark"
          options={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            bracketPairColorization: { enabled: true },
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
