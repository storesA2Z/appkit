import React from 'react';
import type { MarqueeConfig, ThemeConfig } from '@appkit/schema';

export function MarqueeRenderer({ config, theme }: { config: MarqueeConfig; theme: ThemeConfig }) {
  const mc = config.marqueeConfig;
  const bg = mc.backgroundColor || theme.colors.primary;
  const textColor = mc.textColor || '#fff';
  const items = mc.items || [];

  return (
    <div style={{
      backgroundColor: bg,
      height: mc.height || 34,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      padding: '0 14px',
    }}>
      <div style={{
        display: 'flex',
        gap: 20,
        whiteSpace: 'nowrap',
        fontSize: 11,
        color: textColor,
        fontWeight: 500,
        letterSpacing: '0.01em',
      }}>
        {items.length > 0 ? items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {item.icon && <span>{item.icon}</span>}
            <span>{item.text}</span>
            {i < items.length - 1 && <span style={{ opacity: 0.3, marginLeft: 14 }}>|</span>}
          </span>
        )) : (
          <span style={{ opacity: 0.7 }}>Add marquee text items</span>
        )}
      </div>
    </div>
  );
}
