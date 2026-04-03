import React from 'react';
import type { HeaderConfig, ThemeConfig } from '@appkit/schema';

export function HeaderRenderer({ config, theme }: { config: HeaderConfig; theme: ThemeConfig }) {
  return (
    <div style={{
      padding: '12px 16px',
      fontSize: 15,
      fontWeight: 600,
      color: theme.colors.text,
      borderBottom: '1px solid #f3f4f6',
    }}>
      {config.text || 'Header'}
    </div>
  );
}
