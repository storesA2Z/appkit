import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppkitStore } from '../store/appkit-store';
import { MobilePreview } from '@appkit/preview';
import { CanvasToolbar, type DeviceType, type ViewMode, type PreviewTheme } from './CanvasToolbar';

export function SectionCanvas() {
  const project = useAppkitStore((s) => s.project);
  const currentPage = useAppkitStore((s) => s.currentPage);
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);
  const selectSection = useAppkitStore((s) => s.selectSection);
  const setPage = useAppkitStore((s) => s.setPage);
  const [device, setDevice] = useState<DeviceType>('iphone');
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light');
  const [zoom, setZoom] = useState(0.85);

  const sections = project.pages[currentPage]?.sections ?? [];
  const allPages = Object.entries(project.pages);

  return (
    <div className="h-full flex flex-col">
      <CanvasToolbar
        viewMode={viewMode} onViewModeChange={setViewMode}
        device={device} onDeviceChange={setDevice}
        previewTheme={previewTheme} onPreviewThemeChange={setPreviewTheme}
        zoom={zoom} onZoomChange={setZoom}
      />
      <div className="flex-1 flex items-start justify-center overflow-auto dot-grid py-8 px-6">
        {viewMode === 'single' ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${device}-${currentPage}-${previewTheme}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <MobilePreview
                layout={sections}
                theme={project.theme}
                page={currentPage}
                selectedId={selectedSectionId}
                onSectionClick={selectSection}
                device={device}
                scale={zoom}
                previewTheme={previewTheme}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex gap-6 items-start">
            {allPages.map(([slug, pageConfig]) => (
              <div key={slug} className="flex flex-col items-center gap-2">
                <button
                  onClick={() => setPage(slug)}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors ${
                    slug === currentPage
                      ? 'text-ide-accent bg-ide-accent-dim'
                      : 'text-ide-text-dim hover:text-ide-text'
                  }`}
                >{pageConfig.label}</button>
                <div
                  className={`rounded-lg transition-shadow ${slug === currentPage ? 'ring-2 ring-ide-accent' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => setPage(slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <MobilePreview
                    layout={pageConfig.sections}
                    theme={project.theme}
                    page={slug}
                    selectedId={slug === currentPage ? selectedSectionId : null}
                    onSectionClick={slug === currentPage ? selectSection : undefined}
                    device={device}
                    scale={Math.min(zoom * 0.6, 0.5)}
                    previewTheme={previewTheme}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
