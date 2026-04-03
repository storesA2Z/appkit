import { describe, it, expect } from 'vitest';
import {
  type SectionType,
  type PageType,
  type Section,
  type AppLayout,
  type ThemeConfig,
  type AppMetadata,
  SECTION_TYPES,
  PAGE_TYPES,
  createDefaultTheme,
  createDefaultMetadata,
  createDefaultLayout,
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

  it('creates default layout with empty pages', () => {
    const layout = createDefaultLayout();
    expect(layout.pages.home).toEqual([]);
    expect(layout.pages.explore).toEqual([]);
    expect(layout.pages.profile).toEqual([]);
    expect(layout.pages.search).toEqual([]);
    expect(layout.theme).toBeDefined();
    expect(layout.metadata).toBeDefined();
  });
});
