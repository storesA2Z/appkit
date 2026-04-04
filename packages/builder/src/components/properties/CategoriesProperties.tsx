import React from 'react';
import type { CategoriesConfig } from '@appkit/schema';

interface Props {
  config: CategoriesConfig;
  onChange: (changes: Partial<CategoriesConfig>) => void;
}

export function CategoriesProperties({ config, onChange }: Props) {
  const ids = config.collectionIds || [];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Collection IDs ({ids.length}/6)</label>
        <input
          type="text"
          value={ids.join(', ')}
          onChange={(e) => onChange({ collectionIds: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
          placeholder="id1, id2, id3"
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Variant</label>
        <select
          value={config.variant || 'grid'}
          onChange={(e) => onChange({ variant: e.target.value as any })}
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        >
          {['grid', 'horizontal', 'carousel', 'large-cards', 'circular'].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
