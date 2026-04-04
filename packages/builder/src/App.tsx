import React, { useEffect, useState } from 'react';
import { SectionLibrary } from './components/SectionLibrary';
import { SectionCanvas } from './components/SectionCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar } from './components/Toolbar';
import { AiPanel } from './components/AiPanel';
import { ProjectSwitcher } from './components/ProjectSwitcher';
import { ThemeMetadataPanel } from './components/ThemeMetadataPanel';
import { BackendConfigPanel } from './components/BackendConfigPanel';
import { ExportDialog } from './components/ExportDialog';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppkitStore } from './store/appkit-store';

export type RightPanel = 'properties' | 'ai' | 'theme' | 'backend';

export default function App() {
  const loadFromLocalStorage = useAppkitStore((s) => s.loadFromLocalStorage);
  const saveToLocalStorage = useAppkitStore((s) => s.saveToLocalStorage);
  const project = useAppkitStore((s) => s.project);
  const showProjectSwitcher = useAppkitStore((s) => s.showProjectSwitcher);
  const [rightPanel, setRightPanel] = useState<RightPanel>('properties');
  const [showExport, setShowExport] = useState(false);

  useKeyboardShortcuts();

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => saveToLocalStorage(), 2000);
    return () => clearTimeout(timer);
  }, [project]);

  return (
    <div className="h-screen flex flex-col bg-surface-2 select-none">
      {showProjectSwitcher && <ProjectSwitcher />}
      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}

      <Toolbar
        rightPanel={rightPanel}
        onSetRightPanel={setRightPanel}
        onShowExport={() => setShowExport(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[260px] bg-sidebar-bg shrink-0 flex flex-col overflow-hidden">
          <SectionLibrary />
        </aside>

        <main className="flex-1 overflow-hidden">
          <SectionCanvas />
        </main>

        <aside className="w-[320px] bg-white border-l border-surface-3 shrink-0 flex flex-col overflow-hidden">
          {rightPanel === 'ai' && <AiPanel />}
          {rightPanel === 'theme' && <ThemeMetadataPanel />}
          {rightPanel === 'backend' && <BackendConfigPanel />}
          {rightPanel === 'properties' && <PropertiesPanel />}
        </aside>
      </div>
    </div>
  );
}
