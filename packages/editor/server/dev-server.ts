import { spawn, type ChildProcess } from 'node:child_process';
import { createServer, type Plugin } from 'vite';
import { resolve, join } from 'node:path';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { FileWatcher } from '../src/services/file-watcher';
import { writeDesignToProject } from '../src/services/schema-sync';
import { scaffoldProject } from 'create-appkit/src/scaffold';
import { getTemplates } from 'create-appkit/src/templates';

const VSCODE_PORT = 3100;
const VITE_PORT = 5200;

let vscodeProcess: ChildProcess | null = null;
let fileWatcher: FileWatcher | null = null;

function findOpenVSCode(): string | null {
  const candidates = [
    resolve(process.cwd(), 'node_modules', '.bin', 'openvscode-server'),
    resolve(process.env.HOME ?? '', '.appkit', 'openvscode-server', 'bin', 'openvscode-server'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function startVSCodeServer(): void {
  const binary = findOpenVSCode();

  if (!binary) {
    console.log('\n⚠️  OpenVSCode Server not found.');
    console.log('   Install it with: bash packages/editor/scripts/setup-vscode.sh');
    console.log('   The editor will start without VS Code — you can still use the preview.\n');
    return;
  }

  vscodeProcess = spawn(binary, [
    '--port', String(VSCODE_PORT),
    '--without-connection-token',
    '--host', '127.0.0.1',
  ], {
    stdio: 'pipe',
    env: { ...process.env },
  });

  vscodeProcess.stdout?.on('data', (data: Buffer) => {
    const msg = data.toString().trim();
    if (msg) console.log(`[vscode] ${msg}`);
  });

  vscodeProcess.stderr?.on('data', (data: Buffer) => {
    const msg = data.toString().trim();
    if (msg) console.error(`[vscode] ${msg}`);
  });

  vscodeProcess.on('error', (err) => {
    console.error(`[vscode] Failed to start: ${err.message}`);
  });

  console.log(`[appkit] OpenVSCode Server starting on port ${VSCODE_PORT}`);
}

export async function startFileWatcher(projectPath: string): Promise<void> {
  if (fileWatcher) {
    await fileWatcher.stop();
  }

  fileWatcher = new FileWatcher();

  fileWatcher.on('change', (event) => {
    if (event.type === 'unlink') return;

    try {
      const absPath = resolve(projectPath, event.path);
      const content = fileWatcher!.readFile(absPath);
      console.log(`[watcher] ${event.type}: ${event.path} (${content.length} bytes)`);
    } catch (err: any) {
      console.error(`[watcher] Error reading ${event.path}: ${err.message}`);
    }
  });

  await fileWatcher.start(projectPath);
  console.log(`[appkit] File watcher active for ${projectPath}`);
}

const PROJECTS_DIR = resolve(process.env.HOME ?? '/tmp', '.appkit', 'projects');

function readBody(req: any): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
    req.on('end', () => resolve(body));
  });
}

function readProjectFiles(dirPath: string, base = ''): Record<string, string> {
  const files: Record<string, string> = {};
  if (!existsSync(dirPath)) return files;

  for (const entry of readdirSync(dirPath)) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const fullPath = join(dirPath, entry);
    const relPath = base ? `${base}/${entry}` : entry;
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      Object.assign(files, readProjectFiles(fullPath, relPath));
    } else {
      try {
        files[relPath] = readFileSync(fullPath, 'utf-8');
      } catch { /* skip binary files */ }
    }
  }
  return files;
}

function apiPlugin(): Plugin {
  return {
    name: 'appkit-api',
    configureServer(server) {
      // List available templates
      server.middlewares.use('/api/templates', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(getTemplates()));
      });

      // Create a new project
      server.middlewares.use('/api/create-project', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        const body = await readBody(req);
        try {
          const { name, template } = JSON.parse(body);
          const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
          const targetDir = resolve(PROJECTS_DIR, slug);

          if (existsSync(targetDir)) {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'Project already exists' }));
            return;
          }

          const { mkdirSync } = await import('node:fs');
          mkdirSync(PROJECTS_DIR, { recursive: true });

          scaffoldProject({ projectName: name, targetDir, template: template || 'expo-router-tabs' });

          // Read .appkit.json to get project metadata
          const appkitJsonPath = join(targetDir, '.appkit.json');
          let projectMeta = { id: slug, name, schemaVersion: '3.0.0', createdAt: new Date().toISOString() };
          if (existsSync(appkitJsonPath)) {
            projectMeta = JSON.parse(readFileSync(appkitJsonPath, 'utf-8'));
          }

          // Read all files for Snack preview
          const files = readProjectFiles(targetDir);

          // Start file watcher for the new project
          startFileWatcher(targetDir);

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            ok: true,
            project: {
              id: projectMeta.id,
              name: projectMeta.name,
              path: targetDir,
              createdAt: projectMeta.createdAt,
              schemaVersion: projectMeta.schemaVersion,
            },
            files,
          }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: err.message }));
        }
      });

      // Read project files (for Snack sync)
      server.middlewares.use('/api/project-files', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        const body = await readBody(req);
        try {
          const { projectPath } = JSON.parse(body);
          const files = readProjectFiles(projectPath);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, files }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: err.message }));
        }
      });

      // Sync design to code
      server.middlewares.use('/api/sync-design', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        const body = await readBody(req);
        try {
          const { layout, projectPath } = JSON.parse(body);
          const fileCount = writeDesignToProject(layout, projectPath);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, fileCount }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: err.message }));
        }
      });
    },
  };
}

async function startVite(): Promise<void> {
  const server = await createServer({
    configFile: resolve(process.cwd(), 'vite.config.ts'),
    server: { port: VITE_PORT },
    plugins: [apiPlugin()],
  });
  await server.listen();
  console.log(`[appkit] Editor UI ready at http://localhost:${VITE_PORT}`);
}

async function main(): Promise<void> {
  console.log('\n🚀 Starting AppKit Editor...\n');

  startVSCodeServer();
  await startVite();

  console.log('\n✅ AppKit Editor is running!');
  console.log(`   Editor:  http://localhost:${VITE_PORT}`);
  console.log(`   VS Code: http://localhost:${VSCODE_PORT}\n`);

  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    vscodeProcess?.kill();
    if (fileWatcher) await fileWatcher.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    vscodeProcess?.kill();
    if (fileWatcher) await fileWatcher.stop();
    process.exit(0);
  });
}

main().catch(console.error);
