import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Workspace } from '../workspace';

describe('Workspace', () => {
  let dir: string;
  let workspace: Workspace;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'appkit-test-'));
    workspace = new Workspace(dir);
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('creates default project on first load', () => {
    const project = workspace.loadProject();
    expect(project.version).toBe('1.0.0');
    expect(Array.isArray(project.layout.pages.home.sections)).toBe(true);
  });

  // Use 'explore' page which starts empty to avoid default section interference
  it('adds a section', () => {
    workspace.addSection('explore', {
      id: 'test-1',
      type: 'header',
      config: { type: 'header', text: 'Hello' },
    });
    const sections = workspace.getSections('explore');
    expect(sections).toHaveLength(1);
    expect(sections[0].id).toBe('test-1');
  });

  it('updates a section', () => {
    workspace.addSection('explore', {
      id: 'test-1',
      type: 'header',
      config: { type: 'header', text: 'Hello' },
    });
    workspace.updateSection('explore', 'test-1', { text: 'Updated' });
    const sections = workspace.getSections('explore');
    expect((sections[0].config as any).text).toBe('Updated');
  });

  it('removes a section', () => {
    workspace.addSection('explore', {
      id: 'test-1',
      type: 'header',
      config: { type: 'header', text: 'Hello' },
    });
    workspace.removeSection('explore', 'test-1');
    expect(workspace.getSections('explore')).toHaveLength(0);
  });

  it('persists across workspace instances', () => {
    workspace.addSection('explore', {
      id: 'test-1',
      type: 'header',
      config: { type: 'header', text: 'Persist' },
    });
    const workspace2 = new Workspace(dir);
    expect(workspace2.getSections('explore')).toHaveLength(1);
  });
});
