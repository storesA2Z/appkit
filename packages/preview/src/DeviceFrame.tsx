import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
  scale?: number;
}

export function DeviceFrame({ children, scale = 0.85 }: DeviceFrameProps) {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: 390,
        minHeight: 680,
        borderRadius: 44,
        border: '6px solid #1a1a2e',
        backgroundColor: '#fff',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 25px 60px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04), inset 0 0 0 2px rgba(255,255,255,0.1)',
      }}
    >
      <div style={{
        height: 48,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: 126,
          height: 32,
          backgroundColor: '#1a1a2e',
          borderRadius: 20,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#2d2e4a',
            border: '2px solid #3b3c5a',
          }} />
        </div>
        <div style={{
          position: 'absolute',
          left: 20,
          fontSize: 12,
          fontWeight: 600,
          color: '#1a1a2e',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          9:41
        </div>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: 'calc(100% - 100px)' }}>
        {children}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 140,
        height: 5,
        backgroundColor: '#1a1a2e',
        borderRadius: 100,
      }} />
    </div>
  );
}
