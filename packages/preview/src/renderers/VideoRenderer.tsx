import React from 'react';
import type { VideoConfig, ThemeConfig } from '@appkit/schema';

export function VideoRenderer({ config, theme }: { config: VideoConfig; theme: ThemeConfig }) {
  const height = config.height || 200;

  return (
    <div style={{
      height,
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {config.thumbnailUrl ? (
        <div style={{
          width: '100%',
          height: '100%',
          background: `url(${config.thumbnailUrl}) center/cover`,
        }} />
      ) : (
        <div style={{ color: '#6b7280', textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>▶</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>{config.title || 'Video'}</div>
        </div>
      )}
      {config.title && (
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: 12,
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}>
          {config.title}
        </div>
      )}
    </div>
  );
}
