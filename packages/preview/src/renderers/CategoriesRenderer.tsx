import React from 'react';
import type { CategoriesConfig, ThemeConfig } from '@appkit/schema';

const categoryData = [
  { name: 'Women', emoji: '👗', color: '#fce7f3' },
  { name: 'Men', emoji: '👔', color: '#dbeafe' },
  { name: 'Shoes', emoji: '👟', color: '#fef3c7' },
  { name: 'Bags', emoji: '👜', color: '#d1fae5' },
  { name: 'Jewelry', emoji: '💍', color: '#ede9fe' },
  { name: 'Beauty', emoji: '✨', color: '#ffe4e6' },
];

export function CategoriesRenderer({ config, theme }: { config: CategoriesConfig; theme: ThemeConfig }) {
  const ids = config.collectionIds || [];
  const count = ids.length || 4;
  const isCircular = config.variant === 'circular';
  const items = Array.from({ length: Math.min(count, 6) }, (_, i) => ({
    name: ids[i] || categoryData[i]?.name || `Category ${i + 1}`,
    emoji: categoryData[i]?.emoji || '🛍️',
    color: categoryData[i]?.color || '#f3f4f6',
  }));

  return (
    <div style={{ padding: '14px 12px' }}>
      <div style={{
        display: 'flex',
        gap: isCircular ? 12 : 10,
        justifyContent: isCircular ? 'center' : 'flex-start',
        flexWrap: 'wrap',
        overflowX: isCircular ? 'visible' : 'auto',
      }}>
        {items.map((cat, i) => (
          <div key={i} style={{ textAlign: 'center', width: isCircular ? 64 : 82 }}>
            <div style={{
              width: isCircular ? 58 : 82,
              height: isCircular ? 58 : 68,
              backgroundColor: cat.color,
              borderRadius: isCircular ? '50%' : 14,
              marginBottom: 6,
              border: isCircular ? `3px solid ${theme.colors.primary}15` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 6px',
              fontSize: isCircular ? 22 : 26,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'transform 0.15s',
            }}>
              {cat.emoji}
            </div>
            <div style={{
              fontSize: 10,
              color: theme.colors.text,
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}>
              {cat.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
