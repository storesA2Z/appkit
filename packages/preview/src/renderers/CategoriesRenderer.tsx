import React from 'react';
import type { CategoriesConfig, ThemeConfig } from '@appkit/schema';

const categoryNames = ['Tops', 'Shoes', 'Bags', 'Jewelry', 'Dresses', 'Beauty'];

export function CategoriesRenderer({ config, theme }: { config: CategoriesConfig; theme: ThemeConfig }) {
  const ids = config.collectionIds || [];
  const count = ids.length || 4;
  const isCircular = config.variant === 'circular';

  return (
    <div style={{ padding: '14px 12px' }}>
      <div style={{
        display: 'flex',
        gap: isCircular ? 16 : 10,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {Array.from({ length: Math.min(count, 6) }, (_, i) => (
          <div key={i} style={{ textAlign: 'center', width: isCircular ? 60 : 82 }}>
            <div style={{
              width: isCircular ? 56 : 82,
              height: isCircular ? 56 : 64,
              backgroundColor: `${theme.colors.primary}${isCircular ? '10' : '08'}`,
              borderRadius: isCircular ? '50%' : 12,
              marginBottom: 6,
              border: isCircular ? `2px solid ${theme.colors.primary}20` : '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 6px',
            }}>
              <div style={{
                width: isCircular ? 20 : 24,
                height: isCircular ? 20 : 24,
                borderRadius: isCircular ? '50%' : 6,
                backgroundColor: `${theme.colors.primary}18`,
              }} />
            </div>
            <div style={{ fontSize: 10, color: theme.colors.text, fontWeight: 500 }}>
              {ids[i] || categoryNames[i] || `Cat ${i + 1}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
