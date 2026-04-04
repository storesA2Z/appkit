import type { AppLayout, PageConfig, Section } from './types';

const CORE_PAGES: Record<string, { label: string; icon: string }> = {
  home: { label: 'Home', icon: '🏠' },
  explore: { label: 'Explore', icon: '🔍' },
  profile: { label: 'Profile', icon: '👤' },
  search: { label: 'Search', icon: '🔎' },
};

function isOldFormat(pages: any): pages is Record<string, Section[]> {
  const firstValue = Object.values(pages)[0];
  return Array.isArray(firstValue);
}

function isNewFormat(pages: any): pages is Record<string, PageConfig> {
  const firstValue = Object.values(pages)[0] as any;
  return firstValue && typeof firstValue === 'object' && 'label' in firstValue;
}

export function migrateLayout(layout: any): AppLayout {
  if (!layout || !layout.pages) return layout;

  if (isNewFormat(layout.pages)) {
    return layout as AppLayout;
  }

  if (isOldFormat(layout.pages)) {
    const newPages: Record<string, PageConfig> = {};

    for (const [key, sections] of Object.entries(layout.pages)) {
      const corePage = CORE_PAGES[key];
      newPages[key] = {
        label: corePage?.label ?? key,
        slug: key,
        icon: corePage?.icon,
        isCore: key in CORE_PAGES,
        navType: 'tab',
        sections: sections as Section[],
      };
    }

    return {
      ...layout,
      pages: newPages,
      themes: layout.themes ?? [],
      activeThemeId: layout.activeThemeId ?? '',
    };
  }

  return layout;
}
