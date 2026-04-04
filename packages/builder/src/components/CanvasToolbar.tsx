import React from 'react';

export type DeviceType = 'iphone' | 'android';
export type ViewMode = 'single' | 'storyboard';
export type PreviewTheme = 'light' | 'dark';

interface CanvasToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  previewTheme: PreviewTheme;
  onPreviewThemeChange: (theme: PreviewTheme) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function CanvasToolbar({
  viewMode, onViewModeChange,
  device, onDeviceChange,
  previewTheme, onPreviewThemeChange,
  zoom, onZoomChange,
}: CanvasToolbarProps) {
  return (
    <div className="h-8 bg-ide-hover border-b border-ide-border flex items-center justify-between px-2.5 text-[10px] text-ide-text shrink-0">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onViewModeChange('single')}
          className={`px-1.5 py-0.5 rounded ${viewMode === 'single' ? 'bg-ide-active text-ide-text-bright' : ''}`}
        >📱 Single</button>
        <button
          onClick={() => onViewModeChange('storyboard')}
          className={`px-1.5 py-0.5 rounded ${viewMode === 'storyboard' ? 'bg-ide-active text-ide-text-bright' : ''}`}
        >📋 Storyboard</button>
        <span className="w-px h-3 bg-ide-border mx-1" />
        <button onClick={() => onZoomChange(Math.max(0.25, zoom - 0.1))} className="px-1 py-0.5 rounded hover:bg-ide-active">−</button>
        <span className="text-ide-text-dim w-8 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => onZoomChange(Math.min(2, zoom + 0.1))} className="px-1 py-0.5 rounded hover:bg-ide-active">+</button>
        <button onClick={() => onZoomChange(0.85)} className="px-1.5 py-0.5 rounded hover:bg-ide-active">Fit</button>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex bg-ide-hover rounded p-0.5">
          <button
            onClick={() => onDeviceChange('iphone')}
            className={`px-2 py-0.5 rounded text-[9px] ${device === 'iphone' ? 'bg-ide-active text-ide-text-bright font-semibold' : ''}`}
          >iPhone 15 Pro</button>
          <button
            onClick={() => onDeviceChange('android')}
            className={`px-2 py-0.5 rounded text-[9px] ${device === 'android' ? 'bg-ide-active text-ide-text-bright font-semibold' : ''}`}
          >Pixel 8</button>
        </div>
        <span className="w-px h-3 bg-ide-border mx-1" />
        <button
          onClick={() => onPreviewThemeChange('light')}
          className={`px-1.5 py-0.5 rounded ${previewTheme === 'light' ? 'bg-ide-active text-ide-text-bright' : ''}`}
        >Light</button>
        <button
          onClick={() => onPreviewThemeChange('dark')}
          className={`px-1.5 py-0.5 rounded ${previewTheme === 'dark' ? 'bg-ide-active text-ide-text-bright' : ''}`}
        >Dark</button>
      </div>
    </div>
  );
}
