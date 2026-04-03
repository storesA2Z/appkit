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
        padding: '10px 16px 6px',
        borderTop: '1px solid #e5e7eb',
        marginTop: 12,
        backgroundColor: '#fff',
      }}>
        {(['Home', 'Explore', 'Profile', 'Search'] as const).map((tab) => {
          const isActive = tab.toLowerCase() === page;
          return (
            <div
              key={tab}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                backgroundColor: isActive ? theme.colors.primary + '18' : '#f3f4f6',
                transition: 'background-color 0.15s',
              }} />
              <span style={{
                fontSize: 9,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? theme.colors.primary : '#9ca3af',
                letterSpacing: '0.01em',
              }}>
                {tab}
              </span>
            </div>
          );
        })}
      </div>
    </DeviceFrame>
  );
}
