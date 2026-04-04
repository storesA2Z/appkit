import { create } from 'zustand';
import type { EditorMode, AppkitProject } from '../types';
export type { EditorMode, AppkitProject };

interface EditorStoreState {
  mode: EditorMode;
  currentProject: AppkitProject | null;
  projects: AppkitProject[];
  aiSidebarOpen: boolean;
  vscodeReady: boolean;
  snackConnected: boolean;
  vscodePort: number;
  fileWatcherActive: boolean;
}

interface EditorStoreActions {
  setMode: (mode: EditorMode) => void;
  toggleAiSidebar: () => void;
  setCurrentProject: (project: AppkitProject | null) => void;
  setProjects: (projects: AppkitProject[]) => void;
  setVSCodeReady: (ready: boolean) => void;
  setSnackConnected: (connected: boolean) => void;
  setFileWatcherActive: (active: boolean) => void;
}

export const useEditorStore = create<EditorStoreState & EditorStoreActions>()((set) => ({
  mode: 'code',
  currentProject: null,
  projects: [],
  aiSidebarOpen: false,
  vscodeReady: false,
  snackConnected: false,
  vscodePort: 3100,
  fileWatcherActive: false,

  setMode: (mode) => set({ mode }),
  toggleAiSidebar: () => set((s) => ({ aiSidebarOpen: !s.aiSidebarOpen })),
  setCurrentProject: (project) => set({ currentProject: project }),
  setProjects: (projects) => set({ projects }),
  setVSCodeReady: (ready) => set({ vscodeReady: ready }),
  setSnackConnected: (connected) => set({ snackConnected: connected }),
  setFileWatcherActive: (active) => set({ fileWatcherActive: active }),
}));
