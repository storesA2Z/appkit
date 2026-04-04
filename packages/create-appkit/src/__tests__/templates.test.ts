import { describe, it, expect } from 'vitest';
import { getTemplates, getTemplate } from '../templates';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

describe('template registry', () => {
  it('returns all available templates', () => {
    const templates = getTemplates();
    expect(templates.length).toBeGreaterThanOrEqual(5);
    expect(templates.map((t) => t.id)).toContain('expo-router-tabs');
    expect(templates.map((t) => t.id)).toContain('ecommerce-store');
    expect(templates.map((t) => t.id)).toContain('restaurant');
    expect(templates.map((t) => t.id)).toContain('portfolio');
    expect(templates.map((t) => t.id)).toContain('saas-dashboard');
  });

  it('each template has required metadata', () => {
    const templates = getTemplates();
    for (const t of templates) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.category).toBeTruthy();
    }
  });

  it('each template directory exists on disk', () => {
    const templates = getTemplates();
    const templatesDir = resolve(dirname(new URL(import.meta.url).pathname), '../../templates');
    for (const t of templates) {
      expect(existsSync(resolve(templatesDir, t.id))).toBe(true);
    }
  });

  it('gets a single template by id', () => {
    const t = getTemplate('ecommerce-store');
    expect(t).toBeDefined();
    expect(t!.name).toBe('E-Commerce Store');
  });

  it('returns undefined for unknown template', () => {
    expect(getTemplate('nonexistent')).toBeUndefined();
  });
});
