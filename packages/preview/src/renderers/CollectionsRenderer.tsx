import React from 'react';
import type { CollectionsConfig, ThemeConfig } from '@appkit/schema';

export function CollectionsRenderer({ config, theme }: { config: CollectionsConfig; theme: ThemeConfig }) {
  const count = config.collectionIds?.length || 3;

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {Array.from({ length: Math.min(count, 6) }, (_, i) => (
          <div key={i} style={{
            minWidth: 130,
            height: 160,
            backgroundColor: `${theme.colors.primary}08`,
            borderRadius: 10,
            border: '1px solid #f3f4f6',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{ flex: 1, backgroundColor: `${theme.colors.primary}12` }} />
            <div style={{ padding: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.colors.text }}>Collection {i + 1}</div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>12 items</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
