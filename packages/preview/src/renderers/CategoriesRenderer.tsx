import React from 'react';
import type { CategoriesConfig, ThemeConfig } from '@appkit/schema';

export function CategoriesRenderer({ config, theme }: { config: CategoriesConfig; theme: ThemeConfig }) {
  const count = config.collectionIds?.length || 4;
  const isCircular = config.variant === 'circular';

  return (
    <div style={{ padding: 12 }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
      }}>
        {Array.from({ length: Math.min(count, 6) }, (_, i) => (
          <div key={i} style={{ textAlign: 'center', width: isCircular ? 56 : 80 }}>
            <div style={{
              width: isCircular ? 56 : 80,
              height: isCircular ? 56 : 60,
              backgroundColor: `${theme.colors.primary}15`,
              borderRadius: isCircular ? '50%' : 8,
              marginBottom: 4,
            }} />
            <div style={{ fontSize: 10, color: theme.colors.text }}>Cat {i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
