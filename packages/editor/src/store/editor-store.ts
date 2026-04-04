import { create } from 'zustand';

export type EditorMode = 'design' | 'code';

export interface AppkitProject {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  schemaVersion: string;
}

interface EditorStoreState {
  mode: EditorMode;
  currentProject: AppkitProject | null;
  projects: AppkitProject[];
  aiSidebarOpen: boolean;
  vscodeReady: boolean;
  snackConnected: boolean;
  vscodePort: number;
}

interface EditorStoreActions {
  setMode: (mode: EditorMode) => void;
  toggleAiSidebar: () => void;
  setCurrentProject: (project: AppkitProject | null) => void;
  setProjects: (projects: AppkitProject[]) => void;
  setVSCodeReady: (ready: boolean) => void;
  setSnackConnected: (connected: boolean) => void;
}

export const useEditorStore = create<EditorStoreState & EditorStoreActions>()((set) => ({
  mode: 'code',
  currentProject: null,
  projects: [],
  aiSidebarOpen: false,
  vscodeReady: false,
  snackConnected: false,
  vscodePort: 3100,

  setMode: (mode) => set({ mode }),
  toggleAiSidebar: () => set((s) => ({ aiSidebarOpen: !s.aiSidebarOpen })),
  setCurrentProject: (project) => set({ currentProject: project }),
  setProjects: (projects) => set({ projects }),
  setVSCodeReady: (ready) => set({ vscodeReady: ready }),
  setSnackConnected: (connected) => set({ snackConnected: connected }),
}));
