import React from 'react';
import type { CustomConfig, ThemeConfig } from '@appkit/schema';

export function CustomRenderer({ config, theme }: { config: CustomConfig; theme: ThemeConfig }) {
  const cc = config.customConfig;
  const name = cc?.componentName || 'Unnamed';
  const fallback = cc?.fallbackText || `Custom: ${name}`;
  const propCount = Object.keys(cc?.props || {}).length;

  return (
    <div style={{
      margin: '8px 14px',
      padding: '18px 20px',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
      borderRadius: 14,
      border: '2px dashed #c7d2fe',
      textAlign: 'center',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 10px',
        fontSize: 18, color: '#fff', fontWeight: 700,
        fontFamily: 'monospace',
      }}>
        {'</>'}
      </div>
      <div style={{
        fontSize: 13, fontWeight: 700,
        color: theme.colors.text,
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
      }}>
        &lt;{name} /&gt;
      </div>
      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, lineHeight: 1.4 }}>
        {fallback}
      </div>
      {propCount > 0 && (
        <div style={{
          marginTop: 8,
          display: 'inline-block',
          padding: '3px 10px',
          backgroundColor: '#e0e7ff',
          borderRadius: 6,
          fontSize: 10, fontWeight: 600,
          color: '#4338ca',
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        }}>
          {propCount} prop{propCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
