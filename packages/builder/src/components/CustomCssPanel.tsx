import React, { useState, useEffect } from 'react';
import { useAppkitStore } from '../store/appkit-store';

const quickInserts = [
  { label: 'Shadow', value: '  "shadowColor": "#000",\n  "shadowOffset": { "width": 0, "height": 2 },\n  "shadowOpacity": 0.1,\n  "shadowRadius": 4' },
  { label: 'Border', value: '  "borderWidth": 1,\n  "borderColor": "#e5e7eb"' },
  { label: 'Rounded', value: '  "borderRadius": 16' },
  { label: 'Opacity', value: '  "opacity": 0.9' },
];

export function CustomCssPanel() {
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);
  const sections = useAppkitStore((s) => s.project.pages[s.currentPage]?.sections ?? []);
  const updateSectionCustomStyle = useAppkitStore((s) => s.updateSectionCustomStyle);

  const section = sections.find((s) => s.id === selectedSectionId);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (section?.customStyle) {
      setText(JSON.stringify(section.customStyle, null, 2));
    } else {
      setText('{\n  \n}');
    }
    setError(null);
  }, [selectedSectionId]);

  const handleApply = () => {
    if (!selectedSectionId) return;
    try {
      const parsed = JSON.parse(text);
      updateSectionCustomStyle(selectedSectionId, parsed);
      setError(null);
    } catch (e) {
      setError('Invalid JSON');
    }
  };

  const handleInsert = (value: string) => {
    const trimmed = text.replace(/\s*\}$/, '');
    const needsComma = trimmed.replace(/\{\s*/, '').trim().length > 0;
    setText(`${trimmed}${needsComma ? ',' : ''}\n${value}\n}`);
  };

  if (!section) {
    return (
      <div className="p-4 text-center text-xs text-ide-text-dim">
        Select a section to edit custom styles
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-ide-text-dim uppercase tracking-wider">Custom Style (RN)</span>
        <button
          onClick={() => { setText('{\n  \n}'); if (selectedSectionId) updateSectionCustomStyle(selectedSectionId, {}); }}
          className="text-[9px] text-ide-text-dim hover:text-ide-text"
        >Reset</button>
      </div>

      <div className="flex flex-wrap gap-1">
        {quickInserts.map((qi) => (
          <button
            key={qi.label}
            onClick={() => handleInsert(qi.value)}
            className="px-2 py-0.5 text-[9px] bg-ide-bg border border-ide-border rounded hover:border-ide-accent-border text-ide-text-muted hover:text-ide-accent transition-colors"
          >{qi.label}</button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleApply}
        className="w-full h-[200px] px-3 py-2 bg-ide-bg border border-ide-border rounded-md text-[11px] text-ide-text-bright font-mono outline-none focus:border-ide-accent resize-none scrollbar-ide"
        spellCheck={false}
      />

      {error && <div className="text-[10px] text-red-400">{error}</div>}

      <button
        onClick={handleApply}
        className="w-full py-1.5 text-[10px] font-medium bg-ide-accent text-white rounded-md hover:opacity-90 transition-opacity"
      >Apply Styles</button>
    </div>
  );
}
