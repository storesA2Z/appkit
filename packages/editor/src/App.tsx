import React, { useState } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Toolbar } from './components/Toolbar';
import { VSCodePane } from './components/VSCodePane';
import { PreviewPane } from './components/PreviewPane';
import { AiChatSidebar } from './components/AiChatSidebar';
import { StatusBar } from './components/StatusBar';
import { DesignModeWrapper } from './components/DesignModeWrapper';
import { NewProjectDialog } from './components/NewProjectDialog';
import { useEditorStore } from './store/editor-store';

export default function App() {
  const mode = useEditorStore((s) => s.mode);
  const aiSidebarOpen = useEditorStore((s) => s.aiSidebarOpen);
  const currentProject = useEditorStore((s) => s.currentProject);
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-ide-bg select-none">
      <Toolbar onNewProject={() => setShowNewProject(true)} />
      <NewProjectDialog open={showNewProject} onClose={() => setShowNewProject(false)} />

      <div className="flex-1 overflow-hidden">
        {!currentProject ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ide-accent to-purple-700 flex items-center justify-center mx-auto">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ide-text-bright">Welcome to AppKit</h2>
                <p className="text-sm text-ide-text-dim mt-1">Create a project to start building your app</p>
              </div>
              <button
                onClick={() => setShowNewProject(true)}
                className="px-5 py-2.5 text-sm font-semibold bg-ide-accent text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Create New Project
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      <StatusBar />
    </div>
  );
}
