import React from 'react';
import type { ProductsConfig, ThemeConfig } from '@appkit/schema';

const mockProducts = [
  { name: 'Cashmere Blend Sweater', price: '$89.00', oldPrice: '$120.00', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop', rating: 4.8 },
  { name: 'Leather Tote Bag', price: '$145.00', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=400&fit=crop', rating: 4.6 },
  { name: 'Silk Wrap Dress', price: '$195.00', oldPrice: '$260.00', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop', rating: 4.9 },
  { name: 'Classic White Sneakers', price: '$75.00', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop', rating: 4.7 },
  { name: 'Denim Jacket', price: '$110.00', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop', rating: 4.5 },
  { name: 'Gold Hoop Earrings', price: '$42.00', oldPrice: '$58.00', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=400&fit=crop', rating: 4.9 },
];

export function ProductsRenderer({ config, theme }: { config: ProductsConfig; theme: ThemeConfig }) {
  const count = config.limit || 4;
  const isGrid = config.layout === 'grid' || config.variant === 'grid';
  const products = mockProducts.slice(0, Math.min(count, 6));

  return (
    <div style={{ padding: '12px 14px' }}>
      {config.title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>{config.title}</div>
          {config.showSeeAll && <div style={{ fontSize: 12, color: theme.colors.accent, fontWeight: 600, cursor: 'pointer' }}>See All &rsaquo;</div>}
        </div>
      )}
      {config.subtitle && (
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12, marginTop: -6, lineHeight: 1.4 }}>{config.subtitle}</div>
      )}
      <div style={{
        display: 'flex',
        flexWrap: isGrid ? 'wrap' : 'nowrap',
        gap: 10,
        overflowX: isGrid ? 'visible' : 'auto',
      }}>
        {products.map((p, i) => (
          <div key={i} style={{
            width: isGrid ? 'calc(50% - 5px)' : 140,
            minWidth: isGrid ? undefined : 140,
            flexShrink: 0,
          }}>
            <div style={{
              height: isGrid ? 160 : 140,
              borderRadius: 12,
              marginBottom: 8,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f8f8f8',
            }}>
              <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {p.oldPrice && (
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  backgroundColor: theme.colors.accent, color: '#fff',
                  fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                  letterSpacing: '0.02em',
                }}>SALE</div>
              )}
              <div style={{
                position: 'absolute', top: 8, right: 8,
                width: 26, height: 26, borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#9ca3af',
              }}>&#9825;</div>
            </div>
            <div style={{ fontSize: 11, color: theme.colors.text, fontWeight: 500, lineHeight: 1.3, marginBottom: 3 }}>{p.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
              <span style={{ fontSize: 9, color: '#f59e0b' }}>{'★'.repeat(Math.floor(p.rating))}</span>
              <span style={{ fontSize: 9, color: '#d1d5db' }}>{'★'.repeat(5 - Math.floor(p.rating))}</span>
              <span style={{ fontSize: 9, color: '#9ca3af' }}>{p.rating}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 13, color: theme.colors.text, fontWeight: 700 }}>{p.price}</span>
              {p.oldPrice && <span style={{ fontSize: 10, color: '#9ca3af', textDecoration: 'line-through' }}>{p.oldPrice}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
