import type { ThemeConfig, AppMetadata, AppLayout, PageConfig } from './types';

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

function createCorePage(label: string, slug: string, icon: string): PageConfig {
  return { label, slug, icon, isCore: true, navType: 'tab', sections: [] };
}

export function createDefaultLayout(): AppLayout {
  return {
    pages: {
      home: createCorePage('Home', 'home', '🏠'),
      explore: createCorePage('Explore', 'explore', '🔍'),
      profile: createCorePage('Profile', 'profile', '👤'),
      search: createCorePage('Search', 'search', '🔎'),
    },
    theme: createDefaultTheme(),
    themes: [],
    activeThemeId: '',
    metadata: createDefaultMetadata(),
  };
}
