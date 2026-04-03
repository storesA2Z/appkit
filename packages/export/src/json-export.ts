import type { AppLayout, AppProject } from '@appkit/schema';

export function exportAsJson(layout: AppLayout, version: string = '1.0.0'): string {
  const project: AppProject = {
    $schema: 'https://appkit.storesa2z.com/schema/v1.json',
    version,
    layout,
    customComponents: [],
  };
  return JSON.stringify(project, null, 2);
}

export function importFromJson(json: string): AppProject {
  const parsed = JSON.parse(json);
  if (!parsed.layout || !parsed.version) {
    throw new Error('Invalid appkit project file: missing layout or version');
  }
  return parsed as AppProject;
}
