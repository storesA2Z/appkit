import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Toolbar } from './components/Toolbar';
import { VSCodePane } from './components/VSCodePane';
import { PreviewPane } from './components/PreviewPane';
import { AiChatSidebar } from './components/AiChatSidebar';
import { StatusBar } from './components/StatusBar';
import { DesignModeWrapper } from './components/DesignModeWrapper';
import { useEditorStore } from './store/editor-store';

export default function App() {
  const mode = useEditorStore((s) => s.mode);
  const aiSidebarOpen = useEditorStore((s) => s.aiSidebarOpen);

  return (
    <div className="h-screen flex flex-col bg-ide-bg select-none">
      <Toolbar />

      <div className="flex-1 overflow-hidden">
        <div className="h-full" style={{ display: mode === 'design' ? 'block' : 'none' }}>
          <DesignModeWrapper />
        </div>

        <div className="h-full" style={{ display: mode === 'code' ? 'block' : 'none' }}>
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
        </div>
      </div>

      <StatusBar />
    </div>
  );
}
