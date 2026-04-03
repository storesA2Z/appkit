import React from 'react';
import { useAppkitStore } from '../store/appkit-store';
import { MobilePreview } from '@appkit/preview';

export function SectionCanvas() {
  const project = useAppkitStore((s) => s.project);
  const currentPage = useAppkitStore((s) => s.currentPage);
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);
  const selectSection = useAppkitStore((s) => s.selectSection);

  const sections = project.pages[currentPage];

  return (
    <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto bg-gray-100">
      <MobilePreview
        layout={sections}
        theme={project.theme}
        page={currentPage}
        selectedId={selectedSectionId}
        onSectionClick={selectSection}
        scale={0.85}
      />
    </div>
  );
}
