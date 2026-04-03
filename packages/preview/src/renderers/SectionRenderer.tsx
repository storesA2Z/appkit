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
import { CustomRenderer } from './CustomRenderer';

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
  custom: CustomRenderer,
};

const typeLabels: Record<string, string> = {
  banner: 'Banner',
  products: 'Products',
  categories: 'Categories',
  hero: 'Hero',
  header: 'Header',
  flash_sale: 'Flash Sale',
  video: 'Video',
  reviews: 'Reviews',
  offer: 'Offer',
  tabs: 'Tabs',
  marquee: 'Marquee',
  collections: 'Collections',
  custom: 'Custom',
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
        outline: isSelected ? '2px solid #4c6ef5' : 'none',
        outlineOffset: -1,
        cursor: 'pointer',
        position: 'relative',
        transition: 'outline-color 0.15s ease',
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          fontSize: 9,
          fontWeight: 600,
          color: '#fff',
          backgroundColor: '#4c6ef5',
          padding: '2px 8px',
          borderRadius: '0 0 0 6px',
          zIndex: 10,
          letterSpacing: '0.02em',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          {typeLabels[section.type] || section.type}
        </div>
      )}
      <Renderer config={section.config} theme={theme} />
    </div>
  );
}
