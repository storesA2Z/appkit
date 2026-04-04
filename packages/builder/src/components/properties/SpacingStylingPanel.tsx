import React from 'react';
import type { SpacingConfig, StylingConfig } from '@appkit/schema';

interface Props {
  spacing?: SpacingConfig;
  styling?: StylingConfig;
  onSpacingChange: (spacing: SpacingConfig) => void;
  onStylingChange: (styling: StylingConfig) => void;
}

export function SpacingStylingPanel({ spacing = {}, styling = {}, onSpacingChange, onStylingChange }: Props) {
  return (
    <div className="space-y-4 pt-4 border-t">
      <details className="group">
        <summary className="text-xs font-medium text-ide-text cursor-pointer">Spacing</summary>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'] as const).map((key) => (
            <div key={key}>
              <label className="block text-xs text-ide-text-muted">{key}</label>
              <input
                type="number"
                min={0}
                value={spacing[key] || 0}
                onChange={(e) => onSpacingChange({ ...spacing, [key]: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs bg-ide-bg border border-ide-border rounded text-ide-text-bright focus:border-ide-accent focus:outline-none"
              />
            </div>
          ))}
        </div>
      </details>

      <details className="group">
        <summary className="text-xs font-medium text-ide-text cursor-pointer">Styling</summary>
        <div className="mt-2 space-y-2">
          <div>
            <label className="block text-xs text-ide-text-muted">Background Color</label>
            <input
              type="color"
              value={styling.backgroundColor || '#ffffff'}
              onChange={(e) => onStylingChange({ ...styling, backgroundColor: e.target.value })}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-ide-text-muted">Border Radius</label>
            <input
              type="number"
              min={0}
              value={styling.borderRadius || 0}
              onChange={(e) => onStylingChange({ ...styling, borderRadius: Number(e.target.value) })}
              className="w-full px-2 py-1 text-xs bg-ide-bg border border-ide-border rounded text-ide-text-bright focus:border-ide-accent focus:outline-none"
            />
          </div>
        </div>
      </details>
    </div>
  );
}
