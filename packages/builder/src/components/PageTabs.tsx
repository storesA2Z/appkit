import React from 'react';
import { Home, Compass, User, Search } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';

const pageIcons: Record<string, React.ElementType> = {
  home: Home,
  explore: Compass,
  profile: User,
  search: Search,
};

export function PageTabs() {
  const currentPage = useAppkitStore((s) => s.currentPage);
  const setPage = useAppkitStore((s) => s.setPage);
  const pages = useAppkitStore((s) => s.project.pages);

  return (
    <div className="flex items-center gap-0.5 bg-ide-bg rounded-lg p-0.5">
      {Object.entries(pages).map(([slug, pageConfig]) => {
        const Icon = pageIcons[slug];
        const count = pageConfig.sections.length;
        const isActive = currentPage === slug;

        return (
          <button
            key={slug}
            onClick={() => setPage(slug)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
              isActive
                ? 'bg-ide-panel text-ide-text-bright shadow-sm'
                : 'text-ide-text-muted hover:text-ide-text'
            }`}
          >
            {Icon && <Icon size={13} />}
            {pageConfig.label}
            {count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${
                isActive ? 'bg-ide-accent-dim text-ide-accent' : 'bg-ide-hover text-ide-text-muted'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
