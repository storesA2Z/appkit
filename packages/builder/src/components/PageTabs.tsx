import React from 'react';
import { PAGE_TYPES, type PageType } from '@appkit/schema';
import { useAppkitStore } from '../store/appkit-store';

export function PageTabs() {
  const currentPage = useAppkitStore((s) => s.currentPage);
  const setPage = useAppkitStore((s) => s.setPage);
  const pages = useAppkitStore((s) => s.project.pages);

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {PAGE_TYPES.map((page) => (
        <button
          key={page}
          onClick={() => setPage(page as PageType)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
            currentPage === page
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {page} ({pages[page].length})
        </button>
      ))}
    </div>
  );
}
