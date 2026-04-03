import React from 'react';
import type { OfferConfig, ThemeConfig } from '@appkit/schema';

export function OfferRenderer({ config, theme }: { config: OfferConfig; theme: ThemeConfig }) {
  const oc = config.offerConfig;
  const bg = oc.backgroundColor || `${theme.colors.accent}0d`;

  return (
    <div style={{
      margin: '8px 14px',
      padding: 16,
      backgroundColor: bg,
      borderRadius: 14,
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      border: `1px solid ${theme.colors.accent}15`,
    }}>
      {oc.imageUrl ? (
        <div style={{
          width: 80, height: 80, borderRadius: 10,
          background: `url(${oc.imageUrl}) center/cover`,
          flexShrink: 0,
        }} />
      ) : (
        <div style={{
          width: 80, height: 80, borderRadius: 10,
          backgroundColor: `${theme.colors.accent}18`,
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}>
          %
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {oc.discountText && <div style={{ fontSize: 18, fontWeight: 700, color: theme.colors.accent, lineHeight: 1.2 }}>{oc.discountText}</div>}
        {oc.title && <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text, marginTop: 2 }}>{oc.title}</div>}
        {oc.description && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3, lineHeight: 1.4 }}>{oc.description}</div>}
        {oc.ctaText && (
          <div style={{
            marginTop: 10,
            padding: '5px 14px',
            backgroundColor: theme.colors.accent,
            color: '#fff',
            borderRadius: 6,
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
