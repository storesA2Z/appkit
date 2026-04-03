import React from 'react';
import type { FlashSaleConfig, ThemeConfig } from '@appkit/schema';

export function FlashSaleRenderer({ config, theme }: { config: FlashSaleConfig; theme: ThemeConfig }) {
  const fc = config.flashSaleConfig;
  const bg = fc.styling?.backgroundColor || theme.colors.accent;
  const textColor = fc.styling?.textColor || '#fff';

  return (
    <div style={{
      backgroundColor: bg,
      padding: '16px',
      color: textColor,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>{fc.title || 'Flash Sale'}</div>
      {fc.subtitle && <div style={{ fontSize: 11, marginTop: 2, opacity: 0.9 }}>{fc.subtitle}</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {['HH', 'MM', 'SS'].map((unit) => (
          <div key={unit} style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '6px 10px',
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 700,
            textAlign: 'center',
          }}>
            <div>00</div>
            <div style={{ fontSize: 8, fontWeight: 400 }}>{unit}</div>
          </div>
        ))}
      </div>
      {fc.ctaText && (
        <div style={{
          marginTop: 10,
          padding: '6px 16px',
          backgroundColor: fc.styling?.ctaBackgroundColor || '#fff',
          color: fc.styling?.ctaTextColor || bg,
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 600,
          display: 'inline-block',
        }}>
          {fc.ctaText}
        </div>
      )}
    </div>
  );
}
