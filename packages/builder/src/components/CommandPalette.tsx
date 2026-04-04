import React from 'react';
import { Command } from 'cmdk';
import { useAppkitStore } from '../store/appkit-store';
import type { SectionType } from '@appkit/schema';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const sectionTypes: { type: SectionType; label: string }[] = [
  { type: 'hero', label: 'Hero' }, { type: 'banner', label: 'Banner' },
  { type: 'products', label: 'Products' }, { type: 'categories', label: 'Categories' },
  { type: 'header', label: 'Header' }, { type: 'video', label: 'Video' },
  { type: 'flash_sale', label: 'Flash Sale' }, { type: 'reviews', label: 'Reviews' },
  { type: 'offer', label: 'Offer' }, { type: 'tabs', label: 'Tabs' },
  { type: 'marquee', label: 'Marquee' }, { type: 'collections', label: 'Collections' },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const project = useAppkitStore((s) => s.project);
  const setPage = useAppkitStore((s) => s.setPage);
  const addSection = useAppkitStore((s) => s.addSection);
  const selectSection = useAppkitStore((s) => s.selectSection);
  const currentPage = useAppkitStore((s) => s.currentPage);

  if (!open) return null;

  const currentSections = project.pages[currentPage]?.sections ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-[480px] animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <Command className="bg-ide-panel border border-ide-border-bright rounded-xl overflow-hidden shadow-dropdown">
          <Command.Input
            placeholder="Search pages, sections, actions..."
            className="w-full px-4 py-3 bg-transparent text-sm text-ide-text-bright placeholder:text-ide-text-dim border-b border-ide-border outline-none"
            autoFocus
          />
          <Command.List className="max-h-[300px] overflow-y-auto scrollbar-ide p-1.5">
            <Command.Empty className="py-6 text-center text-xs text-ide-text-dim">No results found.</Command.Empty>

            <Command.Group heading="Pages" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ide-text-dim">
              {Object.entries(project.pages).map(([slug, page]) => (
                <Command.Item
                  key={slug}
                  value={`page ${page.label}`}
                  onSelect={() => { setPage(slug); onClose(); }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-ide-text-muted cursor-pointer data-[selected=true]:bg-ide-accent-dim data-[selected=true]:text-ide-text-bright"
                >
                  <span className="text-[10px]">{page.icon ?? '📄'}</span>
                  {page.label}
                  <span className="ml-auto text-[9px] text-ide-text-dim">{page.sections.length} sections</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Sections on this page" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ide-text-dim">
              {currentSections.map((s) => (
                <Command.Item
                  key={s.id}
                  value={`section ${s.type} ${s.id}`}
                  onSelect={() => { selectSection(s.id); onClose(); }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-ide-text-muted cursor-pointer data-[selected=true]:bg-ide-accent-dim data-[selected=true]:text-ide-text-bright"
                >
                  {s.type}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Add section" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ide-text-dim">
              {sectionTypes.map(({ type, label }) => (
                <Command.Item
                  key={type}
                  value={`add ${label}`}
                  onSelect={() => { addSection(type); onClose(); }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-ide-text-muted cursor-pointer data-[selected=true]:bg-ide-accent-dim data-[selected=true]:text-ide-text-bright"
                >
                  + Add {label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
