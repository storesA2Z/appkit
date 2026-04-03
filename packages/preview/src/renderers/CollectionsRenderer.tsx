import React from 'react';
import type { CollectionsConfig, ThemeConfig } from '@appkit/schema';

const collectionNames = ['New In', 'Trending', 'Sale', 'Bestsellers', 'Limited', 'Classics'];

export function CollectionsRenderer({ config, theme }: { config: CollectionsConfig; theme: ThemeConfig }) {
  const ids = config.collectionIds || [];
  const count = ids.length || 3;

  return (
    <div style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
        {Array.from({ length: Math.min(count, 6) }, (_, i) => (
          <div key={i} style={{
            minWidth: 140,
            height: 170,
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #f3f4f6',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              flex: 1,
              backgroundColor: `${theme.colors.primary}0a`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: `${theme.colors.primary}12`,
              }} />
            </div>
            <div style={{ padding: '8px 10px', backgroundColor: '#fff' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text }}>
                {ids[i] || collectionNames[i] || `Collection ${i + 1}`}
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>{8 + i * 4} items</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
