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
      ignored: (filePath: string) => {
        const parts = filePath.split('/');
        return parts.some(
          (p) => p === 'node_modules' || p === 'dist' || p === '.git' || (p.startsWith('.') && p !== '.')
        );
      },
      ignoreInitial: true,
      persistent: true,
    });

    this.watcher.on('add', (absPath) => this.emit(absPath, 'add'));
    this.watcher.on('change', (absPath) => this.emit(absPath, 'change'));
    this.watcher.on('unlink', (absPath) => this.emit(absPath, 'unlink'));

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
