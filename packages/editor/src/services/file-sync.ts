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
