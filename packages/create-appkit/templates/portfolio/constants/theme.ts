export const theme = {
  colors: {
    primary: '#0f172a',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    white: '#ffffff',
    black: '#000000',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
};

export type Theme = typeof theme;
