import React from 'react';

export type DeviceType = 'iphone' | 'android';

interface DeviceFrameProps {
  children: React.ReactNode;
  device?: DeviceType;
  scale?: number;
  darkMode?: boolean;
}

function IPhoneFrame({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) {
  const contentBg = darkMode ? '#111111' : '#fff';
  const statusColor = darkMode ? '#e2e8f0' : '#374151';
  const indicatorColor = darkMode ? '#555' : '#d1d5db';

  return (
    <div style={{
      width: 390, minHeight: 680, background: '#1a1a1a', borderRadius: 40,
      padding: 4, boxShadow: '0 0 60px rgba(99,102,241,0.08), 0 20px 60px rgba(0,0,0,0.4), inset 0 0 0 1.5px rgba(255,255,255,0.1)',
    }}>
      <div style={{
        width: '100%', height: '100%', background: contentBg, borderRadius: 36,
        overflow: 'hidden', position: 'relative', minHeight: 672,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 24, background: '#000', borderRadius: 14, zIndex: 2,
        }} />
        {/* Status bar */}
        <div style={{
          height: 52, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '0 20px 4px', fontSize: 10, fontWeight: 600, color: statusColor,
          flexShrink: 0,
        }}>
          <span>9:41</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 9 }}>
            <span>●●●●</span>
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 8V6M4 8V4M7 8V2M10 8V0" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none"><rect x="0.5" y="0.5" width="13" height="8" rx="1.5" stroke={statusColor}/><rect x="2" y="2" width="8" height="5" rx="0.5" fill={statusColor}/><path d="M15 3v3" stroke={statusColor} strokeLinecap="round"/></svg>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{
          position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 3, background: indicatorColor, borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

function AndroidFrame({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) {
  const contentBg = darkMode ? '#111111' : '#fff';
  const statusColor = darkMode ? '#e2e8f0' : '#374151';
  const navColor = darkMode ? '#555' : '#d1d5db';

  return (
    <div style={{
      width: 390, minHeight: 680, background: '#2a2a2a', borderRadius: 20,
      padding: 4, boxShadow: '0 0 60px rgba(99,102,241,0.08), 0 20px 60px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        width: '100%', height: '100%', background: contentBg, borderRadius: 16,
        overflow: 'hidden', position: 'relative', minHeight: 672,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Status bar */}
        <div style={{
          height: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', fontSize: 9, color: statusColor, flexShrink: 0,
        }}>
          <span>12:30</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 9 }}>
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 8V6M4 8V4M7 8V2M10 8V0" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none"><rect x="0.5" y="0.5" width="13" height="8" rx="1.5" stroke={statusColor}/><rect x="2" y="2" width="8" height="5" rx="0.5" fill={statusColor}/><path d="M15 3v3" stroke={statusColor} strokeLinecap="round"/></svg>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        {/* Android nav */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 32, fontSize: 14, color: navColor,
        }}>
          <span style={{ fontSize: 16 }}>◁</span>
          <span style={{ fontSize: 16 }}>○</span>
          <span style={{ fontSize: 16 }}>□</span>
        </div>
      </div>
    </div>
  );
}

export function DeviceFrame({ children, device = 'iphone', scale = 0.85, darkMode = false }: DeviceFrameProps) {
  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      {device === 'iphone' ? (
        <IPhoneFrame darkMode={darkMode}>{children}</IPhoneFrame>
      ) : (
        <AndroidFrame darkMode={darkMode}>{children}</AndroidFrame>
      )}
    </div>
  );
}
