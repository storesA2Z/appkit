import React from 'react';
import type { FlashSaleConfig, ThemeConfig } from '@appkit/schema';

export function FlashSaleRenderer({ config, theme }: { config: FlashSaleConfig; theme: ThemeConfig }) {
  const fc = config.flashSaleConfig;
  const bg = fc.styling?.backgroundColor || theme.colors.accent;
  const textColor = fc.styling?.textColor || '#fff';

  return (
    <div style={{
      backgroundColor: bg,
      padding: '14px 16px',
      color: textColor,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>{fc.title || 'Flash Sale'}</div>
          {fc.subtitle && <div style={{ fontSize: 11, marginTop: 3, opacity: 0.85 }}>{fc.subtitle}</div>}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ val: '08', label: 'hrs' }, { val: '42', label: 'min' }, { val: '17', label: 'sec' }].map(({ val, label }) => (
            <div key={label} style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              padding: '5px 8px',
              borderRadius: 6,
              textAlign: 'center',
              minWidth: 36,
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{val}</div>
              <div style={{ fontSize: 8, fontWeight: 500, opacity: 0.7, textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      {fc.ctaText && (
        <div style={{
          marginTop: 12,
          padding: '7px 18px',
          backgroundColor: fc.styling?.ctaBackgroundColor || '#fff',
          color: fc.styling?.ctaTextColor || bg,
          borderRadius: 6,
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
