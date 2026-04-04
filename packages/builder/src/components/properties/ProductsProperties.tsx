import React from 'react';
import type { ProductsConfig } from '@appkit/schema';

interface Props {
  config: ProductsConfig;
  onChange: (changes: Partial<ProductsConfig>) => void;
}

export function ProductsProperties({ config, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Collection ID</label>
        <input
          type="text"
          value={config.collectionId || ''}
          onChange={(e) => onChange({ collectionId: e.target.value })}
          placeholder="collection-id"
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Title</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Section title (max 50)"
          maxLength={50}
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Variant</label>
        <select
          value={config.variant || 'default'}
          onChange={(e) => onChange({ variant: e.target.value as any })}
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        >
          {['default', 'circular', 'flashSale', 'justForYou', 'grid', 'list', 'minimalist'].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Card Size</label>
        <select
          value={config.cardSize || 'medium'}
          onChange={(e) => onChange({ cardSize: e.target.value as any })}
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Sort By</label>
        <select
          value={config.sortBy || 'newest'}
          onChange={(e) => onChange({ sortBy: e.target.value as any })}
          className="w-full px-2 py-1.5 text-sm border rounded-md"
        >
          {['newest', 'oldest', 'priceLowToHigh', 'priceHighToLow', 'highestRated', 'nameAsc', 'nameDesc', 'mostPopular', 'mostBought'].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={config.showSeeAll ?? false}
          onChange={(e) => onChange({ showSeeAll: e.target.checked })}
        />
        Show "See All"
      </label>
    </div>
  );
}
