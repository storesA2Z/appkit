import React from 'react';
import type { HeroConfig, ThemeConfig } from '@appkit/schema';

export function HeroRenderer({ config, theme }: { config: HeroConfig; theme: ThemeConfig }) {
  const hc = config.heroConfig;
  return (
    <div style={{
      height: hc.height || 240,
      background: hc.imageUrl
        ? `linear-gradient(rgba(0,0,0,${hc.overlayOpacity || 0.3}), rgba(0,0,0,${hc.overlayOpacity || 0.3})), url(${hc.imageUrl}) center/cover`
        : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: hc.textPosition === 'left' ? 'flex-start' : hc.textPosition === 'right' ? 'flex-end' : 'center',
      padding: '24px 16px',
      color: '#fff',
    }}>
      {hc.title && <div style={{ fontSize: 20, fontWeight: 700 }}>{hc.title}</div>}
      {hc.subtitle && <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>{hc.subtitle}</div>}
      {hc.ctaText && (
        <div style={{
          marginTop: 12,
          padding: '8px 20px',
          backgroundColor: theme.colors.accent,
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
        }}>
          {hc.ctaText}
        </div>
      )}
    </div>
  );
}
