import React from 'react';
import type { TabsConfig, ThemeConfig } from '@appkit/schema';

export function TabsRenderer({ config, theme }: { config: TabsConfig; theme: ThemeConfig }) {
  const tc = config.tabsConfig;
  const tabs = tc.tabs || [];
  const activeIndex = tc.defaultTabIndex || 0;

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ display: 'flex', borderBottom: '2px solid #f3f4f6', padding: '0 12px' }}>
        {tabs.map((tab, i) => (
          <div key={tab.id} style={{
            padding: '8px 12px',
            fontSize: 12,
            fontWeight: i === activeIndex ? 600 : 400,
            color: i === activeIndex ? theme.colors.primary : '#9ca3af',
            borderBottom: i === activeIndex ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
            marginBottom: -2,
          }}>
            {tab.title}
          </div>
        ))}
      </div>
      <div style={{ padding: 12, display: 'flex', gap: 8 }}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} style={{ width: 100, flexShrink: 0 }}>
            <div style={{ height: 80, backgroundColor: `${theme.colors.primary}10`, borderRadius: 6, marginBottom: 4 }} />
            <div style={{ fontSize: 10, color: theme.colors.text }}>Item {i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
