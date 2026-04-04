export const SECTION_TYPES = [
  'banner', 'categories', 'products', 'collections',
  'header', 'video', 'flash_sale', 'reviews',
  'offer', 'hero', 'tabs', 'marquee', 'custom',
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const PAGE_TYPES = ['home', 'explore', 'profile', 'search'] as const;
export type PageType = (typeof PAGE_TYPES)[number];

export interface SpacingConfig {
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export interface StylingConfig {
  backgroundColor?: string;
  backgroundImage?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
}

export interface LinkConfig {
  linkType?: 'product' | 'collection' | 'category' | 'external' | 'route';
  linkTarget?: string;
}

export interface VisibilityCondition {
  type: 'userType' | 'device' | 'dateRange' | 'geolocation' | 'custom';
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
  value: string;
}

export interface VisibilityRules {
  enabled: boolean;
  logic: 'AND' | 'OR';
  conditions: VisibilityCondition[];
}

export interface BannerItem {
  mediaType: 'image' | 'video';
  imageUrl?: string;
  videoUrl?: string;
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  linkType?: string;
  linkTarget?: string;
}

export interface BannerConfig {
  data: BannerItem[];
  bannerConfig?: {
    autoplay?: boolean;
    autoplaySpeed?: number;
    showDots?: boolean;
    showArrows?: boolean;
    loop?: boolean;
    pauseOnHover?: boolean;
  };
}

export interface CategoriesConfig {
  collectionIds: string[];
  variant?: 'grid' | 'horizontal' | 'carousel' | 'large-cards' | 'circular';
}

export type ProductSortBy =
  | 'newest' | 'oldest'
  | 'priceLowToHigh' | 'priceHighToLow'
  | 'highestRated' | 'nameAsc' | 'nameDesc'
  | 'mostPopular' | 'mostBought';

export interface ProductsConfig {
  collectionId: string;
  title?: string;
  subtitle?: string;
  showSeeAll?: boolean;
  sortBy?: ProductSortBy;
  variant?: 'default' | 'circular' | 'flashSale' | 'justForYou' | 'grid' | 'list' | 'minimalist';
  layout?: 'horizontal' | 'grid';
  cardSize?: 'small' | 'medium' | 'large';
  limit?: number;
  productConfig?: {
    showBadges?: boolean;
    badgeTypes?: Array<'new' | 'sale' | 'bestseller' | 'limited'>;
    quickActions?: {
      showAddToCart?: boolean;
      showWishlist?: boolean;
      showQuickView?: boolean;
    };
  };
}

export interface CollectionsConfig {
  collectionIds: string[];
}

export interface HeaderConfig {
  text: string;
}

export interface VideoConfig {
  videoUrl?: string;
  videoFileUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  height?: number;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16' | 'auto';
  playsInline?: boolean;
  videoVariant?: 'default' | 'carousel';
  carouselData?: Array<{
    videoUrl?: string;
    videoFileUrl?: string;
    productId: string;
    thumbnailUrl?: string;
  }>;
}

export interface FlashSaleConfig {
  flashSaleConfig: {
    endDate: string;
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    linkType?: 'product' | 'category' | 'collection' | 'external' | 'route';
    linkTarget?: string;
    displayMode?: 'standalone' | 'integrated';
    styling?: {
      backgroundColor?: string;
      textColor?: string;
      timerColor?: string;
      ctaBackgroundColor?: string;
      ctaTextColor?: string;
    };
  };
}

export interface ReviewsConfig {
  reviewsConfig: {
    displayMode: 'top-rated';
    productLimit?: number;
    showRatings?: boolean;
    showReviewCount?: boolean;
    title?: string;
    subtitle?: string;
    cardStyle?: 'default' | 'minimal' | 'detailed';
  };
}

export interface OfferConfig {
  offerConfig: {
    title?: string;
    description?: string;
    discountText?: string;
    imageUrl?: string;
    backgroundColor?: string;
    ctaText?: string;
    linkType?: 'product' | 'category' | 'collection' | 'external' | 'route';
    linkTarget?: string;
  };
}

export interface HeroConfig {
  heroConfig: {
    imageUrl: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    textPosition?: 'center' | 'left' | 'right';
    overlayOpacity?: number;
    linkType?: 'product' | 'category' | 'collection' | 'external' | 'route';
    linkTarget?: string;
    height?: number;
  };
}

export interface TabsConfig {
  tabsConfig: {
    tabs: Array<{
      id: string;
      title: string;
      collectionIds: string[];
    }>;
    defaultTabIndex?: number;
    variant?: 'grid' | 'horizontal' | 'products';
  };
}

export interface MarqueeConfig {
  marqueeConfig: {
    items: Array<{
      text: string;
      icon?: string;
    }>;
    speed?: number;
    direction?: 'left' | 'right';
    backgroundColor?: string;
    textColor?: string;
    height?: number;
  };
}

export interface CustomConfig {
  customConfig: {
    componentName: string;
    componentPath?: string;
    props: Record<string, any>;
    fallbackText?: string;
  };
}

export type SectionConfig =
  | ({ type: 'banner' } & BannerConfig)
  | ({ type: 'categories' } & CategoriesConfig)
  | ({ type: 'products' } & ProductsConfig)
  | ({ type: 'collections' } & CollectionsConfig)
  | ({ type: 'header' } & HeaderConfig)
  | ({ type: 'video' } & VideoConfig)
  | ({ type: 'flash_sale' } & FlashSaleConfig)
  | ({ type: 'reviews' } & ReviewsConfig)
  | ({ type: 'offer' } & OfferConfig)
  | ({ type: 'hero' } & HeroConfig)
  | ({ type: 'tabs' } & TabsConfig)
  | ({ type: 'marquee' } & MarqueeConfig)
  | ({ type: 'custom' } & CustomConfig);

export interface Section {
  id: string;
  type: SectionType;
  config: SectionConfig;
  spacing?: SpacingConfig;
  styling?: StylingConfig;
  visibility?: VisibilityRules;
  customStyle?: Record<string, any>;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
  };
  layout: {
    borderRadius: string;
    spacing: string;
  };
}

export interface AppMetadata {
  name: string;
  description: string;
  version: string;
  icon?: string;
  splash?: string;
}

export type NavType = 'tab' | 'stack' | 'drawer';

export interface SectionGroup {
  id: string;
  name: string;
  sectionIds: string[];
  collapsed?: boolean;
}

export interface PageConfig {
  label: string;
  slug: string;
  icon?: string;
  isCore: boolean;
  navType: NavType;
  sections: Section[];
  groups?: SectionGroup[];
}

export interface SavedTheme {
  id: string;
  name: string;
  base: ThemeConfig;
  variants: ThemeVariant[];
  createdAt: string;
}

export interface ThemeVariant {
  id: string;
  name: string;
  overrides: Partial<ThemeConfig>;
}

export type SlotType = 'image' | 'text' | 'button' | 'divider' | 'icon';
export type LayoutTemplate = 'full-width' | 'two-column' | 'horizontal-scroll' | 'text-image';

export interface WizardSlot {
  id: string;
  type: SlotType;
  label: string;
  config: Record<string, any>;
}

export interface WizardLayout {
  template: LayoutTemplate;
  slots: WizardSlot[];
  style: Record<string, any>;
}

export interface AppLayout {
  pages: Record<string, PageConfig>;
  theme: ThemeConfig;
  themes?: SavedTheme[];
  activeThemeId?: string;
  activeVariantId?: string;
  metadata: AppMetadata;
}

export interface CustomComponent {
  name: string;
  code: string;
  props: Record<string, string>;
}

export interface AppProject {
  $schema?: string;
  version: string;
  layout: AppLayout;
  customComponents: CustomComponent[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  storeType?: string;
  updatedAt: string;
  createdAt: string;
}

export interface AppkitProjectMeta {
  name: string;
  id: string;
  schemaVersion: string;
  createdAt: string;
  template: string;
}
