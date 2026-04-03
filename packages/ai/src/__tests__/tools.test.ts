import { describe, it, expect } from 'vitest';
import { appkitTools } from '../tools';
import { buildSystemPrompt } from '../prompt-engine';
import { createDefaultLayout } from '@appkit/schema';

describe('appkitTools', () => {
  it('defines all expected tools', () => {
    const names = appkitTools.map((t) => t.name);
    expect(names).toContain('add_section');
    expect(names).toContain('update_section');
    expect(names).toContain('remove_section');
    expect(names).toContain('reorder_sections');
    expect(names).toContain('set_theme');
    expect(names).toContain('get_current_state');
    expect(names).toContain('build_entire_app');
    expect(names).toContain('generate_custom_component');
  });

  it('all tools have valid input_schema', () => {
    for (const tool of appkitTools) {
      expect(tool.input_schema).toBeDefined();
      expect(tool.input_schema.type).toBe('object');
    }
  });
});

describe('buildSystemPrompt', () => {
  it('includes schema and current state', () => {
    const prompt = buildSystemPrompt({
      storeType: 'fashion',
      brandGuidelines: null,
      currentLayout: createDefaultLayout(),
      currentPage: 'home',
      selectedSectionId: null,
    });
    expect(prompt).toContain('banner');
    expect(prompt).toContain('fashion');
    expect(prompt).toContain('home');
    expect(prompt).toContain('Conversion');
  });
});
