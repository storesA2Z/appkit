import React from 'react';
import type { TabsConfig, ThemeConfig } from '@appkit/schema';

export function TabsRenderer({ config, theme }: { config: TabsConfig; theme: ThemeConfig }) {
  const tc = config.tabsConfig;
  const tabs = tc.tabs || [];
  const activeIndex = tc.defaultTabIndex || 0;

  return (
    <div>
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #f3f4f6',
        padding: '0 14px',
        gap: 4,
      }}>
        {tabs.map((tab, i) => (
          <div key={tab.id} style={{
            padding: '10px 14px',
            fontSize: 12,
            fontWeight: i === activeIndex ? 600 : 400,
            color: i === activeIndex ? theme.colors.primary : '#9ca3af',
            borderBottom: `2px solid ${i === activeIndex ? theme.colors.primary : 'transparent'}`,
            marginBottom: -1,
            transition: 'color 0.15s',
          }}>
            {tab.title}
          </div>
        ))}
        {tabs.length === 0 && (
          <div style={{ padding: '10px 14px', fontSize: 12, color: '#d1d5db' }}>Add tabs to configure</div>
        )}
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', gap: 10 }}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} style={{ width: 110, flexShrink: 0 }}>
            <div style={{
              height: 88,
              backgroundColor: `${theme.colors.primary}08`,
              borderRadius: 8,
              marginBottom: 6,
              border: '1px solid #f3f4f6',
            }} />
            <div style={{ fontSize: 11, color: theme.colors.text, fontWeight: 500 }}>Item {i + 1}</div>
            <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>$19.99</div>
          </div>
        ))}
      </div>
    </div>
  );
}
