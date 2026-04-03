import type {
  AppLayout,
  Section,
  SectionType,
  SpacingConfig,
  StylingConfig,
} from './types';
import { SECTION_TYPES } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function ok(): ValidationResult {
  return { valid: true, errors: [] };
}

function fail(...errors: string[]): ValidationResult {
  return { valid: false, errors };
}

function validateSpacing(spacing: SpacingConfig | undefined): string | null {
  if (!spacing) return null;
  for (const [key, val] of Object.entries(spacing)) {
    if (typeof val === 'number' && val < 0) {
      return `spacing.${key} must be non-negative, got ${val}`;
    }
  }
  return null;
}

function validateStyling(styling: StylingConfig | undefined): string | null {
  if (!styling) return null;
  if (styling.borderRadius !== undefined && styling.borderRadius < 0) {
    return 'styling.borderRadius must be non-negative';
  }
  if (styling.borderWidth !== undefined && styling.borderWidth < 0) {
    return 'styling.borderWidth must be non-negative';
  }
  return null;
}

export function validateSection(section: Section): ValidationResult {
  if (!section.type || !SECTION_TYPES.includes(section.type as SectionType)) {
    return fail(`Invalid section type: ${section.type}`);
  }

  const spacingError = validateSpacing(section.spacing);
  if (spacingError) return fail(spacingError);

  const stylingError = validateStyling(section.styling);
  if (stylingError) return fail(stylingError);

  const config = section.config;

  switch (config.type) {
    case 'banner': {
      if (!Array.isArray(config.data)) return fail('Banner must have data array');
      if (config.data.length > 5) return fail('Banner can have max 5 items');
      for (let i = 0; i < config.data.length; i++) {
        const item = config.data[i];
        if (item.mediaType === 'image' && !item.imageUrl) {
          return fail(`Banner item ${i} missing imageUrl`);
        }
        if (item.mediaType === 'video' && !item.videoUrl) {
          return fail(`Banner item ${i} missing videoUrl`);
        }
      }
      if (config.bannerConfig?.autoplaySpeed !== undefined) {
        if (config.bannerConfig.autoplaySpeed < 1000 || config.bannerConfig.autoplaySpeed > 10000) {
          return fail('Banner autoplaySpeed must be 1000-10000ms');
        }
      }
      break;
    }

    case 'categories': {
      if (!Array.isArray(config.collectionIds)) return fail('Categories must have collectionIds array');
      if (config.collectionIds.length < 1 || config.collectionIds.length > 6) {
        return fail('Categories must have 1-6 collection IDs');
      }
      const validVariants = ['grid', 'horizontal', 'carousel', 'large-cards', 'circular'];
      if (config.variant && !validVariants.includes(config.variant)) {
        return fail(`Categories variant must be one of: ${validVariants.join(', ')}`);
      }
      break;
    }

    case 'products': {
      if (!config.collectionId) return fail('Products must have collectionId');
      if (config.title && config.title.length > 50) return fail('Products title max 50 chars');
      if (config.subtitle && config.subtitle.length > 100) return fail('Products subtitle max 100 chars');
      const validSorts = ['newest', 'oldest', 'priceLowToHigh', 'priceHighToLow', 'highestRated', 'nameAsc', 'nameDesc', 'mostPopular', 'mostBought'];
      if (config.sortBy && !validSorts.includes(config.sortBy)) {
        return fail(`Products sortBy must be one of: ${validSorts.join(', ')}`);
      }
      const validProductVariants = ['default', 'circular', 'flashSale', 'justForYou', 'grid', 'list', 'minimalist'];
      if (config.variant && !validProductVariants.includes(config.variant)) {
        return fail(`Products variant must be one of: ${validProductVariants.join(', ')}`);
      }
      if (config.cardSize && !['small', 'medium', 'large'].includes(config.cardSize)) {
        return fail('Products cardSize must be small, medium, or large');
      }
      break;
    }

    case 'collections': {
      if (!Array.isArray(config.collectionIds)) return fail('Collections must have collectionIds array');
      if (config.collectionIds.length < 1 || config.collectionIds.length > 20) {
        return fail('Collections must have 1-20 collection IDs');
      }
      break;
    }

    case 'header': {
      if (!config.text) return fail('Header must have text');
      break;
    }

    case 'video': {
      if (config.videoVariant === 'carousel') {
        if (!Array.isArray(config.carouselData) || config.carouselData.length === 0) {
          return fail('Video carousel must have carouselData with at least one item');
        }
        for (let i = 0; i < config.carouselData.length; i++) {
          const item = config.carouselData[i];
          if (!item.videoUrl && !item.videoFileUrl) {
            return fail(`Video carousel item ${i} must have videoUrl or videoFileUrl`);
          }
          if (!item.productId) return fail(`Video carousel item ${i} must have productId`);
        }
      } else {
        if (!config.videoUrl && !config.videoFileUrl) {
          return fail('Video must have videoUrl or videoFileUrl');
        }
      }
      break;
    }

    case 'flash_sale': {
      const fc = config.flashSaleConfig;
      if (!fc?.endDate) return fail('Flash sale must have endDate');
      break;
    }

    case 'reviews': {
      const rc = config.reviewsConfig;
      if (!rc) return fail('Reviews must have reviewsConfig');
      if (rc.productLimit !== undefined && (rc.productLimit < 1 || rc.productLimit > 50)) {
        return fail('Reviews productLimit must be 1-50');
      }
      break;
    }

    case 'offer': {
      break;
    }

    case 'hero': {
      const hc = config.heroConfig;
      if (!hc?.imageUrl) return fail('Hero must have imageUrl');
      if (hc.textPosition && !['center', 'left', 'right'].includes(hc.textPosition)) {
        return fail('Hero textPosition must be center, left, or right');
      }
      if (hc.overlayOpacity !== undefined && (hc.overlayOpacity < 0 || hc.overlayOpacity > 1)) {
        return fail('Hero overlayOpacity must be 0-1');
      }
      break;
    }

    case 'tabs': {
      const tc = config.tabsConfig;
      if (!tc?.tabs || tc.tabs.length < 2 || tc.tabs.length > 10) {
        return fail('Tabs must have 2-10 tabs');
      }
      for (let i = 0; i < tc.tabs.length; i++) {
        const tab = tc.tabs[i];
        if (!tab.title) return fail(`Tab ${i} must have title`);
        if (tab.title.length > 50) return fail(`Tab ${i} title max 50 chars`);
        if (!tab.collectionIds || tab.collectionIds.length < 1) {
          return fail(`Tab ${i} must have at least one collectionId`);
        }
      }
      break;
    }

    case 'marquee': {
      const mc = config.marqueeConfig;
      if (!mc?.items || mc.items.length < 1) return fail('Marquee must have at least one item');
      if (mc.speed !== undefined && (mc.speed < 1 || mc.speed > 10)) {
        return fail('Marquee speed must be 1-10');
      }
      if (mc.direction && !['left', 'right'].includes(mc.direction)) {
        return fail('Marquee direction must be left or right');
      }
      break;
    }

    case 'custom': {
      const cc = config.customConfig;
      if (!cc?.componentName) return fail('Custom section must have componentName');
      if (cc.componentName.length > 100) return fail('Custom componentName max 100 chars');
      break;
    }

    default:
      return fail(`Unknown section type: ${(config as any).type}`);
  }

  return ok();
}

export function validateLayout(layout: AppLayout): ValidationResult {
  const allErrors: string[] = [];

  for (const pageType of Object.keys(layout.pages) as Array<keyof typeof layout.pages>) {
    const sections = layout.pages[pageType];

    if (!Array.isArray(sections)) {
      allErrors.push(`${pageType}: sections must be an array`);
      continue;
    }

    if (sections.length > 10) {
      allErrors.push(`${pageType}: Maximum 10 sections allowed`);
      continue;
    }

    let prevType: string | null = null;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      if (section.type === 'header' && prevType === 'header') {
        allErrors.push(`${pageType}: Cannot have consecutive headers at index ${i}`);
      }
      prevType = section.type;

      const result = validateSection(section);
      if (!result.valid) {
        allErrors.push(...result.errors.map((e) => `${pageType}[${i}]: ${e}`));
      }
    }
  }

  if (allErrors.length > 0) {
    return { valid: false, errors: allErrors };
  }
  return ok();
}
