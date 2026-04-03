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
  const [showAi, setShowAi] = useState(false);

  useKeyboardShortcuts();

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => saveToLocalStorage(), 2000);
    return () => clearTimeout(timer);
  }, [project]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar onToggleAi={() => setShowAi(!showAi)} showAi={showAi} />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r shrink-0 overflow-hidden">
          <SectionLibrary />
        </div>

        <SectionCanvas />

        <div className="w-80 bg-white border-l shrink-0 overflow-y-auto">
          {showAi ? <AiPanel /> : <PropertiesPanel />}
        </div>
      </div>
    </div>
  );
}
