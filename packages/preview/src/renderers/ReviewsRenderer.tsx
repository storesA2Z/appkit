import React from 'react';
import type { ReviewsConfig, ThemeConfig } from '@appkit/schema';

const reviewTexts = ['Love this product!', 'Excellent quality', 'Highly recommend', 'Great value'];

export function ReviewsRenderer({ config, theme }: { config: ReviewsConfig; theme: ThemeConfig }) {
  const rc = config.reviewsConfig;
  const count = rc.productLimit || 3;

  return (
    <div style={{ padding: '12px 14px' }}>
      {rc.title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: theme.colors.text, marginBottom: 10, letterSpacing: '-0.01em' }}>
          {rc.title}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
        {Array.from({ length: Math.min(count, 4) }, (_, i) => {
          const stars = 5 - (i % 2);
          return (
            <div key={i} style={{
              minWidth: 150,
              backgroundColor: '#fafafa',
              borderRadius: 10,
              padding: '10px 12px',
              border: '1px solid #f3f4f6',
            }}>
              <div style={{ display: 'flex', gap: 1, marginBottom: 6 }}>
                {Array.from({ length: 5 }, (_, s) => (
                  <span key={s} style={{ fontSize: 11, color: s < stars ? '#f59e0b' : '#e5e7eb' }}>&#9733;</span>
                ))}
              </div>
              <div style={{ fontSize: 11, color: theme.colors.text, fontWeight: 500, marginBottom: 3 }}>Product {i + 1}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', lineHeight: 1.4 }}>{reviewTexts[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
