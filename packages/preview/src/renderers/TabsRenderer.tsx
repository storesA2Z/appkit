import React from 'react';
import type { TabsConfig, ThemeConfig } from '@appkit/schema';

const tabProducts = [
  { name: 'Linen Blazer', price: '$165.00', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop' },
  { name: 'Pleated Skirt', price: '$78.00', img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&h=400&fit=crop' },
  { name: 'Cotton Cardigan', price: '$95.00', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a20?w=300&h=400&fit=crop' },
];

export function TabsRenderer({ config, theme }: { config: TabsConfig; theme: ThemeConfig }) {
  const tc = config.tabsConfig;
  const tabs = tc.tabs || [];
  const activeIndex = tc.defaultTabIndex || 0;

  return (
    <div>
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #f3f4f6',
        padding: '0 14px',
        gap: 0,
      }}>
        {tabs.map((tab, i) => (
          <div key={tab.id} style={{
            padding: '12px 16px',
            fontSize: 13,
            fontWeight: i === activeIndex ? 700 : 400,
            color: i === activeIndex ? theme.colors.primary : '#9ca3af',
            borderBottom: `2px solid ${i === activeIndex ? theme.colors.primary : 'transparent'}`,
            marginBottom: -2,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
          }}>
            {tab.title}
          </div>
        ))}
        {tabs.length === 0 && (
          <div style={{ padding: '12px 16px', fontSize: 12, color: '#d1d5db', fontStyle: 'italic' }}>Add tabs to configure</div>
        )}
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', gap: 10 }}>
        {tabProducts.map((p, i) => (
          <div key={i} style={{ width: 120, flexShrink: 0 }}>
            <div style={{
              height: 130,
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 8,
              position: 'relative',
              backgroundColor: '#f8f8f8',
            }}>
              <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{
                position: 'absolute', top: 6, right: 6,
                width: 24, height: 24, borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.85)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: '#9ca3af',
              }}>♡</div>
            </div>
            <div style={{ fontSize: 11, color: theme.colors.text, fontWeight: 500, lineHeight: 1.3 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: theme.colors.text, fontWeight: 700, marginTop: 3 }}>{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
