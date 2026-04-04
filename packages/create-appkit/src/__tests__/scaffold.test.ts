import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scaffoldProject } from '../scaffold';

describe('scaffoldProject', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'appkit-scaffold-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('creates project directory with template files', () => {
    const targetDir = join(dir, 'my-app');
    scaffoldProject({ projectName: 'My App', targetDir });

    expect(existsSync(join(targetDir, 'app', '_layout.tsx'))).toBe(true);
    expect(existsSync(join(targetDir, 'app', '(tabs)', '_layout.tsx'))).toBe(true);
    expect(existsSync(join(targetDir, 'app', '(tabs)', 'index.tsx'))).toBe(true);
    expect(existsSync(join(targetDir, 'components', 'ui', 'Button.tsx'))).toBe(true);
    expect(existsSync(join(targetDir, 'constants', 'theme.ts'))).toBe(true);
  });

  it('substitutes template variables in .tmpl files', () => {
    const targetDir = join(dir, 'test-app');
    scaffoldProject({ projectName: 'Test App', targetDir });

    const appJson = JSON.parse(readFileSync(join(targetDir, 'app.json'), 'utf-8'));
    expect(appJson.expo.name).toBe('Test App');
    expect(appJson.expo.slug).toBe('test-app');

    const appkitJson = JSON.parse(readFileSync(join(targetDir, '.appkit.json'), 'utf-8'));
    expect(appkitJson.name).toBe('Test App');
    expect(appkitJson.template).toBe('expo-router-tabs');
    expect(appkitJson.id).toMatch(/^proj_/);
  });

  it('creates package.json with expo dependencies', () => {
    const targetDir = join(dir, 'expo-app');
    scaffoldProject({ projectName: 'Expo App', targetDir });

    const pkg = JSON.parse(readFileSync(join(targetDir, 'package.json'), 'utf-8'));
    expect(pkg.dependencies.expo).toBeDefined();
    expect(pkg.dependencies['expo-router']).toBeDefined();
    expect(pkg.scripts.start).toBe('expo start');
  });
});
