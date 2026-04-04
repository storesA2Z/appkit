# File Watcher + Design Mode Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the VS Code-to-Snack preview sync loop via a chokidar file watcher, and integrate the existing `@appkit/builder` into Design mode with Design→Code serialization.

**Architecture:** A new `file-watcher.ts` service uses chokidar to watch the project directory and pipes changed files to the existing `SnackBridge.updateSingleFile()`. For Design mode, the editor shell imports `@appkit/builder`'s App component directly from source (both packages use Vite, same monorepo) and renders it inside the Design mode container. When switching Design→Code, the builder's `AppLayout` schema is serialized to Expo files on disk using `@appkit/export`'s `generateExpoProject()`.

**Tech Stack:** chokidar v4, `@appkit/export` (generateExpoProject), `@appkit/builder` (App component), `@appkit/schema` (AppLayout type)

---

## File Structure

### New files:

```
packages/editor/src/services/file-watcher.ts          # chokidar watcher → SnackBridge sync
packages/editor/src/services/__tests__/file-watcher.test.ts
packages/editor/src/services/schema-sync.ts            # Design→Code: AppLayout → Expo files on disk
packages/editor/src/services/__tests__/schema-sync.test.ts
packages/editor/src/components/DesignModeWrapper.tsx    # Wraps @appkit/builder App for embedding
```

### Modified files:

```
packages/editor/src/App.tsx                            # Replace design placeholder with DesignModeWrapper
packages/editor/src/store/editor-store.ts              # Add fileWatcherActive state
packages/editor/server/dev-server.ts                   # Start file watcher alongside Vite + VS Code
packages/editor/src/types.ts                           # Add FileChangeEvent type
```

---

### Task 1: Build the file watcher service

**Files:**
- Create: `packages/editor/src/services/__tests__/file-watcher.test.ts`
- Create: `packages/editor/src/services/file-watcher.ts`
- Modify: `packages/editor/src/types.ts`

- [ ] **Step 1: Add FileChangeEvent type to types.ts**

Add to the bottom of `packages/editor/src/types.ts`:

```typescript
export interface FileChangeEvent {
  path: string;
  type: 'add' | 'change' | 'unlink';
}
```

- [ ] **Step 2: Write the failing tests**

