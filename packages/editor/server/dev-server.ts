import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'vite';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const VSCODE_PORT = 3100;
const VITE_PORT = 5200;

let vscodeProcess: ChildProcess | null = null;

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

async function startVite(): Promise<void> {
  const server = await createServer({
    configFile: resolve(process.cwd(), 'vite.config.ts'),
    server: { port: VITE_PORT },
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

  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    vscodeProcess?.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    vscodeProcess?.kill();
    process.exit(0);
  });
}

main().catch(console.error);
