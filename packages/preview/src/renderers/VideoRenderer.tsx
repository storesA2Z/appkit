import React from 'react';
import type { VideoConfig, ThemeConfig } from '@appkit/schema';

export function VideoRenderer({ config, theme }: { config: VideoConfig; theme: ThemeConfig }) {
  const height = config.height || 200;

  return (
    <div style={{
      height,
      backgroundColor: '#0f0f0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {config.thumbnailUrl ? (
        <div style={{
          width: '100%',
          height: '100%',
          background: `url(${config.thumbnailUrl}) center/cover`,
        }} />
      ) : (
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 0, height: 0,
            borderLeft: '14px solid rgba(255,255,255,0.9)',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            marginLeft: 3,
          }} />
        </div>
      )}
      {config.title && (
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '20px 14px 10px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
        }}>
          {config.title}
        </div>
      )}
    </div>
  );
}
