import React from 'react';
import type { Section, ThemeConfig, PageType } from '@appkit/schema';
import { DeviceFrame } from './DeviceFrame';
import { SectionRenderer } from './renderers/SectionRenderer';

export interface MobilePreviewProps {
  layout: Section[];
  theme: ThemeConfig;
  page: PageType;
  selectedId?: string | null;
  onSectionClick?: (id: string) => void;
  device?: string;
  scale?: number;
}

export function MobilePreview({
  layout,
  theme,
  page,
  selectedId,
  onSectionClick,
  scale = 0.85,
}: MobilePreviewProps) {
  return (
    <DeviceFrame scale={scale}>
      {layout.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 400,
          color: '#9ca3af',
          fontSize: 13,
          fontFamily: 'Inter, system-ui, sans-serif',
          gap: 8,
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            border: '2px dashed #d1d5db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#d1d5db',
          }}>+</div>
          <div style={{ fontWeight: 500 }}>No sections yet</div>
          <div style={{ fontSize: 11, color: '#d1d5db' }}>Click a section from the left panel</div>
        </div>
      ) : (
        layout.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            theme={theme}
            isSelected={selectedId === section.id}
            onClick={() => onSectionClick?.(section.id)}
          />
        ))
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 16px 4px',
        borderTop: '1px solid #f3f4f6',
        marginTop: 'auto',
        backgroundColor: '#fff',
      }}>
        {([
          { name: 'Home', icon: '🏠', activeIcon: '🏠' },
          { name: 'Explore', icon: '🧭', activeIcon: '🧭' },
          { name: 'Search', icon: '🔍', activeIcon: '🔍' },
          { name: 'Profile', icon: '👤', activeIcon: '👤' },
        ] as const).map((tab) => {
          const isActive = tab.name.toLowerCase() === page;
          return (
            <div
              key={tab.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '2px 8px',
              }}
            >
              <div style={{
                fontSize: 16,
                filter: isActive ? 'none' : 'grayscale(1) opacity(0.4)',
                transition: 'filter 0.15s',
              }}>
                {isActive ? tab.activeIcon : tab.icon}
              </div>
              <span style={{
                fontSize: 9,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? theme.colors.primary : '#9ca3af',
                letterSpacing: '0.01em',
              }}>
                {tab.name}
              </span>
              {isActive && (
                <div style={{
                  width: 4, height: 4, borderRadius: '50%',
                  backgroundColor: theme.colors.primary,
                  marginTop: -1,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </DeviceFrame>
  );
}
