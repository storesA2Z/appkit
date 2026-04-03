import { describe, it, expect } from 'vitest';
import { validateLayout, validateSection } from '../index';
import type { AppLayout, Section } from '../index';
import { createDefaultLayout } from '../index';

describe('validateLayout', () => {
  it('accepts a valid empty layout', () => {
    const layout = createDefaultLayout();
    const result = validateLayout(layout);
    expect(result.valid).toBe(true);
  });

  it('rejects more than 10 sections per page', () => {
    const layout = createDefaultLayout();
    layout.pages.home = Array.from({ length: 11 }, (_, i) => ({
      id: `s${i}`,
      type: 'header' as const,
      config: { type: 'header' as const, text: `Header ${i}` },
    }));
    const result = validateLayout(layout);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Maximum 10 sections');
  });

  it('rejects consecutive header sections', () => {
    const layout = createDefaultLayout();
    layout.pages.home = [
      { id: '1', type: 'header', config: { type: 'header', text: 'A' } },
      { id: '2', type: 'header', config: { type: 'header', text: 'B' } },
    ];
    const result = validateLayout(layout);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('consecutive headers');
  });
});

describe('validateSection', () => {
  it('validates a valid banner section', () => {
    const section: Section = {
      id: 'b1',
      type: 'banner',
      config: {
        type: 'banner',
        data: [{ mediaType: 'image', imageUrl: 'https://example.com/img.jpg' }],
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(true);
  });

  it('rejects banner with more than 5 items', () => {
    const section: Section = {
      id: 'b1',
      type: 'banner',
      config: {
        type: 'banner',
        data: Array.from({ length: 6 }, () => ({ mediaType: 'image' as const, imageUrl: 'https://example.com/img.jpg' })),
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(false);
  });

  it('validates a valid products section', () => {
    const section: Section = {
      id: 'p1',
      type: 'products',
      config: {
        type: 'products',
        collectionId: 'col-1',
        variant: 'grid',
        cardSize: 'medium',
        sortBy: 'newest',
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(true);
  });

  it('rejects products section without collectionId', () => {
    const section: Section = {
      id: 'p1',
      type: 'products',
      config: {
        type: 'products',
        collectionId: '',
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(false);
  });

  it('validates a valid categories section', () => {
    const section: Section = {
      id: 'c1',
      type: 'categories',
      config: {
        type: 'categories',
        collectionIds: ['a', 'b', 'c'],
        variant: 'grid',
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(true);
  });

  it('rejects categories with more than 6 items', () => {
    const section: Section = {
      id: 'c1',
      type: 'categories',
      config: {
        type: 'categories',
        collectionIds: ['1', '2', '3', '4', '5', '6', '7'],
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(false);
  });

  it('validates hero with required imageUrl', () => {
    const section: Section = {
      id: 'h1',
      type: 'hero',
      config: {
        type: 'hero',
        heroConfig: { imageUrl: 'https://example.com/hero.jpg', textPosition: 'center' },
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(true);
  });

  it('rejects hero without imageUrl', () => {
    const section: Section = {
      id: 'h1',
      type: 'hero',
      config: {
        type: 'hero',
        heroConfig: { imageUrl: '' },
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(false);
  });

  it('validates tabs with 2-10 tabs', () => {
    const section: Section = {
      id: 't1',
      type: 'tabs',
      config: {
        type: 'tabs',
        tabsConfig: {
          tabs: [
            { id: 'tab1', title: 'Men', collectionIds: ['col-men'] },
            { id: 'tab2', title: 'Women', collectionIds: ['col-women'] },
          ],
          variant: 'grid',
        },
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(true);
  });

  it('rejects tabs with fewer than 2', () => {
    const section: Section = {
      id: 't1',
      type: 'tabs',
      config: {
        type: 'tabs',
        tabsConfig: {
          tabs: [{ id: 'tab1', title: 'Only', collectionIds: ['col'] }],
        },
      },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(false);
  });

  it('validates negative spacing values are rejected', () => {
    const section: Section = {
      id: 'h1',
      type: 'header',
      config: { type: 'header', text: 'Hello' },
      spacing: { marginTop: -5 },
    };
    const result = validateSection(section);
    expect(result.valid).toBe(false);
  });
});
