import React, { useState } from 'react';
import { SECTION_TYPES, type SectionType } from '@appkit/schema';
import {
  Image, Grid, ShoppingBag, Layers, Type, Video,
  Clock, Star, Gift, ImageIcon, FolderTree, MoveHorizontal,
  Search, GripVertical, Code2, Wand2,
} from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';
import { CustomSectionWizard } from './CustomSectionWizard';

const sectionMeta: Record<SectionType, { label: string; icon: React.ElementType; description: string; group: string }> = {
  hero: { label: 'Hero', icon: ImageIcon, description: 'Full-width hero image', group: 'Content' },
  banner: { label: 'Banner', icon: Image, description: 'Image/video carousel', group: 'Content' },
  header: { label: 'Header', icon: Type, description: 'Text divider', group: 'Content' },
  video: { label: 'Video', icon: Video, description: 'Video player', group: 'Content' },
  marquee: { label: 'Marquee', icon: MoveHorizontal, description: 'Scrolling ticker', group: 'Content' },
  categories: { label: 'Categories', icon: Grid, description: 'Category grid', group: 'Commerce' },
  products: { label: 'Products', icon: ShoppingBag, description: 'Product listing', group: 'Commerce' },
  collections: { label: 'Collections', icon: Layers, description: 'Multi-collection', group: 'Commerce' },
  tabs: { label: 'Tabs', icon: FolderTree, description: 'Tabbed collections', group: 'Commerce' },
  flash_sale: { label: 'Flash Sale', icon: Clock, description: 'Countdown timer', group: 'Engagement' },
  reviews: { label: 'Reviews', icon: Star, description: 'Product reviews', group: 'Engagement' },
  offer: { label: 'Offer', icon: Gift, description: 'Promo card', group: 'Engagement' },
  custom: { label: 'Custom Code', icon: Code2, description: 'Your own component', group: 'Custom' },
};

const groups = ['Content', 'Commerce', 'Engagement', 'Custom'] as const;

export function SectionLibrary() {
  const addSection = useAppkitStore((s) => s.addSection);
  const currentSections = useAppkitStore((s) => s.project.pages[s.currentPage]?.sections ?? []);
  const selectSection = useAppkitStore((s) => s.selectSection);
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);
  const [search, setSearch] = useState('');
  const [showWizard, setShowWizard] = useState(false);

  const filtered = SECTION_TYPES.filter((type) => {
    if (!search) return true;
    const meta = sectionMeta[type];
    const q = search.toLowerCase();
    return meta.label.toLowerCase().includes(q) || meta.description.toLowerCase().includes(q);
  });

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-text mb-3">Sections</h2>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sidebar-text" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sidebar-hover text-sidebar-text-bright placeholder:text-sidebar-text text-xs rounded-lg pl-8 pr-3 py-2 border-0 outline-none focus:ring-1 focus:ring-brand-500/40 transition-shadow"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-dark px-3 pb-3">
        {groups.map((group) => {
          const items = filtered.filter((type) => sectionMeta[type].group === group);
          if (items.length === 0) return null;

          return (
            <div key={group} className="mb-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-text/60 px-1 mb-1.5">{group}</div>
              <div className="space-y-0.5">
                {items.map((type) => {
                  const meta = sectionMeta[type];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors hover:bg-sidebar-hover group"
                    >
                      <div className="w-7 h-7 rounded-md bg-sidebar-hover group-hover:bg-sidebar-active flex items-center justify-center shrink-0 transition-colors">
                        <Icon size={14} className="text-sidebar-text group-hover:text-brand-400 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-sidebar-text-bright">{meta.label}</div>
                        <div className="text-[10px] text-sidebar-text truncate">{meta.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-3 pb-2">
          <button
            onClick={() => setShowWizard(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-ide-accent-border rounded-lg text-ide-accent text-[11px] font-medium hover:bg-ide-accent-dim transition-colors"
          >
            <Wand2 size={12} /> Create with Wizard
          </button>
        </div>

      <CustomSectionWizard open={showWizard} onClose={() => setShowWizard(false)} />

      {currentSections.length > 0 && (
        <div className="border-t border-sidebar-hover px-3 py-2 max-h-[200px] overflow-y-auto scrollbar-dark">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-text/60 px-1 mb-1.5">
            Active ({currentSections.length})
          </div>
          <div className="space-y-0.5">
            {currentSections.map((section) => {
              const meta = sectionMeta[section.type];
              const isSelected = selectedSectionId === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => selectSection(section.id)}
                  className={`w-full flex items-center gap-2 text-left text-[11px] px-2 py-1.5 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-brand-600/20 text-brand-300'
                      : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-bright'
                  }`}
                >
                  <GripVertical size={11} className="opacity-40 shrink-0" />
                  <span className="truncate">{meta?.label || section.type}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
