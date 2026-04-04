import React, { useState } from 'react';
import { useAppkitStore } from '../store/appkit-store';
import { MobilePreview } from '@appkit/preview';
import { CanvasToolbar, type DeviceType, type ViewMode, type PreviewTheme } from './CanvasToolbar';

export function SectionCanvas() {
  const project = useAppkitStore((s) => s.project);
  const currentPage = useAppkitStore((s) => s.currentPage);
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);
  const selectSection = useAppkitStore((s) => s.selectSection);
  const [device, setDevice] = useState<DeviceType>('iphone');
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light');
  const [zoom, setZoom] = useState(0.85);

  const sections = project.pages[currentPage]?.sections ?? [];

  return (
    <div className="h-full flex flex-col">
      <CanvasToolbar
        viewMode={viewMode} onViewModeChange={setViewMode}
        device={device} onDeviceChange={setDevice}
        previewTheme={previewTheme} onPreviewThemeChange={setPreviewTheme}
        zoom={zoom} onZoomChange={setZoom}
      />
      <div className="flex-1 flex items-start justify-center overflow-y-auto dot-grid py-8 px-6">
        <div className="animate-fade-in">
          <MobilePreview
            layout={sections}
            theme={project.theme}
            page={currentPage}
            selectedId={selectedSectionId}
            onSectionClick={selectSection}
            device={device}
            scale={zoom}
          />
        </div>
      </div>
    </div>
  );
}
