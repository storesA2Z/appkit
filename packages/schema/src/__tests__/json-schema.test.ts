import { describe, it, expect } from 'vitest';
import { layoutJsonSchema, schemaPrompt } from '../index';

describe('layoutJsonSchema', () => {
  it('is a valid JSON Schema object', () => {
    expect(layoutJsonSchema.$schema).toContain('json-schema');
    expect(layoutJsonSchema.type).toBe('object');
    expect(layoutJsonSchema.properties).toBeDefined();
  });

  it('defines all 13 section types', () => {
    const sectionSchema = layoutJsonSchema.properties.pages.additionalProperties.items;
    const typeEnum = sectionSchema.properties.type.enum;
    expect(typeEnum).toHaveLength(13);
    expect(typeEnum).toContain('banner');
    expect(typeEnum).toContain('marquee');
    expect(typeEnum).toContain('custom');
  });
});

describe('schemaPrompt', () => {
  it('is a non-empty string', () => {
    expect(typeof schemaPrompt).toBe('string');
    expect(schemaPrompt.length).toBeGreaterThan(500);
  });

  it('mentions all 13 section types', () => {
    expect(schemaPrompt).toContain('banner');
    expect(schemaPrompt).toContain('categories');
    expect(schemaPrompt).toContain('products');
    expect(schemaPrompt).toContain('hero');
    expect(schemaPrompt).toContain('flash_sale');
    expect(schemaPrompt).toContain('marquee');
    expect(schemaPrompt).toContain('tabs');
  });

  it('includes e-commerce best practices', () => {
    expect(schemaPrompt).toContain('Conversion');
  });
});
