import React from 'react';
import type { HeaderConfig, ThemeConfig } from '@appkit/schema';

export function HeaderRenderer({ config, theme }: { config: HeaderConfig; theme: ThemeConfig }) {
  return (
    <div style={{
      padding: '14px 16px 6px',
    }}>
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        color: theme.colors.text,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      }}>
        {config.text || 'Section Header'}
      </div>
      <div style={{
        width: 28,
        height: 3,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
        marginTop: 6,
        opacity: 0.6,
      }} />
    </div>
  );
}
