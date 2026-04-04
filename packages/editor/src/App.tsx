import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Toolbar } from './components/Toolbar';
import { VSCodePane } from './components/VSCodePane';
import { PreviewPane } from './components/PreviewPane';
import { AiChatSidebar } from './components/AiChatSidebar';
import { StatusBar } from './components/StatusBar';
import { useEditorStore } from './store/editor-store';

export default function App() {
  const mode = useEditorStore((s) => s.mode);
  const aiSidebarOpen = useEditorStore((s) => s.aiSidebarOpen);

  return (
    <div className="h-screen flex flex-col bg-ide-bg select-none">
      <Toolbar />

      <div className="flex-1 overflow-hidden">
        {mode === 'design' && (
          <div className="h-full flex items-center justify-center text-ide-text-dim">
            <p className="text-sm">Design mode — visual builder will be loaded here</p>
          </div>
        )}

        {mode === 'code' && (
          <Allotment>
            <Allotment.Pane minSize={300} preferredSize="55%">
              <VSCodePane />
            </Allotment.Pane>

            <Allotment.Pane minSize={250}>
              <PreviewPane />
            </Allotment.Pane>

            {aiSidebarOpen && (
              <Allotment.Pane minSize={250} preferredSize={300} maxSize={400}>
                <AiChatSidebar />
              </Allotment.Pane>
            )}
          </Allotment>
        )}
      </div>

      <StatusBar />
    </div>
  );
}
