import React from 'react';
import { PAGE_TYPES, type PageType } from '@appkit/schema';
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
    <div className="flex items-center gap-0.5 bg-surface-1 rounded-lg p-0.5">
      {PAGE_TYPES.map((page) => {
        const Icon = pageIcons[page];
        const count = pages[page].length;
        const isActive = currentPage === page;

        return (
          <button
            key={page}
            onClick={() => setPage(page as PageType)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {Icon && <Icon size={13} />}
            {page}
            {count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${
                isActive ? 'bg-brand-100 text-brand-700' : 'bg-surface-3 text-gray-500'
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
