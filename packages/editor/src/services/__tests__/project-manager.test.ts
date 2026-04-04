import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ProjectManager } from '../project-manager';

describe('ProjectManager', () => {
  let baseDir: string;
  let pm: ProjectManager;

  beforeEach(() => {
    baseDir = mkdtempSync(join(tmpdir(), 'appkit-pm-'));
    pm = new ProjectManager(baseDir);
  });

  afterEach(() => {
    rmSync(baseDir, { recursive: true, force: true });
  });

  it('creates a new project with Expo files', () => {
    const project = pm.createProject('My First App');
    expect(existsSync(project.path)).toBe(true);
    expect(existsSync(join(project.path, 'app', '_layout.tsx'))).toBe(true);
    expect(existsSync(join(project.path, 'package.json'))).toBe(true);
    expect(existsSync(join(project.path, '.appkit.json'))).toBe(true);
    expect(project.name).toBe('My First App');
  });

  it('lists projects', () => {
    pm.createProject('App One');
    pm.createProject('App Two');
    const projects = pm.listProjects();
    expect(projects).toHaveLength(2);
    expect(projects.map((p) => p.name)).toContain('App One');
    expect(projects.map((p) => p.name)).toContain('App Two');
  });

  it('opens an existing project', () => {
    const created = pm.createProject('Test App');
    const opened = pm.openProject(created.id);
    expect(opened).not.toBeNull();
    expect(opened!.name).toBe('Test App');
  });

  it('returns null for non-existent project', () => {
    expect(pm.openProject('nonexistent')).toBeNull();
  });
});
