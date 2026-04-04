export interface SnackFile {
  contents: string;
  type: 'CODE' | 'ASSET';
}

export type SnackFiles = Record<string, SnackFile>;

export class SnackBridge {
  private iframe: HTMLIFrameElement | null = null;
  private origin = 'https://snack.expo.dev';

  attach(iframe: HTMLIFrameElement): void {
    this.iframe = iframe;
  }

  detach(): void {
    this.iframe = null;
  }

  updateFiles(files: SnackFiles): void {
    if (!this.iframe?.contentWindow) return;

    this.iframe.contentWindow.postMessage(
      { type: 'snack/updateFiles', files },
      this.origin,
    );
  }

  updateSingleFile(path: string, contents: string): void {
    this.updateFiles({
      [path]: { contents, type: 'CODE' },
    });
  }
}

export const snackBridge = new SnackBridge();
