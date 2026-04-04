import React from 'react';
import type { HeroConfig } from '@appkit/schema';

interface Props {
  config: HeroConfig;
  onChange: (changes: Partial<HeroConfig>) => void;
}

export function HeroProperties({ config, onChange }: Props) {
  const hc = config.heroConfig || { imageUrl: '' };
  const update = (changes: Record<string, any>) => onChange({ heroConfig: { ...hc, ...changes } });

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Image URL</label>
        <input type="text" value={hc.imageUrl || ''} onChange={(e) => update({ imageUrl: e.target.value })} placeholder="https://..." className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Title</label>
        <input type="text" value={hc.title || ''} onChange={(e) => update({ title: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Subtitle</label>
        <input type="text" value={hc.subtitle || ''} onChange={(e) => update({ subtitle: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">CTA Text</label>
        <input type="text" value={hc.ctaText || ''} onChange={(e) => update({ ctaText: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Text Position</label>
        <select value={hc.textPosition || 'center'} onChange={(e) => update({ textPosition: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none">
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Overlay Opacity ({hc.overlayOpacity ?? 0.3})</label>
        <input type="range" min="0" max="1" step="0.1" value={hc.overlayOpacity ?? 0.3} onChange={(e) => update({ overlayOpacity: Number(e.target.value) })} className="w-full" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Height</label>
        <input type="number" min={100} max={600} value={hc.height || 240} onChange={(e) => update({ height: Number(e.target.value) })} className="w-full px-2 py-1.5 text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none" />
      </div>
    </div>
  );
}
