import type { Workspace } from './workspace';
import { schemaPrompt, layoutJsonSchema } from '@appkit/schema';

export function registerResources(workspace: Workspace) {
  return {
    'appkit://current-layout': {
      name: 'Current Layout',
      description: 'The full current project layout as JSON',
      mimeType: 'application/json',
      handler: () => {
        const project = workspace.loadProject();
        return JSON.stringify(project.layout, null, 2);
      },
    },

    'appkit://schema': {
      name: 'Layout JSON Schema',
      description: 'JSON Schema for validating appkit layouts',
      mimeType: 'application/json',
      handler: () => JSON.stringify(layoutJsonSchema, null, 2),
    },

    'appkit://best-practices': {
      name: 'E-Commerce Best Practices',
      description: 'AI prompt context with section docs and conversion best practices',
      mimeType: 'text/plain',
      handler: () => schemaPrompt,
    },
  };
}
