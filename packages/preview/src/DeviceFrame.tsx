import React from 'react';

export type DeviceType = 'iphone' | 'android';

interface DeviceFrameProps {
  children: React.ReactNode;
  device?: DeviceType;
  scale?: number;
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 390, minHeight: 680, background: '#1a1a1a', borderRadius: 40,
      padding: 4, boxShadow: '0 0 60px rgba(99,102,241,0.08), 0 20px 60px rgba(0,0,0,0.4), inset 0 0 0 1.5px rgba(255,255,255,0.1)',
    }}>
      <div style={{
        width: '100%', height: '100%', background: '#fff', borderRadius: 36,
        overflow: 'hidden', position: 'relative', minHeight: 672,
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 24, background: '#000', borderRadius: 14, zIndex: 2,
        }} />
        {/* Status bar */}
        <div style={{
          height: 52, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '0 20px 4px', fontSize: 10, fontWeight: 600, color: '#374151',
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 9 }}>
            <span>●●●●</span>
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 8V6M4 8V4M7 8V2M10 8V0" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none"><rect x="0.5" y="0.5" width="13" height="8" rx="1.5" stroke="#374151"/><rect x="2" y="2" width="8" height="5" rx="0.5" fill="#374151"/><path d="M15 3v3" stroke="#374151" strokeLinecap="round"/></svg>
          </div>
        </div>
        {/* Content */}
        <div style={{ overflow: 'auto', height: 'calc(100% - 52px - 20px)' }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{
          position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 3, background: '#d1d5db', borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

function AndroidFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 390, minHeight: 680, background: '#2a2a2a', borderRadius: 20,
      padding: 4, boxShadow: '0 0 60px rgba(99,102,241,0.08), 0 20px 60px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        width: '100%', height: '100%', background: '#fff', borderRadius: 16,
        overflow: 'hidden', position: 'relative', minHeight: 672,
      }}>
        {/* Status bar */}
        <div style={{
          height: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', fontSize: 9, color: '#374151',
        }}>
          <span>12:30</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 9 }}>
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 8V6M4 8V4M7 8V2M10 8V0" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none"><rect x="0.5" y="0.5" width="13" height="8" rx="1.5" stroke="#374151"/><rect x="2" y="2" width="8" height="5" rx="0.5" fill="#374151"/><path d="M15 3v3" stroke="#374151" strokeLinecap="round"/></svg>
          </div>
        </div>
        {/* Content */}
        <div style={{ overflow: 'auto', height: 'calc(100% - 64px)' }}>
          {children}
        </div>
        {/* Android nav */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 32, fontSize: 14, color: '#d1d5db',
        }}>
          <span style={{ fontSize: 16 }}>◁</span>
          <span style={{ fontSize: 16 }}>○</span>
          <span style={{ fontSize: 16 }}>□</span>
        </div>
      </div>
    </div>
  );
}

export function DeviceFrame({ children, device = 'iphone', scale = 0.85 }: DeviceFrameProps) {
  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      {device === 'iphone' ? (
        <IPhoneFrame>{children}</IPhoneFrame>
      ) : (
        <AndroidFrame>{children}</AndroidFrame>
      )}
    </div>
  );
}
