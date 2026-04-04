import { spawn, type ChildProcess } from 'node:child_process';
import { createServer, type Plugin } from 'vite';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { FileWatcher } from '../src/services/file-watcher';
import { writeDesignToProject } from '../src/services/schema-sync';

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
    console.log('   Install it with: npx appkit setup');
    console.log('   Or install manually: npm install -g @gitpod/openvscode-server');
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

function syncApiPlugin(): Plugin {
  return {
    name: 'appkit-sync-api',
    configureServer(server) {
      server.middlewares.use('/api/sync-design', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const { layout, projectPath } = JSON.parse(body);
            const fileCount = writeDesignToProject(layout, projectPath);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, fileCount }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: err.message }));
          }
        });
      });
    },
  };
}

async function startVite(): Promise<void> {
  const server = await createServer({
    configFile: resolve(process.cwd(), 'vite.config.ts'),
    server: { port: VITE_PORT },
    plugins: [syncApiPlugin()],
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
