import React from 'react';
import type { ReviewsConfig, ThemeConfig } from '@appkit/schema';

export function ReviewsRenderer({ config, theme }: { config: ReviewsConfig; theme: ThemeConfig }) {
  const rc = config.reviewsConfig;
  const count = rc.productLimit || 3;

  return (
    <div style={{ padding: 12 }}>
      {rc.title && <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text, marginBottom: 8 }}>{rc.title}</div>}
      {rc.subtitle && <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>{rc.subtitle}</div>}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {Array.from({ length: Math.min(count, 4) }, (_, i) => (
          <div key={i} style={{
            minWidth: 140,
            backgroundColor: '#f9fafb',
            borderRadius: 8,
            padding: 10,
          }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
              {Array.from({ length: 5 }, (_, s) => (
                <span key={s} style={{ fontSize: 10, color: s < 4 ? '#f59e0b' : '#d1d5db' }}>★</span>
              ))}
            </div>
            <div style={{ fontSize: 10, color: theme.colors.text, fontWeight: 500 }}>Product {i + 1}</div>
            <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2 }}>Great product!</div>
          </div>
        ))}
      </div>
    </div>
  );
}
