import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { AppProject, AppLayout, Section } from '@appkit/schema';
import { createDefaultLayout, migrateLayout } from '@appkit/schema';

export class Workspace {
  private dir: string;

  constructor(dir: string) {
    this.dir = dir;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  get projectPath(): string {
    return join(this.dir, 'layout.json');
  }

  loadProject(): AppProject {
    if (!existsSync(this.projectPath)) {
      const defaultProject: AppProject = {
        version: '1.0.0',
        layout: createDefaultLayout(),
        customComponents: [],
      };
      this.saveProject(defaultProject);
      return defaultProject;
    }
    const content = readFileSync(this.projectPath, 'utf-8');
    const raw = JSON.parse(content);
    if (raw.layout) {
      raw.layout = migrateLayout(raw.layout);
    }
    return raw;
  }

  saveProject(project: AppProject): void {
    writeFileSync(this.projectPath, JSON.stringify(project, null, 2));
  }

  getLayout(): AppLayout {
    return this.loadProject().layout;
  }

  setLayout(layout: AppLayout): void {
    const project = this.loadProject();
    project.layout = layout;
    this.saveProject(project);
  }

  getSections(page: string): Section[] {
    return this.getLayout().pages[page]?.sections ?? [];
  }

  addSection(page: string, section: Section, index?: number): void {
    const layout = this.getLayout();
    const pageConfig = layout.pages[page];
    if (!pageConfig) return;
    if (index !== undefined) {
      pageConfig.sections.splice(index, 0, section);
    } else {
      pageConfig.sections.push(section);
    }
    this.setLayout(layout);
  }

  updateSection(page: string, sectionId: string, changes: Record<string, any>): void {
    const layout = this.getLayout();
    const pageConfig = layout.pages[page];
    if (!pageConfig) return;
    pageConfig.sections = pageConfig.sections.map((s) => {
      if (s.id !== sectionId) return s;
      return { ...s, config: { ...s.config, ...changes } };
    });
    this.setLayout(layout);
  }

  removeSection(page: string, sectionId: string): void {
    const layout = this.getLayout();
    const pageConfig = layout.pages[page];
    if (!pageConfig) return;
    pageConfig.sections = pageConfig.sections.filter((s) => s.id !== sectionId);
    this.setLayout(layout);
  }
}
