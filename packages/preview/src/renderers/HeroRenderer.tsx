import React from 'react';
import type { HeroConfig, ThemeConfig } from '@appkit/schema';

export function HeroRenderer({ config, theme }: { config: HeroConfig; theme: ThemeConfig }) {
  const hc = config.heroConfig;
  const alignment = hc.textPosition === 'left' ? 'flex-start' : hc.textPosition === 'right' ? 'flex-end' : 'center';
  const textAlign = hc.textPosition || 'center';
  const hasImage = hc.imageUrl;
  const overlay = hc.overlayOpacity ?? 0.35;

  return (
    <div style={{
      height: hc.height || 260,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {hasImage ? (
        <>
          <img src={hc.imageUrl} alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: `rgba(0,0,0,${overlay})`,
          }} />
        </>
      ) : (
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: alignment,
        padding: '28px 24px',
        textAlign: textAlign as any,
      }}>
        {hc.title && (
          <div style={{
            fontSize: 24, fontWeight: 800, color: '#fff',
            lineHeight: 1.15, letterSpacing: '-0.03em',
            textShadow: '0 1px 3px rgba(0,0,0,0.15)',
            maxWidth: 280,
          }}>
            {hc.title}
          </div>
        )}
        {hc.subtitle && (
          <div style={{
            fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 8,
            lineHeight: 1.5, maxWidth: 260,
          }}>
            {hc.subtitle}
          </div>
        )}
        {hc.ctaText && (
          <div style={{
            marginTop: 16, padding: '10px 28px',
            backgroundColor: theme.colors.accent,
            borderRadius: 10, fontSize: 13, fontWeight: 700,
            color: '#fff', display: 'inline-block',
            letterSpacing: '0.02em',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            {hc.ctaText}
          </div>
        )}
      </div>
    </div>
  );
}
