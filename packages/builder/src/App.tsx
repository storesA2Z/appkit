import React, { useEffect, useState } from 'react';
import { SectionLibrary } from './components/SectionLibrary';
import { SectionCanvas } from './components/SectionCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Toolbar } from './components/Toolbar';
import { AiPanel } from './components/AiPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppkitStore } from './store/appkit-store';

export default function App() {
  const loadFromLocalStorage = useAppkitStore((s) => s.loadFromLocalStorage);
  const saveToLocalStorage = useAppkitStore((s) => s.saveToLocalStorage);
  const project = useAppkitStore((s) => s.project);
  const [rightPanel, setRightPanel] = useState<'properties' | 'ai'>('properties');

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
      <Toolbar
        rightPanel={rightPanel}
        onSetRightPanel={setRightPanel}
      />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[260px] bg-sidebar-bg shrink-0 flex flex-col overflow-hidden">
          <SectionLibrary />
        </aside>

        <main className="flex-1 overflow-hidden">
          <SectionCanvas />
        </main>

        <aside className="w-[320px] bg-white border-l border-surface-3 shrink-0 flex flex-col overflow-hidden">
          {rightPanel === 'ai' ? <AiPanel /> : <PropertiesPanel />}
        </aside>
      </div>
    </div>
  );
}
