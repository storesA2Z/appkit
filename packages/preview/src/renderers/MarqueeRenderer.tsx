import React from 'react';
import type { MarqueeConfig, ThemeConfig } from '@appkit/schema';

export function MarqueeRenderer({ config, theme }: { config: MarqueeConfig; theme: ThemeConfig }) {
  const mc = config.marqueeConfig;
  const bg = mc.backgroundColor || theme.colors.primary;
  const textColor = mc.textColor || '#fff';

  return (
    <div style={{
      backgroundColor: bg,
      height: mc.height || 32,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      padding: '0 12px',
    }}>
      <div style={{
        display: 'flex',
        gap: 24,
        whiteSpace: 'nowrap',
        fontSize: 11,
        color: textColor,
        fontWeight: 500,
      }}>
        {(mc.items || []).map((item, i) => (
          <span key={i}>
            {item.icon && <span style={{ marginRight: 4 }}>{item.icon}</span>}
            {item.text}
          </span>
        ))}
        {(!mc.items || mc.items.length === 0) && <span>Marquee text</span>}
      </div>
    </div>
  );
}
