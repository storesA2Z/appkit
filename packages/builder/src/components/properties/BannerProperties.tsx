import React from 'react';
import type { BannerConfig } from '@appkit/schema';

interface Props {
  config: BannerConfig;
  onChange: (changes: Partial<BannerConfig>) => void;
}

export function BannerProperties({ config, onChange }: Props) {
  const items = config.data || [];

  const updateItem = (index: number, changes: Record<string, any>) => {
    const newData = items.map((item, i) => i === index ? { ...item, ...changes } : item);
    onChange({ data: newData });
  };

  const addItem = () => {
    onChange({ data: [...items, { mediaType: 'image' as const, imageUrl: '', title: '' }] });
  };

  const removeItem = (index: number) => {
    onChange({ data: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-600">Slides ({items.length}/5)</label>
        {items.length < 5 && (
          <button onClick={addItem} className="text-xs text-blue-600 hover:text-blue-800">+ Add</button>
        )}
      </div>
      {items.map((item, i) => (
        <div key={i} className="p-2 border rounded-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Slide {i + 1}</span>
            <button onClick={() => removeItem(i)} className="text-xs text-red-500">Remove</button>
          </div>
          <select
            value={item.mediaType}
            onChange={(e) => updateItem(i, { mediaType: e.target.value })}
            className="w-full px-2 py-1 text-xs border rounded"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <input
            type="text"
            value={item.imageUrl || ''}
            onChange={(e) => updateItem(i, { imageUrl: e.target.value })}
            placeholder="Image URL"
            className="w-full px-2 py-1 text-xs border rounded"
          />
          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => updateItem(i, { title: e.target.value })}
            placeholder="Title"
            className="w-full px-2 py-1 text-xs border rounded"
          />
        </div>
      ))}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={config.bannerConfig?.autoplay ?? true}
            onChange={(e) => onChange({ bannerConfig: { ...config.bannerConfig, autoplay: e.target.checked } })}
          />
          Autoplay
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={config.bannerConfig?.showDots ?? true}
            onChange={(e) => onChange({ bannerConfig: { ...config.bannerConfig, showDots: e.target.checked } })}
          />
          Show dots
        </label>
      </div>
    </div>
  );
}
