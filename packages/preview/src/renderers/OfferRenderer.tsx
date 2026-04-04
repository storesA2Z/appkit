import React from 'react';
import type { OfferConfig, ThemeConfig } from '@appkit/schema';

export function OfferRenderer({ config, theme }: { config: OfferConfig; theme: ThemeConfig }) {
  const oc = config.offerConfig;
  const bg = oc.backgroundColor || `${theme.colors.accent}0a`;

  return (
    <div style={{
      margin: '8px 14px',
      borderRadius: 16,
      overflow: 'hidden',
      border: `1px solid ${theme.colors.accent}12`,
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        padding: '16px 18px',
        backgroundColor: bg,
        display: 'flex',
        gap: 14,
        alignItems: 'center',
      }}>
        {oc.imageUrl ? (
          <div style={{
            width: 88, height: 88, borderRadius: 12,
            overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <img src={oc.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ) : (
          <div style={{
            width: 88, height: 88, borderRadius: 12,
            background: `linear-gradient(135deg, ${theme.colors.accent}20, ${theme.colors.accent}08)`,
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>
            🎉
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {oc.discountText && (
            <div style={{
              fontSize: 20, fontWeight: 800, color: theme.colors.accent,
              lineHeight: 1.1, letterSpacing: '-0.02em',
            }}>{oc.discountText}</div>
          )}
          {oc.title && (
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text, marginTop: 3, lineHeight: 1.3 }}>{oc.title}</div>
          )}
          {oc.description && (
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, lineHeight: 1.4 }}>{oc.description}</div>
          )}
          {oc.ctaText && (
            <div style={{
              marginTop: 10,
              padding: '6px 16px',
              backgroundColor: theme.colors.accent,
              color: '#fff',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              display: 'inline-block',
              letterSpacing: '0.01em',
            }}>
              {oc.ctaText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
