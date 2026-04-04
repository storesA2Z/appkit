import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FileWatcher } from '../file-watcher';
import { writeFileSync, mkdirSync, unlinkSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('FileWatcher', () => {
  let tempDir: string;
  let watcher: FileWatcher;

  beforeEach(() => {
    tempDir = join(tmpdir(), `fw-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
    watcher = new FileWatcher();
  });

  afterEach(async () => {
    await watcher.stop();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('detects new file creation', async () => {
    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);

    writeFileSync(join(tempDir, 'test.tsx'), 'export default function() {}');

    await new Promise((r) => setTimeout(r, 500));

    expect(events.length).toBeGreaterThanOrEqual(1);
    expect(events.some((e) => e.path.endsWith('test.tsx'))).toBe(true);
  });

  it('detects file modification', async () => {
    writeFileSync(join(tempDir, 'existing.tsx'), 'const a = 1;');

    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);

    writeFileSync(join(tempDir, 'existing.tsx'), 'const a = 2;');

    await new Promise((r) => setTimeout(r, 500));

    expect(events.some((e) => e.path.endsWith('existing.tsx') && e.type === 'change')).toBe(true);
  });

  it('ignores node_modules and dotfiles', async () => {
    mkdirSync(join(tempDir, 'node_modules'), { recursive: true });

    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);

    writeFileSync(join(tempDir, 'node_modules', 'foo.js'), 'ignored');
    writeFileSync(join(tempDir, '.hidden'), 'ignored');

    await new Promise((r) => setTimeout(r, 500));

    expect(events.filter((e) => e.path.includes('node_modules') || e.path.includes('.hidden'))).toHaveLength(0);
  });

  it('stops watching on stop()', async () => {
    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);
    await watcher.stop();

    writeFileSync(join(tempDir, 'after-stop.tsx'), 'should not trigger');

    await new Promise((r) => setTimeout(r, 500));

    expect(events.filter((e) => e.path.includes('after-stop'))).toHaveLength(0);
  });

  it('reads file content via readFile', async () => {
    writeFileSync(join(tempDir, 'read-me.tsx'), 'hello world');
    await watcher.start(tempDir);
    const content = watcher.readFile(join(tempDir, 'read-me.tsx'));
    expect(content).toBe('hello world');
  });

  it('returns relative path from project root', async () => {
    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);

    mkdirSync(join(tempDir, 'app'), { recursive: true });
    writeFileSync(join(tempDir, 'app', 'index.tsx'), 'export default 1');

    await new Promise((r) => setTimeout(r, 500));

    expect(events.some((e) => e.path === 'app/index.tsx')).toBe(true);
  });
});
