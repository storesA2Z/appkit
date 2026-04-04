import React from 'react';
import { Trash2, MousePointerClick } from 'lucide-react';
import {
  Image, Grid, ShoppingBag, Layers, Type, Video,
  Clock, Star, Gift, ImageIcon, FolderTree, MoveHorizontal, Code2,
} from 'lucide-react';
import type { SectionType, SpacingConfig, StylingConfig } from '@appkit/schema';
import { useAppkitStore } from '../store/appkit-store';
import { BannerProperties } from './properties/BannerProperties';
import { ProductsProperties } from './properties/ProductsProperties';
import { CategoriesProperties } from './properties/CategoriesProperties';
import { HeroProperties } from './properties/HeroProperties';
import { HeaderProperties } from './properties/HeaderProperties';
import { FlashSaleProperties } from './properties/FlashSaleProperties';
import { VideoProperties } from './properties/VideoProperties';
import { ReviewsProperties } from './properties/ReviewsProperties';
import { OfferProperties } from './properties/OfferProperties';
import { TabsProperties } from './properties/TabsProperties';
import { MarqueeProperties } from './properties/MarqueeProperties';
import { CollectionsProperties } from './properties/CollectionsProperties';
import { CustomProperties } from './properties/CustomProperties';
import { SpacingStylingPanel } from './properties/SpacingStylingPanel';

const propertyComponents: Record<string, React.FC<{ config: any; onChange: (changes: any) => void }>> = {
  banner: BannerProperties,
  products: ProductsProperties,
  categories: CategoriesProperties,
  hero: HeroProperties,
  header: HeaderProperties,
  flash_sale: FlashSaleProperties,
  video: VideoProperties,
  reviews: ReviewsProperties,
  offer: OfferProperties,
  tabs: TabsProperties,
  marquee: MarqueeProperties,
  collections: CollectionsProperties,
  custom: CustomProperties,
};

const sectionIcons: Record<SectionType, React.ElementType> = {
  banner: Image,
  categories: Grid,
  products: ShoppingBag,
  collections: Layers,
  header: Type,
  video: Video,
  flash_sale: Clock,
  reviews: Star,
  offer: Gift,
  hero: ImageIcon,
  tabs: FolderTree,
  marquee: MoveHorizontal,
  custom: Code2,
};

export function PropertiesPanel() {
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);
  const sections = useAppkitStore((s) => s.project.pages[s.currentPage]?.sections ?? []);
  const updateSection = useAppkitStore((s) => s.updateSection);
  const updateSectionSpacing = useAppkitStore((s) => s.updateSectionSpacing);
  const updateSectionStyling = useAppkitStore((s) => s.updateSectionStyling);
  const removeSection = useAppkitStore((s) => s.removeSection);

  const section = sections.find((s) => s.id === selectedSectionId);
  if (!section) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-ide-hover flex items-center justify-center mb-4">
          <MousePointerClick size={20} className="text-ide-text-dim" />
        </div>
        <p className="text-sm font-medium text-ide-text-muted">No section selected</p>
        <p className="text-xs text-ide-text-dim mt-1">Click a section in the preview or add one from the left panel</p>
      </div>
    );
  }

  const PropertyComponent = propertyComponents[section.type];
  const SectionIcon = sectionIcons[section.type as SectionType];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {SectionIcon && (
            <div className="w-7 h-7 rounded-lg bg-ide-accent-dim flex items-center justify-center">
              <SectionIcon size={14} className="text-ide-accent" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-ide-text-bright capitalize">{section.type.replace('_', ' ')}</h3>
            <p className="text-[10px] text-ide-text-dim">{section.id}</p>
          </div>
        </div>
        <button
          onClick={() => removeSection(section.id)}
          className="p-1.5 text-ide-text-dim hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete section"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5 animate-fade-in">
        {PropertyComponent && (
          <PropertyComponent
            config={section.config}
            onChange={(changes) => updateSection(section.id, changes)}
          />
        )}

        <SpacingStylingPanel
          spacing={section.spacing}
          styling={section.styling}
          onSpacingChange={(spacing) => updateSectionSpacing(section.id, spacing)}
          onStylingChange={(styling) => updateSectionStyling(section.id, styling)}
        />
      </div>
    </div>
  );
}
