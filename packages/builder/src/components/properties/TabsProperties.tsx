import React from 'react';
import type { TabsConfig } from '@appkit/schema';
import { nanoid } from 'nanoid';

interface Props {
  config: TabsConfig;
  onChange: (changes: Partial<TabsConfig>) => void;
}

export function TabsProperties({ config, onChange }: Props) {
  const tc = config.tabsConfig || { tabs: [] };
  const tabs = tc.tabs || [];

  const updateTabs = (newTabs: typeof tabs) => onChange({ tabsConfig: { ...tc, tabs: newTabs } });

  const addTab = () => {
    if (tabs.length >= 10) return;
    updateTabs([...tabs, { id: nanoid(6), title: '', collectionIds: [] }]);
  };

  const removeTab = (index: number) => {
    updateTabs(tabs.filter((_, i) => i !== index));
  };

  const updateTab = (index: number, changes: Record<string, any>) => {
    updateTabs(tabs.map((tab, i) => i === index ? { ...tab, ...changes } : tab));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-ide-text-bright">Tabs ({tabs.length}/10)</label>
        {tabs.length < 10 && (
          <button onClick={addTab} className="text-xs text-ide-accent hover:text-ide-text-bright">+ Add Tab</button>
        )}
      </div>
      {tabs.map((tab, i) => (
        <div key={tab.id} className="p-2 border border-ide-border rounded-md bg-ide-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ide-text-muted">Tab {i + 1}</span>
            <button onClick={() => removeTab(i)} className="text-xs text-red-400">Remove</button>
          </div>
          <input
            type="text"
            value={tab.title}
            onChange={(e) => updateTab(i, { title: e.target.value })}
            placeholder="Tab title"
            maxLength={50}
            className="w-full px-2 py-1 text-xs bg-ide-bg border border-ide-border rounded text-ide-text-bright focus:border-ide-accent focus:outline-none"
          />
          <input
            type="text"
            value={tab.collectionIds.join(', ')}
            onChange={(e) => updateTab(i, { collectionIds: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            placeholder="Collection IDs (comma-separated)"
            className="w-full px-2 py-1 text-xs bg-ide-bg border border-ide-border rounded text-ide-text-bright focus:border-ide-accent focus:outline-none"
          />
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Variant</label>
        <select value={tc.variant || 'grid'} onChange={(e) => onChange({ tabsConfig: { ...tc, variant: e.target.value as any } })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none">
          <option value="grid">Grid</option>
          <option value="horizontal">Horizontal</option>
          <option value="products">Products</option>
        </select>
      </div>
    </div>
  );
}
