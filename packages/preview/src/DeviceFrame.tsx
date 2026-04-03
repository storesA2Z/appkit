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
        width: 375,
        minHeight: 667,
        borderRadius: 40,
        border: '8px solid #1a1a2e',
        backgroundColor: '#fff',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}
    >
      {/* Status bar */}
      <div style={{
        height: 44,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{
          width: 120,
          height: 28,
          backgroundColor: '#1a1a2e',
          borderRadius: 14,
        }} />
      </div>

      {/* Content area */}
      <div style={{ overflowY: 'auto', maxHeight: 'calc(100% - 94px)' }}>
        {children}
      </div>

      {/* Home indicator */}
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 134,
        height: 5,
        backgroundColor: '#1a1a2e',
        borderRadius: 3,
      }} />
    </div>
  );
}
