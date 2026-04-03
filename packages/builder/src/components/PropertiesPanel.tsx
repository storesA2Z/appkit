import React from 'react';
import { Trash2 } from 'lucide-react';
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
};

export function PropertiesPanel() {
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);
  const sections = useAppkitStore((s) => s.project.pages[s.currentPage]);
  const updateSection = useAppkitStore((s) => s.updateSection);
  const removeSection = useAppkitStore((s) => s.removeSection);

  const section = sections.find((s) => s.id === selectedSectionId);
  if (!section) {
    return (
      <div className="p-4 text-sm text-gray-400">
        Select a section to edit its properties
      </div>
    );
  }

  const PropertyComponent = propertyComponents[section.type];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-sm capitalize">{section.type.replace('_', ' ')}</h3>
        <button
          onClick={() => removeSection(section.id)}
          className="p-1 text-red-500 hover:bg-red-50 rounded"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {PropertyComponent && (
          <PropertyComponent
            config={section.config}
            onChange={(changes) => updateSection(section.id, changes)}
          />
        )}

        <SpacingStylingPanel
          spacing={section.spacing}
          styling={section.styling}
          onSpacingChange={() => {}}
          onStylingChange={() => {}}
        />
      </div>
    </div>
  );
}
