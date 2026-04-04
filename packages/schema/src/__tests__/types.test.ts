import { describe, it, expect } from 'vitest';
import {
  type SectionType,
  type PageType,
  type Section,
  type AppLayout,
  type ThemeConfig,
  type AppMetadata,
  type PageConfig,
  type SectionGroup,
  SECTION_TYPES,
  PAGE_TYPES,
  createDefaultTheme,
  createDefaultMetadata,
  createDefaultLayout,
  migrateLayout,
} from '../index';

describe('@appkit/schema types', () => {
  it('exports all 13 section types', () => {
    expect(SECTION_TYPES).toHaveLength(13);
    expect(SECTION_TYPES).toContain('banner');
    expect(SECTION_TYPES).toContain('categories');
    expect(SECTION_TYPES).toContain('products');
    expect(SECTION_TYPES).toContain('collections');
    expect(SECTION_TYPES).toContain('header');
    expect(SECTION_TYPES).toContain('video');
    expect(SECTION_TYPES).toContain('flash_sale');
    expect(SECTION_TYPES).toContain('reviews');
    expect(SECTION_TYPES).toContain('offer');
    expect(SECTION_TYPES).toContain('hero');
    expect(SECTION_TYPES).toContain('tabs');
    expect(SECTION_TYPES).toContain('marquee');
    expect(SECTION_TYPES).toContain('custom');
  });

  it('exports all 4 page types', () => {
    expect(PAGE_TYPES).toEqual(['home', 'explore', 'profile', 'search']);
  });

  it('creates default theme', () => {
    const theme = createDefaultTheme();
    expect(theme.colors.primary).toBeDefined();
    expect(theme.typography.fontFamily).toBeDefined();
    expect(theme.layout.borderRadius).toBeDefined();
  });

  it('creates default metadata', () => {
    const meta = createDefaultMetadata();
    expect(meta.name).toBe('My App');
    expect(meta.version).toBe('1.0.0');
  });

  it('creates default layout with PageConfig pages', () => {
    const layout = createDefaultLayout();
    expect(layout.pages.home.label).toBe('Home');
    expect(layout.pages.home.isCore).toBe(true);
    expect(layout.pages.home.navType).toBe('tab');
    expect(layout.pages.home.sections).toEqual([]);
    expect(layout.pages.explore.slug).toBe('explore');
    expect(layout.themes).toEqual([]);
  });
});

describe('PageConfig', () => {
  it('should accept a valid PageConfig', () => {
    const page: PageConfig = {
      label: 'Home',
      slug: 'home',
      icon: '🏠',
      isCore: true,
      navType: 'tab',
      sections: [],
      groups: [],
    };
    expect(page.label).toBe('Home');
    expect(page.isCore).toBe(true);
  });

  it('should accept a custom page with stack nav', () => {
    const page: PageConfig = {
      label: 'About Us',
      slug: 'about-us',
      icon: '📖',
      isCore: false,
      navType: 'stack',
      sections: [],
    };
    expect(page.navType).toBe('stack');
  });
});

describe('SectionGroup', () => {
  it('should hold section IDs and collapse state', () => {
    const group: SectionGroup = {
      id: 'g1',
      name: 'Above Fold',
      sectionIds: ['s1', 's2'],
      collapsed: false,
    };
    expect(group.sectionIds).toHaveLength(2);
  });
});

describe('migrateLayout', () => {
  it('should migrate old Record<PageType, Section[]> to Record<string, PageConfig>', () => {
    const oldLayout = {
      pages: {
        home: [{ id: 's1', type: 'hero', config: { type: 'hero', heroConfig: { imageUrl: 'x' } } }],
        explore: [],
        profile: [],
        search: [],
      },
      theme: {
        colors: { primary: '#000', secondary: '#111', accent: '#222', background: '#fff', text: '#000' },
        typography: { fontFamily: 'Inter', fontSize: '14px', fontWeight: '400' },
        layout: { borderRadius: '8px', spacing: '16px' },
      },
      metadata: { name: 'Test', description: '', version: '1.0.0' },
    };
    const migrated = migrateLayout(oldLayout as any);
    expect(migrated.pages.home.label).toBe('Home');
    expect(migrated.pages.home.isCore).toBe(true);
    expect(migrated.pages.home.navType).toBe('tab');
    expect(migrated.pages.home.sections).toHaveLength(1);
    expect(migrated.pages.home.sections[0].id).toBe('s1');
  });

  it('should pass through already-migrated layouts', () => {
    const newLayout = {
      pages: {
        home: { label: 'Home', slug: 'home', isCore: true, navType: 'tab' as const, sections: [] },
      },
      theme: {
        colors: { primary: '#000', secondary: '#111', accent: '#222', background: '#fff', text: '#000' },
        typography: { fontFamily: 'Inter', fontSize: '14px', fontWeight: '400' },
        layout: { borderRadius: '8px', spacing: '16px' },
      },
      themes: [],
      activeThemeId: '',
      metadata: { name: 'Test', description: '', version: '1.0.0' },
    };
    const result = migrateLayout(newLayout as any);
    expect(result.pages.home.label).toBe('Home');
  });
});
