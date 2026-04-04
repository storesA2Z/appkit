import type { ThemeConfig, AppMetadata, AppLayout, PageConfig, Section, SavedTheme } from './types';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createDefaultTheme(): ThemeConfig {
  return {
    colors: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#e94560',
      background: '#ffffff',
      text: '#1a1a2e',
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: '14px',
      fontWeight: '400',
    },
    layout: {
      borderRadius: '8px',
      spacing: '16px',
    },
  };
}

export function createDefaultMetadata(): AppMetadata {
  return {
    name: 'My App',
    description: '',
    version: '1.0.0',
  };
}

function createCorePage(label: string, slug: string, icon: string, sections: Section[] = []): PageConfig {
  return { label, slug, icon, isCore: true, navType: 'tab', sections };
}

function createDefaultSections(): Section[] {
  return [
    {
      id: uid(),
      type: 'banner',
      config: {
        type: 'banner',
        data: [
          { mediaType: 'image', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', title: 'New Arrivals', subtitle: 'Shop the latest collection' },
          { mediaType: 'image', imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800', title: 'Summer Sale', subtitle: 'Up to 50% off' },
        ],
        bannerConfig: { autoplay: true, autoplaySpeed: 4000, showDots: true, loop: true },
      },
    },
    {
      id: uid(),
      type: 'categories',
      config: {
        type: 'categories',
        collectionIds: ['women', 'men', 'shoes', 'bags', 'jewelry'],
        variant: 'circular',
      },
    },
    {
      id: uid(),
      type: 'products',
      config: {
        type: 'products',
        collectionId: 'featured',
        title: 'Featured Products',
        subtitle: 'Handpicked for you',
        showSeeAll: true,
        layout: 'horizontal',
        cardSize: 'medium',
        limit: 6,
      },
    },
    {
      id: uid(),
      type: 'flash_sale',
      config: {
        type: 'flash_sale',
        flashSaleConfig: {
          endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          title: 'Flash Sale',
          subtitle: 'Limited time offers',
          displayMode: 'standalone',
        },
      },
    },
  ];
}

function createExampleThemes(): SavedTheme[] {
  return [
    {
      id: uid(),
      name: 'Minimal Light',
      base: {
        colors: { primary: '#111827', secondary: '#374151', accent: '#3b82f6', background: '#ffffff', text: '#111827' },
        typography: { fontFamily: 'Inter', fontSize: '14px', fontWeight: '400' },
        layout: { borderRadius: '12px', spacing: '16px' },
      },
      variants: [
        {
          id: uid(),
          name: 'Warm',
          overrides: { colors: { primary: '#78350f', secondary: '#92400e', accent: '#f59e0b', background: '#fffbeb', text: '#78350f' } },
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      name: 'Bold Dark',
      base: {
        colors: { primary: '#f8fafc', secondary: '#cbd5e1', accent: '#8b5cf6', background: '#0f172a', text: '#f8fafc' },
        typography: { fontFamily: 'Inter', fontSize: '14px', fontWeight: '500' },
        layout: { borderRadius: '16px', spacing: '20px' },
      },
      variants: [
        {
          id: uid(),
          name: 'Neon',
          overrides: { colors: { primary: '#f0fdf4', secondary: '#bbf7d0', accent: '#22c55e', background: '#052e16', text: '#f0fdf4' } },
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ];
}

export function createDefaultLayout(): AppLayout {
  return {
    pages: {
      home: createCorePage('Home', 'home', '🏠', createDefaultSections()),
      explore: createCorePage('Explore', 'explore', '🔍'),
      profile: createCorePage('Profile', 'profile', '👤'),
      search: createCorePage('Search', 'search', '🔎'),
    },
    theme: createDefaultTheme(),
    themes: createExampleThemes(),
    activeThemeId: '',
    metadata: createDefaultMetadata(),
  };
}
