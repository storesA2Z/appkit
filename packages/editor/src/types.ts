export type EditorMode = 'design' | 'code';

export interface AppkitProject {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  schemaVersion: string;
}

export interface EditorState {
  mode: EditorMode;
  currentProject: AppkitProject | null;
  projects: AppkitProject[];
  aiSidebarOpen: boolean;
  vscodePort: number;
  snackConnected: boolean;
}

export interface FileChangeEvent {
  path: string;
  type: 'add' | 'change' | 'unlink';
}
