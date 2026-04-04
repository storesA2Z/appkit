import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeDesignToProject } from '../schema-sync';
import { createDefaultLayout } from '@appkit/schema';
import { existsSync, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('schema-sync', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = join(tmpdir(), `schema-sync-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('writes Expo project files to disk from AppLayout', () => {
    const layout = createDefaultLayout();
    const fileCount = writeDesignToProject(layout, tempDir);

    expect(fileCount).toBeGreaterThan(0);
    expect(existsSync(join(tempDir, 'package.json'))).toBe(true);
    expect(existsSync(join(tempDir, 'App.tsx'))).toBe(true);
    expect(existsSync(join(tempDir, 'src', 'data', 'layout.json'))).toBe(true);
  });

  it('writes layout.json that matches the input layout', () => {
    const layout = createDefaultLayout();
    writeDesignToProject(layout, tempDir);

    const written = JSON.parse(readFileSync(join(tempDir, 'src', 'data', 'layout.json'), 'utf-8'));
    expect(written.metadata.name).toBe(layout.metadata.name);
    expect(Object.keys(written.pages)).toEqual(Object.keys(layout.pages));
  });

  it('creates nested directories as needed', () => {
    const layout = createDefaultLayout();
    writeDesignToProject(layout, tempDir);

    expect(existsSync(join(tempDir, 'src', 'sections'))).toBe(true);
    expect(existsSync(join(tempDir, 'src', 'navigation'))).toBe(true);
    expect(existsSync(join(tempDir, 'src', 'screens'))).toBe(true);
  });
});
