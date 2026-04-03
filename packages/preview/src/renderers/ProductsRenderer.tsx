import React from 'react';
import type { ProductsConfig, ThemeConfig } from '@appkit/schema';

export function ProductsRenderer({ config, theme }: { config: ProductsConfig; theme: ThemeConfig }) {
  const count = config.limit || 4;
  const isGrid = config.layout === 'grid';

  return (
    <div style={{ padding: 12 }}>
      {config.title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text }}>{config.title}</div>
          {config.showSeeAll && <div style={{ fontSize: 11, color: theme.colors.accent }}>See All</div>}
        </div>
      )}
      {config.subtitle && (
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>{config.subtitle}</div>
      )}
      <div style={{
        display: 'flex',
        flexWrap: isGrid ? 'wrap' : 'nowrap',
        gap: 8,
        overflowX: isGrid ? 'visible' : 'auto',
      }}>
        {Array.from({ length: Math.min(count, 6) }, (_, i) => (
          <div key={i} style={{
            width: isGrid ? 'calc(50% - 4px)' : 120,
            minWidth: isGrid ? undefined : 120,
            flexShrink: 0,
          }}>
            <div style={{
              height: isGrid ? 120 : 100,
              backgroundColor: `${theme.colors.primary}10`,
              borderRadius: 8,
              marginBottom: 6,
            }} />
            <div style={{ fontSize: 11, color: theme.colors.text, fontWeight: 500 }}>Product {i + 1}</div>
            <div style={{ fontSize: 10, color: theme.colors.accent, marginTop: 2 }}>$29.99</div>
          </div>
        ))}
      </div>
    </div>
  );
}
