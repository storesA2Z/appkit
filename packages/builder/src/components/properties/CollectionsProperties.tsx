import React from 'react';
import type { CollectionsConfig } from '@appkit/schema';

interface Props {
  config: CollectionsConfig;
  onChange: (changes: Partial<CollectionsConfig>) => void;
}

export function CollectionsProperties({ config, onChange }: Props) {
  const ids = config.collectionIds || [];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Collection IDs ({ids.length}/20)</label>
        <textarea
          value={ids.join(', ')}
          onChange={(e) => onChange({ collectionIds: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
          placeholder="id1, id2, id3"
          rows={3}
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        />
      </div>
    </div>
  );
}
