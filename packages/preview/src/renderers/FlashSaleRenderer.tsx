import React from 'react';
import type { FlashSaleConfig, ThemeConfig } from '@appkit/schema';

export function FlashSaleRenderer({ config, theme }: { config: FlashSaleConfig; theme: ThemeConfig }) {
  const fc = config.flashSaleConfig;
  const bg = fc.styling?.backgroundColor || theme.colors.accent;
  const textColor = fc.styling?.textColor || '#fff';

  return (
    <div style={{
      background: `linear-gradient(135deg, ${bg}, ${bg}dd)`,
      padding: '16px 18px',
      color: textColor,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100, borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.06)',
      }} />
      <div style={{
        position: 'absolute', bottom: -30, left: 20,
        width: 80, height: 80, borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.04)',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>{fc.title || 'Flash Sale'}</div>
          </div>
          {fc.subtitle && <div style={{ fontSize: 11, marginTop: 2, opacity: 0.85, lineHeight: 1.4 }}>{fc.subtitle}</div>}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[{ val: '08', label: 'HRS' }, { val: '42', label: 'MIN' }, { val: '17', label: 'SEC' }].map(({ val, label }) => (
            <div key={label} style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '6px 8px',
              borderRadius: 8,
              textAlign: 'center',
              minWidth: 38,
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{val}</div>
              <div style={{ fontSize: 7, fontWeight: 700, opacity: 0.6, letterSpacing: '0.08em', marginTop: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      {fc.ctaText && (
        <div style={{
          marginTop: 14,
          padding: '8px 20px',
          backgroundColor: fc.styling?.ctaBackgroundColor || '#fff',
          color: fc.styling?.ctaTextColor || bg,
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 700,
          display: 'inline-block',
          letterSpacing: '0.01em',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}>
          {fc.ctaText}
        </div>
      )}
    </div>
  );
}
