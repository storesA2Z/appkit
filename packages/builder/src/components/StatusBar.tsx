import React from 'react';
import { useAppkitStore } from '../store/appkit-store';

export function StatusBar() {
  const currentPage = useAppkitStore((s) => s.currentPage);
  const project = useAppkitStore((s) => s.project);
  const pageConfig = project.pages[currentPage];
  const sectionCount = pageConfig?.sections.length ?? 0;
  const activeTheme = (project.themes ?? []).find((t) => t.id === project.activeThemeId);

  return (
    <footer className="h-7 bg-ide-toolbar border-t border-ide-border flex items-center justify-between px-3 text-[10px] text-ide-text shrink-0">
      <div className="flex items-center gap-3">
        <span>{pageConfig?.icon} {pageConfig?.label} &middot; {sectionCount} sections</span>
        {activeTheme && <span>🎨 {activeTheme.name}</span>}
        <span>📐 375 × 812</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Saved
        </span>
        <span className="text-ide-text-dim">⌘K Command Palette</span>
      </div>
    </footer>
  );
}
