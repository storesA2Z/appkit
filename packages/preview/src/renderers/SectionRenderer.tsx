import React from 'react';
import type { Section, ThemeConfig } from '@appkit/schema';
import { BannerRenderer } from './BannerRenderer';
import { ProductsRenderer } from './ProductsRenderer';
import { CategoriesRenderer } from './CategoriesRenderer';
import { HeroRenderer } from './HeroRenderer';
import { HeaderRenderer } from './HeaderRenderer';
import { FlashSaleRenderer } from './FlashSaleRenderer';
import { VideoRenderer } from './VideoRenderer';
import { ReviewsRenderer } from './ReviewsRenderer';
import { OfferRenderer } from './OfferRenderer';
import { TabsRenderer } from './TabsRenderer';
import { MarqueeRenderer } from './MarqueeRenderer';
import { CollectionsRenderer } from './CollectionsRenderer';

interface SectionRendererProps {
  section: Section;
  theme: ThemeConfig;
  isSelected: boolean;
  onClick?: () => void;
}

const renderers: Record<string, React.FC<{ config: any; theme: ThemeConfig }>> = {
  banner: BannerRenderer,
  products: ProductsRenderer,
  categories: CategoriesRenderer,
  hero: HeroRenderer,
  header: HeaderRenderer,
  flash_sale: FlashSaleRenderer,
  video: VideoRenderer,
  reviews: ReviewsRenderer,
  offer: OfferRenderer,
  tabs: TabsRenderer,
  marquee: MarqueeRenderer,
  collections: CollectionsRenderer,
};

export function SectionRenderer({ section, theme, isSelected, onClick }: SectionRendererProps) {
  const Renderer = renderers[section.type];
  if (!Renderer) return null;

  const spacing = section.spacing || {};
  const styling = section.styling || {};

  return (
    <div
      onClick={onClick}
      style={{
        marginTop: spacing.marginTop || 0,
        marginBottom: spacing.marginBottom || 0,
        paddingTop: spacing.paddingTop || 0,
        paddingBottom: spacing.paddingBottom || 0,
        backgroundColor: styling.backgroundColor || 'transparent',
        borderRadius: styling.borderRadius || 0,
        borderColor: styling.borderColor || 'transparent',
        borderWidth: styling.borderWidth || 0,
        borderStyle: styling.borderWidth ? 'solid' : 'none',
        outline: isSelected ? '2px solid #3b82f6' : 'none',
        outlineOffset: 2,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: -20,
          left: 4,
          fontSize: 10,
          color: '#3b82f6',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}>
          {section.type}
        </div>
      )}
      <Renderer config={section.config} theme={theme} />
    </div>
  );
}
