export const theme = {
  colors: {
    primary: '#1a1a2e',
    accent: '#e94560',
    background: '#ffffff',
    surface: '#faf5f0',
    text: '#1a1a2e',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    white: '#ffffff',
    black: '#000000',
    success: '#10b981',
    star: '#f59e0b',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
};

export type Theme = typeof theme;
