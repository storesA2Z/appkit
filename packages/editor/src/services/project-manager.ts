import { existsSync, readdirSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { scaffoldProject } from 'create-appkit/scaffold';

export interface AppkitProject {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  schemaVersion: string;
}

export class ProjectManager {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    mkdirSync(baseDir, { recursive: true });
  }

  createProject(name: string): AppkitProject {
    const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const targetDir = join(this.baseDir, slug);

    scaffoldProject({ projectName: name, targetDir });

    const meta = JSON.parse(readFileSync(join(targetDir, '.appkit.json'), 'utf-8'));

    return {
      id: meta.id,
      name: meta.name,
      path: targetDir,
      createdAt: meta.createdAt,
      schemaVersion: meta.schemaVersion,
    };
  }

  listProjects(): AppkitProject[] {
    if (!existsSync(this.baseDir)) return [];

    const entries = readdirSync(this.baseDir, { withFileTypes: true });
    const projects: AppkitProject[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const metaPath = join(this.baseDir, entry.name, '.appkit.json');
      if (!existsSync(metaPath)) continue;

      const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
      projects.push({
        id: meta.id,
        name: meta.name,
        path: join(this.baseDir, entry.name),
        createdAt: meta.createdAt,
        schemaVersion: meta.schemaVersion,
      });
    }

    return projects;
  }

  openProject(id: string): AppkitProject | null {
    const projects = this.listProjects();
    return projects.find((p) => p.id === id) ?? null;
  }
}
