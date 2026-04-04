import React from 'react';
import type { VideoConfig } from '@appkit/schema';

interface Props {
  config: VideoConfig;
  onChange: (changes: Partial<VideoConfig>) => void;
}

export function VideoProperties({ config, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Video URL</label>
        <input type="text" value={config.videoUrl || ''} onChange={(e) => onChange({ videoUrl: e.target.value })} placeholder="https://..." className="w-full px-2 py-1.5 text-sm border rounded-md" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Title</label>
        <input type="text" value={config.title || ''} onChange={(e) => onChange({ title: e.target.value })} className="w-full px-2 py-1.5 text-sm border rounded-md" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ide-text mb-1">Aspect Ratio</label>
        <select value={config.aspectRatio || '16:9'} onChange={(e) => onChange({ aspectRatio: e.target.value as any })} className="w-full px-2 py-1.5 text-sm border rounded-md">
          {['16:9', '4:3', '1:1', '9:16', 'auto'].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={config.autoplay ?? false} onChange={(e) => onChange({ autoplay: e.target.checked })} />
        Autoplay
      </label>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={config.muted ?? true} onChange={(e) => onChange({ muted: e.target.checked })} />
        Muted
      </label>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={config.loop ?? false} onChange={(e) => onChange({ loop: e.target.checked })} />
        Loop
      </label>
    </div>
  );
}
