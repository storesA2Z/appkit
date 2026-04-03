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
          : `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.accent}40)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 16,
      }}>
        {first?.title && (
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.colors.text }}>{first.title}</div>
        )}
        {first?.subtitle && (
          <div style={{ fontSize: 12, color: theme.colors.text, opacity: 0.7, marginTop: 2 }}>{first.subtitle}</div>
        )}
        {!first && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: 13 }}>
            Banner carousel
          </div>
        )}
      </div>
      {items.length > 1 && (
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
          {items.map((_, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === 0 ? theme.colors.accent : '#d1d5db' }} />
          ))}
        </div>
      )}
    </div>
  );
}
