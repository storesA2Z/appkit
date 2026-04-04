import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { generateExpoProject } from '@appkit/export';
import type { AppLayout } from '@appkit/schema';

export function writeDesignToProject(layout: AppLayout, projectPath: string): number {
  const files = generateExpoProject(layout);

  for (const file of files) {
    const fullPath = join(projectPath, file.path);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, file.content, 'utf-8');
  }

  return files.length;
}
