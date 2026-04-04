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
      height: mc.height || 36,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        gap: 24,
        whiteSpace: 'nowrap',
        fontSize: 11,
        color: textColor,
        fontWeight: 600,
        letterSpacing: '0.02em',
        padding: '0 14px',
        animation: 'none',
      }}>
        {items.length > 0 ? (
          <>
            {[...items, ...items].map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {item.icon && <span style={{ fontSize: 12 }}>{item.icon}</span>}
                <span>{item.text}</span>
                <span style={{ opacity: 0.25, marginLeft: 12 }}>•</span>
              </span>
            ))}
          </>
        ) : (
          <span style={{ opacity: 0.6, fontWeight: 400 }}>Add marquee text items to display</span>
        )}
      </div>
    </div>
  );
}
