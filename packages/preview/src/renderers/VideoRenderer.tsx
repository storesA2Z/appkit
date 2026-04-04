import React from 'react';
import type { VideoConfig, ThemeConfig } from '@appkit/schema';

export function VideoRenderer({ config, theme }: { config: VideoConfig; theme: ThemeConfig }) {
  const height = config.height || 210;
  const hasThumbnail = config.thumbnailUrl;

  return (
    <div style={{
      height,
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {hasThumbnail ? (
        <img src={config.thumbnailUrl} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          opacity: 0.85,
        }} />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a0f 100%)',
        }} />
      )}
      <div style={{
        position: 'absolute',
        width: 56, height: 56, borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255,255,255,0.2)',
      }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: '16px solid rgba(255,255,255,0.95)',
          borderTop: '10px solid transparent',
          borderBottom: '10px solid transparent',
          marginLeft: 4,
        }} />
      </div>
      {config.title && (
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '32px 16px 14px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{config.title}</div>
            {config.subtitle && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>{config.subtitle}</div>}
          </div>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '2px 7px', borderRadius: 4,
            fontSize: 9, color: '#fff', fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}>
            2:34
          </div>
        </div>
      )}
    </div>
  );
}
