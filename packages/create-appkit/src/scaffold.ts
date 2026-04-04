import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

interface ScaffoldOptions {
  projectName: string;
  targetDir: string;
  template?: string;
}

export function scaffoldProject({ projectName, targetDir, template = 'expo-router-tabs' }: ScaffoldOptions): string {
  const templateDir = resolve(dirname(new URL(import.meta.url).pathname), '../templates', template);

  if (!existsSync(templateDir)) {
    throw new Error(`Template "${template}" not found at ${templateDir}`);
  }

  mkdirSync(targetDir, { recursive: true });

  const vars: Record<string, string> = {
    '{{PROJECT_NAME}}': projectName,
    '{{PROJECT_SLUG}}': projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    '{{PROJECT_ID}}': `proj_${randomUUID().slice(0, 8)}`,
    '{{CREATED_AT}}': new Date().toISOString(),
  };

  copyDirRecursive(templateDir, targetDir, vars);

  return targetDir;
}

function copyDirRecursive(src: string, dest: string, vars: Record<string, string>): void {
  mkdirSync(dest, { recursive: true });

  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, join(dest, entry), vars);
    } else if (entry.endsWith('.tmpl')) {
      const destName = entry.replace('.tmpl', '');
      let content = readFileSync(srcPath, 'utf-8');
      for (const [key, value] of Object.entries(vars)) {
        content = content.replaceAll(key, value);
      }
      writeFileSync(join(dest, destName), content);
    } else {
      copyFileSync(srcPath, join(dest, entry));
    }
  }
}
