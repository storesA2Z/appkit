import React from 'react';
import type { HeaderConfig, ThemeConfig } from '@appkit/schema';

export function HeaderRenderer({ config, theme }: { config: HeaderConfig; theme: ThemeConfig }) {
  return (
    <div style={{
      padding: '18px 16px 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{
        fontSize: 17,
        fontWeight: 800,
        color: theme.colors.text,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      }}>
        {config.text || 'Header'}
      </div>
      <div style={{
        flex: 1,
        height: 2,
        background: `linear-gradient(90deg, ${theme.colors.primary}25, transparent)`,
        borderRadius: 1,
      }} />
    </div>
  );
}
