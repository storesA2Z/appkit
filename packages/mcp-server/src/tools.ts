import type { Workspace } from './workspace';
import type { Section } from '@appkit/schema';
import { validateSection } from '@appkit/schema';

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  errors?: string[];
}

export function createToolHandlers(workspace: Workspace) {
  return {
    getProject: (): ToolResult => {
      return { success: true, data: workspace.loadProject() };
    },

    listSections: (page: string): ToolResult => {
      return { success: true, data: workspace.getSections(page) };
    },

    addSection: (page: string, section: Section, index?: number): ToolResult => {
      const validation = validateSection(section);
      if (!validation.valid) {
        return { success: false, error: 'Validation failed', errors: validation.errors };
      }
      workspace.addSection(page, section, index);
      return { success: true, data: { id: section.id } };
    },

    updateSection: (page: string, sectionId: string, changes: Record<string, any>): ToolResult => {
      workspace.updateSection(page, sectionId, changes);
      return { success: true };
    },

    removeSection: (page: string, sectionId: string): ToolResult => {
      workspace.removeSection(page, sectionId);
      return { success: true };
    },

    setTheme: (theme: any): ToolResult => {
      const project = workspace.loadProject();
      project.layout.theme = { ...project.layout.theme, ...theme };
      workspace.saveProject(project);
      return { success: true };
    },

    setMetadata: (metadata: any): ToolResult => {
      const project = workspace.loadProject();
      project.layout.metadata = { ...project.layout.metadata, ...metadata };
      workspace.saveProject(project);
      return { success: true };
    },
  };
}
