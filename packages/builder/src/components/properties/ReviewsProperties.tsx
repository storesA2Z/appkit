import React from 'react';
import type { ReviewsConfig } from '@appkit/schema';

interface Props {
  config: ReviewsConfig;
  onChange: (changes: Partial<ReviewsConfig>) => void;
}

export function ReviewsProperties({ config, onChange }: Props) {
  const rc = config.reviewsConfig || { displayMode: 'top-rated' as const };
  const update = (changes: Record<string, any>) => onChange({ reviewsConfig: { ...rc, ...changes } });

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Title</label>
        <input type="text" value={rc.title || ''} onChange={(e) => update({ title: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded-md" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Product Limit (1-50)</label>
        <input type="number" min={1} max={50} value={rc.productLimit || 10} onChange={(e) => update({ productLimit: Number(e.target.value) })} className="w-full px-2 py-1.5 text-sm border rounded-md" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Card Style</label>
        <select value={rc.cardStyle || 'default'} onChange={(e) => update({ cardStyle: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded-md">
          <option value="default">Default</option>
          <option value="minimal">Minimal</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={rc.showRatings ?? true} onChange={(e) => update({ showRatings: e.target.checked })} />
        Show ratings
      </label>
    </div>
  );
}
