import React, { useEffect, useState } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { SectionCanvas } from './components/SectionCanvas';
import { CodeEditor } from './components/CodeEditor';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar, type BuilderMode } from './components/Toolbar';
import { StatusBar } from './components/StatusBar';
import { AiPanel } from './components/AiPanel';
import { ProjectSwitcher } from './components/ProjectSwitcher';
import { ThemeMetadataPanel } from './components/ThemeMetadataPanel';
import { BackendConfigPanel } from './components/BackendConfigPanel';
import { ExportDialog } from './components/ExportDialog';
import { WidgetTree } from './components/WidgetTree';
import { CommandPalette } from './components/CommandPalette';
import { CustomCssPanel } from './components/CustomCssPanel';
import { ImportWizard } from './components/ImportWizard';
import { Tour, useShouldShowTour } from './components/tour/Tour';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppkitStore } from './store/appkit-store';

export type RightPanelTab = 'props' | 'style' | 'css' | 'ai';

export default function App() {
  const loadFromLocalStorage = useAppkitStore((s) => s.loadFromLocalStorage);
  const saveToLocalStorage = useAppkitStore((s) => s.saveToLocalStorage);
  const project = useAppkitStore((s) => s.project);
  const showProjectSwitcher = useAppkitStore((s) => s.showProjectSwitcher);
  const [mode, setMode] = useState<BuilderMode>('design');
  const [rightTab, setRightTab] = useState<RightPanelTab>('props');
  const [showExport, setShowExport] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const shouldShowTour = useShouldShowTour();
  const [showTour, setShowTour] = useState(false);

  useKeyboardShortcuts();

  useEffect(() => { loadFromLocalStorage(); }, []);

  // Start tour only after ProjectSwitcher is dismissed
  useEffect(() => {
    if (!showProjectSwitcher && shouldShowTour && !showTour) {
      const timer = setTimeout(() => setShowTour(true), 600);
      return () => clearTimeout(timer);
    }
  }, [showProjectSwitcher]);
  useEffect(() => {
    const timer = setTimeout(() => saveToLocalStorage(), 2000);
    return () => clearTimeout(timer);
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-ide-bg select-none">
      {showProjectSwitcher && <ProjectSwitcher />}
      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
      <CommandPalette open={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
      <ImportWizard open={showImport} onClose={() => setShowImport(false)} />
      <Tour open={showTour} onClose={() => setShowTour(false)} />

      <Toolbar
        mode={mode}
        onModeChange={setMode}
        onShowExport={() => setShowExport(true)}
        onShowImport={() => setShowImport(true)}
        onShowCommandPalette={() => setShowCommandPalette(true)}
      />

      <div className="flex-1 overflow-hidden">
        <Allotment>
          <Allotment.Pane minSize={200} preferredSize={240}>
            <aside data-tour="widget-tree" className="h-full bg-ide-panel border-r border-ide-border flex flex-col overflow-hidden">
              <WidgetTree />
            </aside>
          </Allotment.Pane>

          <Allotment.Pane>
            <main data-tour="section-canvas" className="h-full overflow-hidden">
              {mode === 'code' ? <CodeEditor /> : <SectionCanvas />}
            </main>
          </Allotment.Pane>

          <Allotment.Pane minSize={240} preferredSize={280}>
            <aside data-tour="properties-panel" className="h-full bg-ide-panel border-l border-ide-border flex flex-col overflow-hidden">
              <div className="flex border-b border-ide-border text-[10px]">
                {(['props', 'style', 'css', 'ai'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setRightTab(tab)}
                    className={`flex-1 py-2.5 text-center capitalize transition-colors ${
                      rightTab === tab
                        ? 'text-ide-accent border-b-2 border-ide-accent font-semibold'
                        : 'text-ide-text-dim hover:text-ide-text'
                    }`}
                  >{tab}</button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-ide">
                {rightTab === 'props' && <PropertiesPanel />}
                {rightTab === 'style' && <ThemeMetadataPanel />}
                {rightTab === 'css' && <CustomCssPanel />}
                {rightTab === 'ai' && <AiPanel />}
              </div>
            </aside>
          </Allotment.Pane>
        </Allotment>
      </div>

      <StatusBar />
    </div>
  );
}
