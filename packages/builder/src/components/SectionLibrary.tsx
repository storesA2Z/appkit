import React from 'react';
import { SECTION_TYPES, type SectionType } from '@appkit/schema';
import {
  Image, Grid, ShoppingBag, Layers, Type, Video,
  Clock, Star, Gift, ImageIcon, FolderTree, MoveHorizontal,
} from 'lucide-react';
import { useAppkitStore } from '../store/appkit-store';

const sectionMeta: Record<SectionType, { label: string; icon: React.ElementType; description: string }> = {
  banner: { label: 'Banner', icon: Image, description: 'Image/video carousel' },
  categories: { label: 'Categories', icon: Grid, description: 'Category grid or carousel' },
  products: { label: 'Products', icon: ShoppingBag, description: 'Product listing' },
  collections: { label: 'Collections', icon: Layers, description: 'Collection showcase' },
  header: { label: 'Header', icon: Type, description: 'Text divider' },
  video: { label: 'Video', icon: Video, description: 'Video player' },
  flash_sale: { label: 'Flash Sale', icon: Clock, description: 'Countdown promotion' },
  reviews: { label: 'Reviews', icon: Star, description: 'Top-rated products' },
  offer: { label: 'Offer', icon: Gift, description: 'Promotional card' },
  hero: { label: 'Hero Image', icon: ImageIcon, description: 'Full-width hero' },
  tabs: { label: 'Tabs', icon: FolderTree, description: 'Tabbed collections' },
  marquee: { label: 'Marquee', icon: MoveHorizontal, description: 'Scrolling banner' },
};

export function SectionLibrary() {
  const addSection = useAppkitStore((s) => s.addSection);
  const currentSections = useAppkitStore((s) => s.project.pages[s.currentPage]);
  const selectSection = useAppkitStore((s) => s.selectSection);
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm text-gray-700">Sections</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {SECTION_TYPES.map((type) => {
          const meta = sectionMeta[type];
          const Icon = meta.icon;
          return (
            <button
              key={type}
              onClick={() => addSection(type)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Icon size={16} className="shrink-0" />
              <div>
                <div className="font-medium">{meta.label}</div>
                <div className="text-xs text-gray-400">{meta.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {currentSections.length > 0 && (
        <div className="border-t p-2">
          <div className="text-xs text-gray-500 font-medium px-2 mb-1">Current ({currentSections.length})</div>
          {currentSections.map((section) => {
            const meta = sectionMeta[section.type];
            return (
              <button
                key={section.id}
                onClick={() => selectSection(section.id)}
                className={`w-full text-left text-xs px-2 py-1.5 rounded ${
                  selectedSectionId === section.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
