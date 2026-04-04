import React from 'react';
import type { BannerConfig, ThemeConfig } from '@appkit/schema';

export function BannerRenderer({ config, theme }: { config: BannerConfig; theme: ThemeConfig }) {
  const items = config.data || [];
  const first = items[0];
  const hasImage = first?.imageUrl;

  return (
    <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
      {hasImage ? (
        <img src={first.imageUrl} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }} />
      ) : (
        <div style={{
          height: '100%',
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
        }} />
      )}
      {first && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '48px 18px 18px',
          background: hasImage
            ? 'linear-gradient(transparent, rgba(0,0,0,0.6))'
            : 'linear-gradient(transparent, rgba(0,0,0,0.2))',
        }}>
          {first.title && (
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{first.title}</div>
          )}
          {first.subtitle && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4, lineHeight: 1.4 }}>{first.subtitle}</div>
          )}
        </div>
      )}
      {!first && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500,
        }}>
          Add slides to this banner
        </div>
      )}
      {items.length > 1 && (
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
          {items.map((_, i) => (
            <div key={i} style={{
              width: i === 0 ? 18 : 6, height: 6, borderRadius: 100,
              backgroundColor: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'width 0.2s',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
