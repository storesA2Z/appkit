import React from 'react';
import type { Section, ThemeConfig } from '@appkit/schema';
import { DeviceFrame, type DeviceType } from './DeviceFrame';
import { SectionRenderer } from './renderers/SectionRenderer';

export type PreviewThemeMode = 'light' | 'dark';

export interface MobilePreviewProps {
  layout: Section[];
  theme: ThemeConfig;
  page: string;
  selectedId?: string | null;
  onSectionClick?: (id: string) => void;
  device?: DeviceType;
  scale?: number;
  previewTheme?: PreviewThemeMode;
}

export function MobilePreview({
  layout,
  theme,
  page,
  selectedId,
  onSectionClick,
  device = 'iphone',
  scale = 0.85,
  previewTheme = 'light',
}: MobilePreviewProps) {
  const isDark = previewTheme === 'dark';
  const bgColor = isDark ? '#111111' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : theme.colors.text;
  const borderColor = isDark ? '#2a2a2a' : '#f3f4f6';
  const mutedColor = isDark ? '#6b7280' : '#9ca3af';
  return (
    <DeviceFrame scale={scale} device={device} darkMode={isDark}>
      <div style={{ backgroundColor: bgColor, minHeight: '100%' }}>
        {layout.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: 400, color: mutedColor,
            fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif', gap: 8,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              border: `2px dashed ${borderColor}`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 24, color: borderColor,
            }}>+</div>
            <div style={{ fontWeight: 500 }}>No sections yet</div>
            <div style={{ fontSize: 11, color: mutedColor }}>Click a section from the left panel</div>
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
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '8px 16px 4px', borderTop: `1px solid ${borderColor}`,
        marginTop: 'auto', backgroundColor: isDark ? '#1a1a1a' : '#fff',
      }}>
        {([
          { name: 'Home', icon: '🏠' },
          { name: 'Explore', icon: '🧭' },
          { name: 'Search', icon: '🔍' },
          { name: 'Profile', icon: '👤' },
        ] as const).map((tab) => {
          const isActive = tab.name.toLowerCase() === page;
          return (
            <div key={tab.name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, padding: '2px 8px',
            }}>
              <div style={{
                fontSize: 16, filter: isActive ? 'none' : 'grayscale(1) opacity(0.4)',
                transition: 'filter 0.15s',
              }}>{tab.icon}</div>
              <span style={{
                fontSize: 9, fontWeight: isActive ? 700 : 400,
                color: isActive ? theme.colors.accent : mutedColor,
                letterSpacing: '0.01em',
              }}>{tab.name}</span>
              {isActive && (
                <div style={{
                  width: 4, height: 4, borderRadius: '50%',
                  backgroundColor: theme.colors.accent, marginTop: -1,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </DeviceFrame>
  );
}
