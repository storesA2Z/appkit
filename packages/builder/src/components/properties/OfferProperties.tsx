import React from 'react';
import type { OfferConfig } from '@appkit/schema';

interface Props {
  config: OfferConfig;
  onChange: (changes: Partial<OfferConfig>) => void;
}

export function OfferProperties({ config, onChange }: Props) {
  const oc = config.offerConfig || {};
  const update = (changes: Record<string, any>) => onChange({ offerConfig: { ...oc, ...changes } });

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
        <input type="text" value={oc.title || ''} onChange={(e) => update({ title: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded-md" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <textarea value={oc.description || ''} onChange={(e) => update({ description: e.target.value })} rows={2} className="w-full px-2 py-1.5 text-sm border rounded-md" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Discount Text</label>
        <input type="text" value={oc.discountText || ''} onChange={(e) => update({ discountText: e.target.value })} placeholder="20% OFF" className="w-full px-2 py-1.5 text-sm border rounded-md" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
        <input type="text" value={oc.imageUrl || ''} onChange={(e) => update({ imageUrl: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded-md" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">CTA Text</label>
        <input type="text" value={oc.ctaText || ''} onChange={(e) => update({ ctaText: e.target.value })} placeholder="Shop Now" className="w-full px-2 py-1.5 text-sm border rounded-md" />
      </div>
    </div>
  );
}
