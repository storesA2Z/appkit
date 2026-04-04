import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Copy, Trash2 } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';

export function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const project = useAppkitStore((s) => s.project);
  const saveTheme = useAppkitStore((s) => s.saveTheme);
  const deleteTheme = useAppkitStore((s) => s.deleteTheme);
  const setActiveTheme = useAppkitStore((s) => s.setActiveTheme);
  const setActiveVariant = useAppkitStore((s) => s.setActiveVariant);

  const themes = project.themes ?? [];
  const activeTheme = themes.find((t) => t.id === project.activeThemeId);
  const activeVariant = activeTheme?.variants.find((v) => v.id === project.activeVariantId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSave = () => {
    if (!newThemeName.trim()) return;
    saveTheme(newThemeName.trim());
    setNewThemeName('');
    setShowNewInput(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-ide-text hover:text-ide-text-bright hover:bg-ide-hover rounded transition-colors"
      >
        {activeTheme && (
          <div className="flex gap-0.5">
            <span className="w-2 h-2 rounded-full" style={{ background: project.theme.colors.primary }} />
            <span className="w-2 h-2 rounded-full" style={{ background: project.theme.colors.accent }} />
          </div>
        )}
        <span className="truncate max-w-[100px]">
          {activeTheme ? `${activeTheme.name}${activeVariant ? ` / ${activeVariant.name}` : ''}` : 'No theme'}
        </span>
        <ChevronDown size={10} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[240px] bg-ide-panel border border-ide-border-bright rounded-lg shadow-dropdown z-50 animate-scale-in">
          <div className="p-1.5 max-h-[300px] overflow-y-auto scrollbar-ide">
            {themes.length === 0 && (
              <div className="px-2 py-3 text-center text-[10px] text-ide-text-dim">
                No saved themes yet
              </div>
            )}

            {themes.map((theme) => {
              const isActive = theme.id === project.activeThemeId;
              return (
                <div key={theme.id}>
                  <div
                    onClick={() => { setActiveTheme(theme.id); setOpen(false); }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${
                      isActive ? 'bg-ide-accent-dim text-ide-text-bright' : 'text-ide-text-muted hover:bg-ide-hover'
                    }`}
                  >
                    <div className="flex gap-0.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full border border-ide-border" style={{ background: theme.base.colors.primary }} />
                      <span className="w-2.5 h-2.5 rounded-full border border-ide-border" style={{ background: theme.base.colors.accent }} />
                    </div>
                    <span className="truncate flex-1">{theme.name}</span>
                    <span className="text-[9px] text-ide-text-dim">{theme.base.typography.fontFamily}</span>
                    {theme.variants.length > 0 && (
                      <span className="text-[8px] text-ide-text-dim bg-ide-active px-1 rounded">{theme.variants.length}v</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteTheme(theme.id); }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-ide-active rounded"
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>

                  {isActive && theme.variants.length > 0 && (
                    <div className="pl-6 py-0.5">
                      <button
                        onClick={() => { setActiveVariant(null); setOpen(false); }}
                        className={`w-full text-left px-2 py-1 rounded text-[10px] ${
                          !project.activeVariantId ? 'text-ide-accent' : 'text-ide-text-dim hover:text-ide-text'
                        }`}
                      >Base</button>
                      {theme.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => { setActiveVariant(v.id); setOpen(false); }}
                          className={`w-full text-left px-2 py-1 rounded text-[10px] ${
                            project.activeVariantId === v.id ? 'text-ide-accent' : 'text-ide-text-dim hover:text-ide-text'
                          }`}
                        >{v.name}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-ide-border p-1.5">
            {showNewInput ? (
              <div className="flex gap-1">
                <input
                  autoFocus
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="Theme name..."
                  className="flex-1 px-2 py-1 bg-ide-bg border border-ide-border rounded text-[10px] text-ide-text-bright outline-none focus:border-ide-accent"
                />
                <button onClick={handleSave} className="px-2 py-1 bg-ide-accent text-white rounded text-[10px]">Save</button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewInput(true)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[10px] text-ide-accent hover:bg-ide-accent-dim rounded transition-colors"
              >
                <Plus size={10} /> Save current as theme
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
