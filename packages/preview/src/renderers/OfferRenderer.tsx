import React from 'react';
import type { OfferConfig, ThemeConfig } from '@appkit/schema';

export function OfferRenderer({ config, theme }: { config: OfferConfig; theme: ThemeConfig }) {
  const oc = config.offerConfig;
  const bg = oc.backgroundColor || theme.colors.accent + '15';

  return (
    <div style={{
      margin: '8px 12px',
      padding: 16,
      backgroundColor: bg,
      borderRadius: 12,
      display: 'flex',
      gap: 12,
      alignItems: 'center',
    }}>
      {oc.imageUrl ? (
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          background: `url(${oc.imageUrl}) center/cover`,
          flexShrink: 0,
        }} />
      ) : (
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          backgroundColor: theme.colors.accent + '30',
          flexShrink: 0,
        }} />
      )}
      <div style={{ flex: 1 }}>
        {oc.discountText && <div style={{ fontSize: 16, fontWeight: 700, color: theme.colors.accent }}>{oc.discountText}</div>}
        {oc.title && <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>{oc.title}</div>}
        {oc.description && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{oc.description}</div>}
        {oc.ctaText && (
          <div style={{
            marginTop: 8,
            padding: '4px 12px',
            backgroundColor: theme.colors.accent,
            color: '#fff',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            display: 'inline-block',
          }}>
            {oc.ctaText}
          </div>
        )}
      </div>
    </div>
  );
}
