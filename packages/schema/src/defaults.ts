import type { ThemeConfig, AppMetadata, AppLayout } from './types';

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

export function createDefaultLayout(): AppLayout {
  return {
    pages: {
      home: [],
      explore: [],
      profile: [],
      search: [],
    },
    theme: createDefaultTheme(),
    metadata: createDefaultMetadata(),
  };
}
