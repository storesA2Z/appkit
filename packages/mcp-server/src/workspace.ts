import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { AppProject, AppLayout, Section, PageType, SectionType } from '@appkit/schema';
import { createDefaultLayout } from '@appkit/schema';

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
    return JSON.parse(content);
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

  getSections(page: PageType): Section[] {
    return this.getLayout().pages[page];
  }

  addSection(page: PageType, section: Section, index?: number): void {
    const layout = this.getLayout();
    if (index !== undefined) {
      layout.pages[page].splice(index, 0, section);
    } else {
      layout.pages[page].push(section);
    }
    this.setLayout(layout);
  }

  updateSection(page: PageType, sectionId: string, changes: Record<string, any>): void {
    const layout = this.getLayout();
    layout.pages[page] = layout.pages[page].map((s) => {
      if (s.id !== sectionId) return s;
      return { ...s, config: { ...s.config, ...changes } };
    });
    this.setLayout(layout);
  }

  removeSection(page: PageType, sectionId: string): void {
    const layout = this.getLayout();
    layout.pages[page] = layout.pages[page].filter((s) => s.id !== sectionId);
    this.setLayout(layout);
  }
}
