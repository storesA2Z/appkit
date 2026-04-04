import React from 'react';
import type { MarqueeConfig } from '@appkit/schema';

interface Props {
  config: MarqueeConfig;
  onChange: (changes: Partial<MarqueeConfig>) => void;
}

export function MarqueeProperties({ config, onChange }: Props) {
  const mc = config.marqueeConfig || { items: [] };
  const items = mc.items || [];

  const updateItems = (newItems: typeof items) => onChange({ marqueeConfig: { ...mc, items: newItems } });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-ide-text-bright">Items ({items.length})</label>
        <button onClick={() => updateItems([...items, { text: '' }])} className="text-xs text-ide-accent hover:text-ide-text-bright">+ Add</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-1">
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateItems(items.map((it, j) => j === i ? { ...it, text: e.target.value } : it))}
            placeholder="Marquee text"
            className="flex-1 px-2 py-1 text-xs bg-ide-bg border border-ide-border rounded text-ide-text-bright focus:border-ide-accent focus:outline-none"
          />
          <button onClick={() => updateItems(items.filter((_, j) => j !== i))} className="text-xs text-red-500 px-1">x</button>
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Speed (1-10)</label>
        <input type="number" min={1} max={10} value={mc.speed || 5} onChange={(e) => onChange({ marqueeConfig: { ...mc, speed: Number(e.target.value) } })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Direction</label>
        <select value={mc.direction || 'left'} onChange={(e) => onChange({ marqueeConfig: { ...mc, direction: e.target.value as any } })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none">
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );
}
