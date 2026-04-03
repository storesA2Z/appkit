import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  type AppLayout,
  type PageType,
  type SectionType,
  type Section,
  type ProjectSummary,
  createDefaultLayout,
} from '@appkit/schema';

function createDefaultSectionConfig(type: SectionType): Section['config'] {
  switch (type) {
    case 'banner': return { type: 'banner', data: [] };
    case 'categories': return { type: 'categories', collectionIds: [] };
    case 'products': return { type: 'products', collectionId: '' };
    case 'collections': return { type: 'collections', collectionIds: [] };
    case 'header': return { type: 'header', text: '' };
    case 'video': return { type: 'video', videoUrl: '' };
    case 'flash_sale': return { type: 'flash_sale', flashSaleConfig: { endDate: '' } };
    case 'reviews': return { type: 'reviews', reviewsConfig: { displayMode: 'top-rated' } };
    case 'offer': return { type: 'offer', offerConfig: {} };
    case 'hero': return { type: 'hero', heroConfig: { imageUrl: '' } };
    case 'tabs': return { type: 'tabs', tabsConfig: { tabs: [] } };
    case 'marquee': return { type: 'marquee', marqueeConfig: { items: [] } };
  }
}

interface AppkitState {
  projects: ProjectSummary[];
  currentProjectId: string | null;
  project: AppLayout;
  currentPage: PageType;
  selectedSectionId: string | null;
  history: AppLayout[];
  historyIndex: number;

  addSection: (type: SectionType, index?: number) => void;
  updateSection: (id: string, configChanges: Record<string, any>) => void;
  removeSection: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  setPage: (page: PageType) => void;
  selectSection: (id: string | null) => void;
  setTheme: (theme: Partial<AppLayout['theme']>) => void;
  setMetadata: (meta: Partial<AppLayout['metadata']>) => void;
  setProject: (layout: AppLayout) => void;
  undo: () => void;
  redo: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  createProject: (name: string, storeType?: string) => void;
  openProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
}

function pushHistory(state: AppkitState): Partial<AppkitState> {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(structuredClone(state.project));
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

const initialProject = createDefaultLayout();

export const useAppkitStore = create<AppkitState>()((set, get) => ({
  projects: [],
  currentProjectId: null,
  project: initialProject,
  currentPage: 'home',
  selectedSectionId: null,
  history: [structuredClone(initialProject)],
  historyIndex: 0,

  addSection: (type, index) => {
    set((state) => {
      const section: Section = {
        id: nanoid(10),
        type,
        config: createDefaultSectionConfig(type),
      };
      const page = state.currentPage;
      const sections = [...state.project.pages[page]];
      if (index !== undefined) {
        sections.splice(index, 0, section);
      } else {
        sections.push(section);
      }
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: sections },
      };
      return {
        project: newProject,
        selectedSectionId: section.id,
        ...pushHistory({ ...state, project: newProject }),
      };
    });
  },

  updateSection: (id, configChanges) => {
    set((state) => {
      const page = state.currentPage;
      const sections = state.project.pages[page].map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          config: { ...s.config, ...configChanges },
        };
      });
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: sections },
      };
      return {
        project: newProject,
        ...pushHistory({ ...state, project: newProject }),
      };
    });
  },

  removeSection: (id) => {
    set((state) => {
      const page = state.currentPage;
      const sections = state.project.pages[page].filter((s) => s.id !== id);
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: sections },
      };
      return {
        project: newProject,
        selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
        ...pushHistory({ ...state, project: newProject }),
      };
    });
  },

  reorderSections: (activeId, overId) => {
    set((state) => {
      const page = state.currentPage;
      const sections = [...state.project.pages[page]];
      const oldIndex = sections.findIndex((s) => s.id === activeId);
      const newIndex = sections.findIndex((s) => s.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;
      const [moved] = sections.splice(oldIndex, 1);
      sections.splice(newIndex, 0, moved);
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: sections },
      };
      return {
        project: newProject,
        ...pushHistory({ ...state, project: newProject }),
      };
    });
  },

  setPage: (page) => set({ currentPage: page, selectedSectionId: null }),
  selectSection: (id) => set({ selectedSectionId: id }),

  setTheme: (theme) => {
    set((state) => ({
      project: {
        ...state.project,
        theme: { ...state.project.theme, ...theme },
      },
    }));
  },

  setMetadata: (meta) => {
    set((state) => ({
      project: {
        ...state.project,
        metadata: { ...state.project.metadata, ...meta },
      },
    }));
  },

  setProject: (layout) => set({ project: layout }),

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        project: structuredClone(state.history[newIndex]),
        historyIndex: newIndex,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        project: structuredClone(state.history[newIndex]),
        historyIndex: newIndex,
      };
    });
  },

  saveToLocalStorage: () => {
    const { project, projects, currentProjectId } = get();
    localStorage.setItem('appkit:project', JSON.stringify(project));
    localStorage.setItem('appkit:projects', JSON.stringify(projects));
    localStorage.setItem('appkit:currentProjectId', currentProjectId || '');
  },

  loadFromLocalStorage: () => {
    try {
      const stored = localStorage.getItem('appkit:project');
      if (stored) {
        const project = JSON.parse(stored) as AppLayout;
        set({ project, history: [structuredClone(project)], historyIndex: 0 });
      }
      const storedProjects = localStorage.getItem('appkit:projects');
      if (storedProjects) {
        set({ projects: JSON.parse(storedProjects) });
      }
      const storedId = localStorage.getItem('appkit:currentProjectId');
      if (storedId) {
        set({ currentProjectId: storedId });
      }
    } catch {}
  },

  createProject: (name, storeType) => {
    const id = nanoid(10);
    const now = new Date().toISOString();
    set((state) => ({
      projects: [...state.projects, { id, name, storeType, createdAt: now, updatedAt: now }],
      currentProjectId: id,
      project: createDefaultLayout(),
      history: [createDefaultLayout()],
      historyIndex: 0,
      selectedSectionId: null,
      currentPage: 'home' as PageType,
    }));
  },

  openProject: (id) => {
    set({ currentProjectId: id, selectedSectionId: null, currentPage: 'home' });
  },

  duplicateProject: (id) => {
    const state = get();
    const original = state.projects.find((p) => p.id === id);
    if (!original) return;
    const newId = nanoid(10);
    const now = new Date().toISOString();
    set((s) => ({
      projects: [...s.projects, { ...original, id: newId, name: `${original.name} (copy)`, createdAt: now, updatedAt: now }],
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
    }));
  },
}));
