import { describe, it, expect } from 'vitest';
import { exportAsJson, importFromJson } from '../json-export';
import { generateExpoProject } from '../expo-export';
import { createDefaultLayout } from '@appkit/schema';

describe('exportAsJson', () => {
  it('produces valid JSON with schema and version', () => {
    const layout = createDefaultLayout();
    const json = exportAsJson(layout);
    const parsed = JSON.parse(json);
    expect(parsed.$schema).toContain('appkit');
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.layout.pages.home.sections).toEqual([]);
  });
});

describe('importFromJson', () => {
  it('round-trips correctly', () => {
    const layout = createDefaultLayout();
    const json = exportAsJson(layout);
    const project = importFromJson(json);
    expect(project.layout.pages.home.sections).toEqual([]);
    expect(project.version).toBe('1.0.0');
  });

  it('throws on invalid input', () => {
    expect(() => importFromJson('{}')).toThrow('Invalid appkit project file');
  });
});

describe('generateExpoProject', () => {
  it('generates required files', () => {
    const layout = createDefaultLayout();
    const files = generateExpoProject(layout);
    const paths = files.map((f) => f.path);
    expect(paths).toContain('package.json');
    expect(paths).toContain('App.tsx');
    expect(paths).toContain('app.json');
    expect(paths).toContain('tsconfig.json');
    expect(paths).toContain('src/data/layout.json');
    expect(paths).toContain('src/theme/theme.ts');
    expect(paths).toContain('src/navigation/BottomTabs.tsx');
    expect(paths).toContain('src/screens/HomeScreen.tsx');
    expect(paths).toContain('src/screens/ExploreScreen.tsx');
    expect(paths).toContain('src/screens/SearchScreen.tsx');
    expect(paths).toContain('src/screens/ProfileScreen.tsx');
    expect(paths).toContain('src/sections/SectionRenderer.tsx');
    expect(paths).toContain('src/sections/custom-registry.ts');
    expect(paths).toContain('src/sections/BannerSection.tsx');
    expect(paths).toContain('src/sections/HeroSection.tsx');
    expect(paths).toContain('src/components/ProductCard.tsx');
    expect(paths).toContain('src/data/mock-data.ts');
    expect(files.length).toBeGreaterThanOrEqual(27);
  });

  it('layout.json contains the layout data', () => {
    const layout = createDefaultLayout();
    layout.metadata.name = 'Test Store';
    const files = generateExpoProject(layout);
    const layoutFile = files.find((f) => f.path === 'src/data/layout.json');
    const parsed = JSON.parse(layoutFile!.content);
    expect(parsed.metadata.name).toBe('Test Store');
  });
});
