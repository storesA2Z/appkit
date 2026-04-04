import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, GripVertical, Plus, Wand2 } from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';
import { SectionContextMenu } from './SectionContextMenu';
import { AddPageDialog } from './AddPageDialog';
import { CustomSectionWizard } from './CustomSectionWizard';
import { SECTION_TYPES, type SectionType } from '@appkit/schema';

type LeftTab = 'layers' | 'pages';

const sectionIcons: Record<SectionType, string> = {
  hero: '🖼', banner: '🏷', header: '📝', video: '🎥', marquee: '📣',
  categories: '🔲', products: '🛍', collections: '📦', tabs: '📑',
  flash_sale: '⚡', reviews: '⭐', offer: '🎁', custom: '🧩',
};

export function WidgetTree() {
  const [activeTab, setActiveTab] = useState<LeftTab>('layers');
  const [showAddPage, setShowAddPage] = useState(false);
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const currentPage = useAppkitStore((s) => s.currentPage);
  const project = useAppkitStore((s) => s.project);
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);
  const selectSection = useAppkitStore((s) => s.selectSection);
  const setPage = useAppkitStore((s) => s.setPage);
  const addSection = useAppkitStore((s) => s.addSection);
  const pageConfig = project.pages[currentPage];
  const sections = pageConfig?.sections ?? [];
  const groups = pageConfig?.groups ?? [];

  const groupedSectionIds = new Set(groups.flatMap((g) => g.sectionIds));
  const ungroupedSections = sections.filter((s) => !groupedSectionIds.has(s.id));

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-ide-border text-[10px]">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-2 text-center transition-colors ${
            activeTab === 'layers' ? 'text-ide-accent border-b-[1.5px] border-ide-accent font-semibold' : 'text-ide-text-dim'
          }`}
        >Layers</button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-2 text-center transition-colors ${
            activeTab === 'pages' ? 'text-ide-accent border-b-[1.5px] border-ide-accent font-semibold' : 'text-ide-text-dim'
          }`}
        >Pages</button>
      </div>

      {activeTab === 'layers' && (
        <div className="flex-1 overflow-y-auto scrollbar-ide p-2 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-1.5 py-1 text-ide-text-bright">
            <ChevronDown size={10} className="text-ide-accent" />
            <span className="text-ide-accent">📱</span>
            <span className="font-semibold">{pageConfig?.label ?? currentPage}</span>
          </div>

          <div className="pl-4">
            {groups.map((group) => {
              const groupSections = group.sectionIds
                .map((sid) => sections.find((s) => s.id === sid))
                .filter(Boolean);

              return (
                <div key={group.id} className="mb-1">
                  <div className="flex items-center gap-1.5 px-1.5 py-1 text-ide-text rounded hover:bg-ide-hover cursor-pointer">
                    {group.collapsed ? <ChevronRight size={9} /> : <ChevronDown size={9} />}
                    <span className="text-[9px]">📦</span>
                    <span className="text-ide-text-muted">{group.name}</span>
                    <span className="ml-auto text-[8px] text-ide-text-dim">{groupSections.length}</span>
                  </div>
                  {!group.collapsed && (
                    <div className="pl-4">
                      {groupSections.map((section) => section && (
                        <SectionContextMenu key={section.id} sectionId={section.id}>
                          <button
                            onClick={() => selectSection(section.id)}
                            className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors ${
                              selectedSectionId === section.id
                                ? 'bg-ide-accent-dim text-ide-text-bright border-l-2 border-ide-accent'
                                : 'text-ide-text-muted hover:bg-ide-hover hover:text-ide-text'
                            }`}
                          >
                            <GripVertical size={9} className="opacity-30 shrink-0" />
                            <span className="text-[9px]">{sectionIcons[section.type] ?? '📄'}</span>
                            <span className="truncate">{section.type}</span>
                          </button>
                        </SectionContextMenu>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {ungroupedSections.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.15 }}
              >
              <SectionContextMenu sectionId={section.id}>
                <button
                  onClick={() => selectSection(section.id)}
                  className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-left transition-colors ${
                    selectedSectionId === section.id
                      ? 'bg-ide-accent-dim text-ide-text-bright border-l-2 border-ide-accent'
                      : 'text-ide-text-muted hover:bg-ide-hover hover:text-ide-text'
                  }`}
                >
                  <GripVertical size={9} className="opacity-30 shrink-0" />
                  <span className="text-[9px]">{sectionIcons[section.type] ?? '📄'}</span>
                  <span className="truncate">{section.type}</span>
                </button>
              </SectionContextMenu>
              </motion.div>
            ))}
          </div>

          <div className="relative mt-2">
            <button
              onClick={() => setShowSectionPicker(!showSectionPicker)}
              className="w-full py-1.5 border border-dashed border-ide-accent-border rounded-md text-center text-ide-accent text-[10px] hover:bg-ide-accent-dim transition-colors"
            >+ Add Section</button>
            {showSectionPicker && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-ide-panel border border-ide-border-bright rounded-lg shadow-dropdown z-20 max-h-[240px] overflow-y-auto scrollbar-ide">
                {SECTION_TYPES.filter(t => t !== 'custom').map((type) => (
                  <button
                    key={type}
                    onClick={() => { addSection(type); setShowSectionPicker(false); }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[10px] text-ide-text-muted hover:bg-ide-hover hover:text-ide-text-bright text-left transition-colors"
                  >
                    <span className="text-[9px]">{sectionIcons[type]}</span>
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                  </button>
                ))}
                <div className="border-t border-ide-border my-0.5" />
                <button
                  onClick={() => { setShowSectionPicker(false); setShowWizard(true); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[10px] text-ide-accent hover:bg-ide-accent-dim text-left transition-colors"
                >
                  <Wand2 size={10} />
                  <span>Custom Section Wizard</span>
                </button>
              </div>
            )}
          </div>
          <CustomSectionWizard open={showWizard} onClose={() => setShowWizard(false)} />
        </div>
      )}

      {activeTab === 'pages' && (
        <div className="flex-1 overflow-y-auto scrollbar-ide p-2 text-[11px]">
          {Object.entries(project.pages).map(([slug, page]) => {
            const isActive = currentPage === slug;
            return (
              <button
                key={slug}
                onClick={() => setPage(slug)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors mb-0.5 ${
                  isActive
                    ? 'bg-ide-accent-dim text-ide-text-bright border-l-2 border-ide-accent'
                    : 'text-ide-text-muted hover:bg-ide-hover'
                }`}
              >
                <span className="text-[10px]">{page.icon ?? '📄'}</span>
                <span className="truncate">{page.label}</span>
                <span className="ml-auto text-[8px] text-ide-text-dim">{page.sections.length}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowAddPage(true)}
            className="w-full mt-2 py-1.5 border border-dashed border-ide-accent-border rounded-md text-center text-ide-accent text-[10px] hover:bg-ide-accent-dim transition-colors"
          >+ Add Page</button>
          <AddPageDialog open={showAddPage} onClose={() => setShowAddPage(false)} />
        </div>
      )}
    </div>
  );
}
