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
      padding: 20,
      backgroundColor: '#f8fafc',
      borderRadius: 12,
      border: '2px dashed #cbd5e1',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 24,
        marginBottom: 8,
        opacity: 0.6,
      }}>
        {'</>'}
      </div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: theme.colors.text,
        fontFamily: 'monospace',
      }}>
        {name}
      </div>
      <div style={{
        fontSize: 11,
        color: '#64748b',
        marginTop: 4,
      }}>
        {fallback}
      </div>
      {propCount > 0 && (
        <div style={{
          fontSize: 10,
          color: '#94a3b8',
          marginTop: 6,
          fontFamily: 'monospace',
        }}>
          {propCount} prop{propCount !== 1 ? 's' : ''} configured
        </div>
      )}
    </div>
  );
}
