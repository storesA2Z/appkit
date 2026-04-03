import React from 'react';
import type { HeroConfig, ThemeConfig } from '@appkit/schema';

export function HeroRenderer({ config, theme }: { config: HeroConfig; theme: ThemeConfig }) {
  const hc = config.heroConfig;
  const alignment = hc.textPosition === 'left' ? 'flex-start' : hc.textPosition === 'right' ? 'flex-end' : 'center';
  const textAlign = hc.textPosition || 'center';

  return (
    <div style={{
      height: hc.height || 240,
      background: hc.imageUrl
        ? `linear-gradient(rgba(0,0,0,${hc.overlayOpacity || 0.3}), rgba(0,0,0,${(hc.overlayOpacity || 0.3) + 0.15})), url(${hc.imageUrl}) center/cover`
        : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: alignment,
      padding: '24px 20px',
      color: '#fff',
      textAlign: textAlign as any,
    }}>
      {hc.title && <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{hc.title}</div>}
      {hc.subtitle && <div style={{ fontSize: 13, marginTop: 6, opacity: 0.85, lineHeight: 1.4 }}>{hc.subtitle}</div>}
      {hc.ctaText && (
        <div style={{
          marginTop: 14,
          padding: '9px 24px',
          backgroundColor: theme.colors.accent,
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          display: 'inline-block',
          letterSpacing: '0.01em',
        }}>
          {hc.ctaText}
        </div>
      )}
    </div>
  );
}
