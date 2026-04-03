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
          fontSize: 14,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>+</div>
          <div>Add sections to {page} page</div>
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

      {/* Bottom tab bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0',
        borderTop: '1px solid #e5e7eb',
        marginTop: 16,
      }}>
        {['Home', 'Explore', 'Profile', 'Search'].map((tab) => (
          <div
            key={tab}
            style={{
              fontSize: 10,
              color: tab.toLowerCase() === page ? theme.colors.primary : '#9ca3af',
              fontWeight: tab.toLowerCase() === page ? 600 : 400,
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              backgroundColor: tab.toLowerCase() === page ? theme.colors.primary + '20' : '#f3f4f6',
              margin: '0 auto 2px',
            }} />
            {tab}
          </div>
        ))}
      </div>
    </DeviceFrame>
  );
}
