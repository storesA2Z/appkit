import React from 'react';
import type { BannerConfig, ThemeConfig } from '@appkit/schema';

export function BannerRenderer({ config, theme }: { config: BannerConfig; theme: ThemeConfig }) {
  const items = config.data || [];
  const first = items[0];

  return (
    <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        background: first?.imageUrl
          ? `url(${first.imageUrl}) center/cover`
          : `linear-gradient(135deg, ${theme.colors.primary}30, ${theme.colors.accent}20)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 16,
      }}>
        {first?.title && (
          <div style={{ fontSize: 17, fontWeight: 700, color: theme.colors.text, lineHeight: 1.2 }}>{first.title}</div>
        )}
        {first?.subtitle && (
          <div style={{ fontSize: 12, color: theme.colors.text, opacity: 0.6, marginTop: 3 }}>{first.subtitle}</div>
        )}
        {!first && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', color: '#9ca3af', fontSize: 12, fontWeight: 500,
          }}>
            Add slides to this banner
          </div>
        )}
      </div>
      {items.length > 1 && (
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
          {items.map((_, i) => (
            <div key={i} style={{
              width: i === 0 ? 16 : 6, height: 6, borderRadius: 100,
              backgroundColor: i === 0 ? theme.colors.accent : 'rgba(255,255,255,0.5)',
              transition: 'width 0.2s',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
