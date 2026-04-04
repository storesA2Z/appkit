import React from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { useAppkitStore } from '../store/appkit-store';

interface SectionContextMenuProps {
  sectionId: string;
  children: React.ReactNode;
}

export function SectionContextMenu({ sectionId, children }: SectionContextMenuProps) {
  const removeSection = useAppkitStore((s) => s.removeSection);
  const addSection = useAppkitStore((s) => s.addSection);
  const project = useAppkitStore((s) => s.project);
  const currentPage = useAppkitStore((s) => s.currentPage);

  const pageConfig = project.pages[currentPage];
  const section = pageConfig?.sections.find((s) => s.id === sectionId);
  if (!section) return <>{children}</>;

  const handleDuplicate = () => {
    const idx = pageConfig.sections.findIndex((s) => s.id === sectionId);
    addSection(section.type, idx + 1);
  };

  const itemClass = "flex items-center gap-2 px-2.5 py-1.5 text-xs text-ide-text-muted rounded-md cursor-pointer outline-none data-[highlighted]:bg-ide-accent-dim data-[highlighted]:text-ide-text-bright";

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className="min-w-[180px] bg-ide-panel border border-ide-border-bright rounded-lg p-1 shadow-dropdown animate-scale-in z-50"
        >
          <ContextMenu.Item className={itemClass} onSelect={handleDuplicate}>
            Duplicate
          </ContextMenu.Item>
          <ContextMenu.Item className={itemClass} onSelect={() => removeSection(sectionId)}>
            Delete
          </ContextMenu.Item>
          <ContextMenu.Separator className="h-px bg-ide-border my-1" />
          <ContextMenu.Item className={`${itemClass} !text-ide-accent`}>
            ✨ Improve with AI
          </ContextMenu.Item>
          <ContextMenu.Item className={itemClass}>
            🔄 Suggest Alternatives
          </ContextMenu.Item>
          <ContextMenu.Separator className="h-px bg-ide-border my-1" />
          <ContextMenu.Item className={itemClass}>
            Copy Config
          </ContextMenu.Item>
          <ContextMenu.Item className={itemClass}>
            Paste Style
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
