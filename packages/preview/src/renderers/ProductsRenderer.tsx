import React from 'react';
import type { ProductsConfig, ThemeConfig } from '@appkit/schema';

export function ProductsRenderer({ config, theme }: { config: ProductsConfig; theme: ThemeConfig }) {
  const count = config.limit || 4;
  const isGrid = config.variant === 'grid';
  const prices = ['$24.99', '$18.50', '$32.00', '$15.99', '$42.00', '$9.99'];

  return (
    <div style={{ padding: '12px 14px' }}>
      {config.title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.01em' }}>{config.title}</div>
          {config.showSeeAll && <div style={{ fontSize: 12, color: theme.colors.accent, fontWeight: 500 }}>See all &rsaquo;</div>}
        </div>
      )}
      {config.subtitle && (
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10, marginTop: -4 }}>{config.subtitle}</div>
      )}
      <div style={{
        display: 'flex',
        flexWrap: isGrid ? 'wrap' : 'nowrap',
        gap: 10,
        overflowX: isGrid ? 'visible' : 'auto',
      }}>
        {Array.from({ length: Math.min(count, 6) }, (_, i) => (
          <div key={i} style={{
            width: isGrid ? 'calc(50% - 5px)' : 130,
            minWidth: isGrid ? undefined : 130,
            flexShrink: 0,
          }}>
            <div style={{
              height: isGrid ? 130 : 110,
              backgroundColor: `${theme.colors.primary}08`,
              borderRadius: 10,
              marginBottom: 8,
              border: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: `${theme.colors.primary}12`,
              }} />
            </div>
            <div style={{ fontSize: 12, color: theme.colors.text, fontWeight: 500, lineHeight: 1.3 }}>Product {i + 1}</div>
            <div style={{ fontSize: 12, color: theme.colors.accent, fontWeight: 600, marginTop: 2 }}>{prices[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
