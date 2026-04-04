import React from 'react';
import type { FlashSaleConfig } from '@appkit/schema';

interface Props {
  config: FlashSaleConfig;
  onChange: (changes: Partial<FlashSaleConfig>) => void;
}

export function FlashSaleProperties({ config, onChange }: Props) {
  const fc = config.flashSaleConfig || { endDate: '' };
  const update = (changes: Record<string, any>) => onChange({ flashSaleConfig: { ...fc, ...changes } });

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">End Date</label>
        <input type="datetime-local" value={fc.endDate || ''} onChange={(e) => update({ endDate: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Title</label>
        <input type="text" value={fc.title || ''} onChange={(e) => update({ title: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Subtitle</label>
        <input type="text" value={fc.subtitle || ''} onChange={(e) => update({ subtitle: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">CTA Text</label>
        <input type="text" value={fc.ctaText || ''} onChange={(e) => update({ ctaText: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
    </div>
  );
}
