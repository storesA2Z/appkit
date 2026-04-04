import React from 'react';
import type { HeaderConfig } from '@appkit/schema';

interface Props {
  config: HeaderConfig;
  onChange: (changes: Partial<HeaderConfig>) => void;
}

export function HeaderProperties({ config, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Text</label>
        <input
          type="text"
          value={config.text || ''}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Section header text"
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        />
      </div>
    </div>
  );
}
