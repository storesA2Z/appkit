import React from 'react';
import type { CollectionsConfig, ThemeConfig } from '@appkit/schema';

const mockCollections = [
  { name: 'New Arrivals', count: 42, img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=400&fit=crop' },
  { name: 'Trending Now', count: 28, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=400&fit=crop' },
  { name: 'Best Sellers', count: 56, img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop' },
  { name: 'Summer Edit', count: 34, img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop' },
  { name: 'Sale', count: 67, img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=400&fit=crop' },
  { name: 'Essentials', count: 21, img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=400&fit=crop' },
];

export function CollectionsRenderer({ config, theme }: { config: CollectionsConfig; theme: ThemeConfig }) {
  const ids = config.collectionIds || [];
  const count = ids.length || 3;
  const collections = Array.from({ length: Math.min(count, 6) }, (_, i) => ({
    name: ids[i] || mockCollections[i]?.name || `Collection ${i + 1}`,
    count: mockCollections[i]?.count || 15,
    img: mockCollections[i]?.img || '',
  }));

  return (
    <div style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
        {collections.map((col, i) => (
          <div key={i} style={{
            minWidth: 150,
            height: 190,
            borderRadius: 14,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          }}>
            <img src={col.img} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '40px 12px 12px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{col.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: 500 }}>{col.count} items</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