Create `packages/editor/src/services/__tests__/file-watcher.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FileWatcher } from '../file-watcher';
import { writeFileSync, mkdirSync, unlinkSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('FileWatcher', () => {
  let tempDir: string;
  let watcher: FileWatcher;

  beforeEach(() => {
    tempDir = join(tmpdir(), `fw-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
    watcher = new FileWatcher();
  });

  afterEach(async () => {
    await watcher.stop();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('detects new file creation', async () => {
    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);

    writeFileSync(join(tempDir, 'test.tsx'), 'export default function() {}');

    // chokidar needs a moment to pick up the event
    await new Promise((r) => setTimeout(r, 500));

    expect(events.length).toBeGreaterThanOrEqual(1);
    expect(events.some((e) => e.path.endsWith('test.tsx'))).toBe(true);
  });

  it('detects file modification', async () => {
    // Create file before watching
    writeFileSync(join(tempDir, 'existing.tsx'), 'const a = 1;');

    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);

    writeFileSync(join(tempDir, 'existing.tsx'), 'const a = 2;');

    await new Promise((r) => setTimeout(r, 500));

    expect(events.some((e) => e.path.endsWith('existing.tsx') && e.type === 'change')).toBe(true);
  });

  it('ignores node_modules and dotfiles', async () => {
    mkdirSync(join(tempDir, 'node_modules'), { recursive: true });

    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);

    writeFileSync(join(tempDir, 'node_modules', 'foo.js'), 'ignored');
    writeFileSync(join(tempDir, '.hidden'), 'ignored');

    await new Promise((r) => setTimeout(r, 500));

    expect(events.filter((e) => e.path.includes('node_modules') || e.path.includes('.hidden'))).toHaveLength(0);
  });

  it('stops watching on stop()', async () => {
    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);
    await watcher.stop();

    writeFileSync(join(tempDir, 'after-stop.tsx'), 'should not trigger');

    await new Promise((r) => setTimeout(r, 500));

    expect(events.filter((e) => e.path.includes('after-stop'))).toHaveLength(0);
  });

  it('reads file content via readFile', async () => {
    writeFileSync(join(tempDir, 'read-me.tsx'), 'hello world');
    await watcher.start(tempDir);
    const content = watcher.readFile(join(tempDir, 'read-me.tsx'));
    expect(content).toBe('hello world');
  });

  it('returns relative path from project root', async () => {
    const events: { path: string; type: string }[] = [];
    watcher.on('change', (e) => events.push(e));

    await watcher.start(tempDir);

    mkdirSync(join(tempDir, 'app'), { recursive: true });
    writeFileSync(join(tempDir, 'app', 'index.tsx'), 'export default 1');

    await new Promise((r) => setTimeout(r, 500));

    expect(events.some((e) => e.path === 'app/index.tsx')).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd /tmp/appkit-clean && npx vitest run packages/editor/src/services/__tests__/file-watcher.test.ts 2>&1 | tail -10`
Expected: FAIL — `FileWatcher` does not exist

- [ ] **Step 4: Implement FileWatcher**

Create `packages/editor/src/services/file-watcher.ts`:

```typescript
import { watch, type FSWatcher } from 'chokidar';
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import type { FileChangeEvent } from '../types';

type ChangeListener = (event: FileChangeEvent) => void;

export class FileWatcher {
  private watcher: FSWatcher | null = null;
  private listeners: ChangeListener[] = [];
  private projectRoot: string = '';

  on(event: 'change', listener: ChangeListener): void {
    this.listeners.push(listener);
  }

  off(event: 'change', listener: ChangeListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  async start(projectRoot: string): Promise<void> {
    this.projectRoot = projectRoot;
    this.watcher = watch(projectRoot, {
      ignored: [
        '**/node_modules/**',
        '**/.*',
        '**/dist/**',
        '**/.git/**',
      ],
      ignoreInitial: true,
      persistent: true,
    });

    this.watcher.on('add', (absPath) => this.emit(absPath, 'add'));
    this.watcher.on('change', (absPath) => this.emit(absPath, 'change'));
    this.watcher.on('unlink', (absPath) => this.emit(absPath, 'unlink'));

    // Wait for watcher to be ready before returning
    await new Promise<void>((resolve) => {
      this.watcher!.on('ready', resolve);
    });
  }

  async stop(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
    this.listeners = [];
  }

  readFile(absPath: string): string {
    return readFileSync(absPath, 'utf-8');
  }

  private emit(absPath: string, type: FileChangeEvent['type']): void {
    const relPath = relative(this.projectRoot, absPath);
    for (const listener of this.listeners) {
      listener({ path: relPath, type });
    }
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd /tmp/appkit-clean && npx vitest run packages/editor/src/services/__tests__/file-watcher.test.ts 2>&1 | tail -10`
Expected: All 6 tests PASS

- [ ] **Step 6: Commit**

```bash
git add packages/editor/src/types.ts packages/editor/src/services/file-watcher.ts packages/editor/src/services/__tests__/file-watcher.test.ts
git commit -m "feat: add FileWatcher service with chokidar for project file monitoring"
```

---

### Task 2: Wire file watcher to SnackBridge in dev server

**Files:**
- Modify: `packages/editor/server/dev-server.ts`
- Modify: `packages/editor/src/store/editor-store.ts`

- [ ] **Step 1: Add fileWatcherActive state to editor store**

In `packages/editor/src/store/editor-store.ts`, add `fileWatcherActive: boolean` to `EditorStoreState` and `setFileWatcherActive` to `EditorStoreActions`:

Add to `EditorStoreState` interface (after `vscodePort: number;`):

```typescript
  fileWatcherActive: boolean;
```

Add to `EditorStoreActions` interface (after `setSnackConnected`):

```typescript
  setFileWatcherActive: (active: boolean) => void;
```

Add to the store creation (after `vscodePort: 3100,`):

```typescript
  fileWatcherActive: false,
```

Add to the actions (after `setSnackConnected`):

```typescript
  setFileWatcherActive: (active) => set({ fileWatcherActive: active }),
```

- [ ] **Step 2: Update dev-server.ts to start file watcher**

Replace the entire content of `packages/editor/server/dev-server.ts` with:

```typescript
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'vite';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { FileWatcher } from '../src/services/file-watcher';

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
      // SnackBridge sync happens on the client side via WebSocket or SSE.
      // The dev server logs file changes; the client polls or receives events.
    } catch (err: any) {
      console.error(`[watcher] Error reading ${event.path}: ${err.message}`);
    }
  });

  await fileWatcher.start(projectPath);
  console.log(`[appkit] File watcher active for ${projectPath}`);
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
```

- [ ] **Step 3: Add editor store test for fileWatcherActive**

Add to `packages/editor/src/store/__tests__/editor-store.test.ts`, after the last `it(...)` block:

```typescript
  it('sets file watcher active', () => {
    useEditorStore.getState().setFileWatcherActive(true);
    expect(useEditorStore.getState().fileWatcherActive).toBe(true);
  });
```

- [ ] **Step 4: Run all editor tests**

Run: `cd /tmp/appkit-clean && npx vitest run packages/editor/src 2>&1 | tail -10`
Expected: All tests PASS (editor-store: 7, project-manager: 4, file-watcher: 6)

- [ ] **Step 5: Commit**

```bash
git add packages/editor/src/store/editor-store.ts packages/editor/src/store/__tests__/editor-store.test.ts packages/editor/server/dev-server.ts
git commit -m "feat: wire file watcher to dev server and add fileWatcherActive state"
```

---

### Task 3: Create client-side file watcher → Snack sync hook

**Files:**
- Create: `packages/editor/src/services/file-sync.ts`

The file watcher runs server-side (Node). The client (browser) needs to know about changes to sync them to the Snack iframe. This service creates an EventSource/polling bridge. For MVP, we use a simple approach: the file watcher sends events via Vite's WebSocket HMR custom events.

- [ ] **Step 1: Create file-sync.ts**

Create `packages/editor/src/services/file-sync.ts`:

```typescript
import { snackBridge } from './snack-bridge';

let cleanup: (() => void) | null = null;

export function startSnackSync(): void {
  if (cleanup) return;

  // Listen for custom HMR events from the dev server
  // Vite's import.meta.hot allows custom event channels
  if (import.meta.hot) {
    import.meta.hot.on('appkit:file-change', (data: { path: string; content: string }) => {
      snackBridge.updateSingleFile(data.path, data.content);
    });

    cleanup = () => {
      // Vite HMR cleanup is automatic on module dispose
    };
  }
}

export function stopSnackSync(): void {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/src/services/file-sync.ts
git commit -m "feat: add client-side file-sync service bridging HMR events to Snack"
```

---

### Task 4: Build the Design→Code serializer

**Files:**
- Create: `packages/editor/src/services/__tests__/schema-sync.test.ts`
- Create: `packages/editor/src/services/schema-sync.ts`

This service takes an `AppLayout` from the builder's store and writes real Expo files to the project directory on disk, reusing `@appkit/export`'s `generateExpoProject()`.

- [ ] **Step 1: Write the failing tests**

Create `packages/editor/src/services/__tests__/schema-sync.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeDesignToProject } from '../schema-sync';
import { createDefaultLayout } from '@appkit/schema';
import { existsSync, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('schema-sync', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = join(tmpdir(), `schema-sync-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('writes Expo project files to disk from AppLayout', () => {
    const layout = createDefaultLayout();
    const fileCount = writeDesignToProject(layout, tempDir);

    expect(fileCount).toBeGreaterThan(0);
    expect(existsSync(join(tempDir, 'package.json'))).toBe(true);
    expect(existsSync(join(tempDir, 'App.tsx'))).toBe(true);
    expect(existsSync(join(tempDir, 'src', 'data', 'layout.json'))).toBe(true);
  });

  it('writes layout.json that matches the input layout', () => {
    const layout = createDefaultLayout();
    writeDesignToProject(layout, tempDir);

    const written = JSON.parse(readFileSync(join(tempDir, 'src', 'data', 'layout.json'), 'utf-8'));
    expect(written.metadata.name).toBe(layout.metadata.name);
    expect(Object.keys(written.pages)).toEqual(Object.keys(layout.pages));
  });

  it('creates nested directories as needed', () => {
    const layout = createDefaultLayout();
    writeDesignToProject(layout, tempDir);

    expect(existsSync(join(tempDir, 'src', 'sections'))).toBe(true);
    expect(existsSync(join(tempDir, 'src', 'navigation'))).toBe(true);
    expect(existsSync(join(tempDir, 'src', 'screens'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /tmp/appkit-clean && npx vitest run packages/editor/src/services/__tests__/schema-sync.test.ts 2>&1 | tail -10`
Expected: FAIL — `writeDesignToProject` does not exist

- [ ] **Step 3: Implement schema-sync.ts**

Create `packages/editor/src/services/schema-sync.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /tmp/appkit-clean && npx vitest run packages/editor/src/services/__tests__/schema-sync.test.ts 2>&1 | tail -10`
Expected: All 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add packages/editor/src/services/schema-sync.ts packages/editor/src/services/__tests__/schema-sync.test.ts
git commit -m "feat: add Design-to-Code serializer using generateExpoProject"
```

---

### Task 5: Build the DesignModeWrapper component

**Files:**
- Create: `packages/editor/src/components/DesignModeWrapper.tsx`

The wrapper imports the builder's App component and renders it. The builder is a standalone Vite+React app — its `App` component uses its own Zustand store (`useAppkitStore`) and renders the full visual builder UI (WidgetTree, SectionCanvas, PropertiesPanel, etc.).

The wrapper's job:
1. Render `@appkit/builder`'s default export (`App`)
2. Provide a "Sync to Code" button that serializes the builder's current state to Expo files

- [ ] **Step 1: Create DesignModeWrapper.tsx**

Create `packages/editor/src/components/DesignModeWrapper.tsx`:

```tsx
import React, { useCallback, useState } from 'react';
import BuilderApp from '@appkit/builder/src/App';
import { useAppkitStore } from '@appkit/builder/src/store/appkit-store';
import { useEditorStore } from '../store/editor-store';
import { writeDesignToProject } from '../services/schema-sync';
import { ArrowRightLeft } from 'lucide-react';

export function DesignModeWrapper() {
  const currentProject = useEditorStore((s) => s.currentProject);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleSyncToCode = useCallback(() => {
    if (!currentProject) return;

    setSyncing(true);
    try {
      const layout = useAppkitStore.getState().project;
      const fileCount = writeDesignToProject(layout, currentProject.path);
      setLastSync(`Synced ${fileCount} files`);
    } catch (err: any) {
      setLastSync(`Error: ${err.message}`);
    }
    setSyncing(false);
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center text-ide-text-dim">
        <p className="text-sm">Create or open a project to use Design mode</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-8 bg-ide-toolbar border-b border-ide-border flex items-center justify-between px-3 shrink-0">
        <span className="text-[10px] text-ide-text">
          Design Mode — {currentProject.name}
        </span>
        <div className="flex items-center gap-2">
          {lastSync && (
            <span className="text-[9px] text-ide-text-dim">{lastSync}</span>
          )}
          <button
            onClick={handleSyncToCode}
            disabled={syncing}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-ide-text-bright bg-ide-surface hover:bg-ide-hover rounded transition-colors disabled:opacity-50"
          >
            <ArrowRightLeft size={10} />
            {syncing ? 'Syncing...' : 'Sync to Code'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <BuilderApp />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/src/components/DesignModeWrapper.tsx
git commit -m "feat: add DesignModeWrapper that embeds builder with sync-to-code"
```

---

### Task 6: Integrate DesignModeWrapper into App shell

**Files:**
- Modify: `packages/editor/src/App.tsx`

- [ ] **Step 1: Replace the design mode placeholder**

Replace the entire content of `packages/editor/src/App.tsx` with:

```tsx
import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Toolbar } from './components/Toolbar';
import { VSCodePane } from './components/VSCodePane';
import { PreviewPane } from './components/PreviewPane';
import { AiChatSidebar } from './components/AiChatSidebar';
import { StatusBar } from './components/StatusBar';
import { DesignModeWrapper } from './components/DesignModeWrapper';
import { useEditorStore } from './store/editor-store';

export default function App() {
  const mode = useEditorStore((s) => s.mode);
  const aiSidebarOpen = useEditorStore((s) => s.aiSidebarOpen);

  return (
    <div className="h-screen flex flex-col bg-ide-bg select-none">
      <Toolbar />

      <div className="flex-1 overflow-hidden">
        <div className="h-full" style={{ display: mode === 'design' ? 'block' : 'none' }}>
          <DesignModeWrapper />
        </div>

        <div className="h-full" style={{ display: mode === 'code' ? 'block' : 'none' }}>
          <Allotment>
            <Allotment.Pane minSize={300} preferredSize="55%">
              <VSCodePane />
            </Allotment.Pane>

            <Allotment.Pane minSize={250}>
              <PreviewPane />
            </Allotment.Pane>

            {aiSidebarOpen && (
              <Allotment.Pane minSize={250} preferredSize={300} maxSize={400}>
                <AiChatSidebar />
              </Allotment.Pane>
            )}
          </Allotment>
        </div>
      </div>

      <StatusBar />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/src/App.tsx
git commit -m "feat: integrate DesignModeWrapper into App shell replacing placeholder"
```

---

### Task 7: Build and verify everything

**Files:** None (verification only)

- [ ] **Step 1: Install dependencies**

Run: `cd /tmp/appkit-clean && pnpm install`

- [ ] **Step 2: Run all tests**

Run: `cd /tmp/appkit-clean && npx turbo run test 2>&1 | tail -30`
Expected: All test suites pass. New tests: file-watcher (6), schema-sync (3), editor-store (7 — was 6 + 1 new).

- [ ] **Step 3: Build the editor package**

Run: `cd /tmp/appkit-clean && npx turbo run build --filter=@appkit/editor 2>&1 | tail -10`
Expected: Build succeeds.

Note: The `DesignModeWrapper` imports from `@appkit/builder/src/App` — this is a source-level import that Vite resolves during dev and build. If the TypeScript compiler rejects this because `@appkit/builder` has no `exports` field, add to `packages/editor/vite.config.ts`:

```typescript
resolve: {
  alias: {
    '@appkit/builder/src': resolve(__dirname, '../builder/src'),
  },
},
```

And to `packages/editor/tsconfig.json` compilerOptions:

```json
"paths": {
  "@appkit/builder/src/*": ["../builder/src/*"]
}
```

- [ ] **Step 4: Verify TypeScript**

Run: `cd /tmp/appkit-clean && npx turbo run typecheck 2>&1 | tail -20`
Expected: No type errors.

- [ ] **Step 5: Fix any issues found**

If build/test failures, fix and re-run.

- [ ] **Step 6: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: fix build/test issues for file-watcher and design mode integration"
```
