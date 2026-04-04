import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  type AppLayout,
  type SectionType,
  type Section,
  type ProjectSummary,
  type NavType,
  type ThemeConfig,
  type SavedTheme,
  createDefaultLayout,
  migrateLayout,
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
    case 'custom': return { type: 'custom', customConfig: { componentName: '', props: {} } };
  }
}

export interface BackendConfig {
  mode: 'demo' | 'api';
  baseUrl: string;
  endpoints: {
    products: string;
    categories: string;
    collections: string;
  };
  auth: {
    type: 'none' | 'bearer' | 'apikey';
    headerName: string;
    token: string;
  };
}

function createDefaultBackendConfig(): BackendConfig {
  return {
    mode: 'demo',
    baseUrl: '',
    endpoints: { products: '/api/products', categories: '/api/categories', collections: '/api/collections' },
    auth: { type: 'none', headerName: 'Authorization', token: '' },
  };
}

interface AppkitState {
  projects: ProjectSummary[];
  currentProjectId: string | null;
  project: AppLayout;
  backendConfig: BackendConfig;
  currentPage: string;
  selectedSectionId: string | null;
  history: AppLayout[];
  historyIndex: number;
  showProjectSwitcher: boolean;

  // Section actions
  addSection: (type: SectionType, index?: number) => void;
  updateSection: (id: string, configChanges: Record<string, any>) => void;
  updateSectionSpacing: (id: string, spacing: Record<string, any>) => void;
  updateSectionStyling: (id: string, styling: Record<string, any>) => void;
  updateSectionCustomStyle: (id: string, customStyle: Record<string, any>) => void;
  removeSection: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;

  // Page actions
  setPage: (page: string) => void;
  addPage: (label: string, slug: string, navType: NavType, icon?: string) => void;
  removePage: (slug: string) => void;
  renamePage: (slug: string, label: string) => void;
  setPageNavType: (slug: string, navType: NavType) => void;

  // Section group actions
  addGroup: (name: string) => void;
  removeGroup: (groupId: string) => void;
  renameGroup: (groupId: string, name: string) => void;
  addSectionToGroup: (groupId: string, sectionId: string) => void;
  removeSectionFromGroup: (groupId: string, sectionId: string) => void;
  toggleGroupCollapse: (groupId: string) => void;

  // Theme library actions
  saveTheme: (name: string) => void;
  deleteTheme: (themeId: string) => void;
  setActiveTheme: (themeId: string) => void;
  addVariant: (themeId: string, name: string, overrides: Partial<ThemeConfig>) => void;
  removeVariant: (themeId: string, variantId: string) => void;
  setActiveVariant: (variantId: string | null) => void;

  // Other
  selectSection: (id: string | null) => void;
  setTheme: (theme: Partial<AppLayout['theme']>) => void;
  setThemeColors: (colors: Partial<AppLayout['theme']['colors']>) => void;
  setThemeTypography: (typo: Partial<AppLayout['theme']['typography']>) => void;
  setThemeLayout: (layout: Partial<AppLayout['theme']['layout']>) => void;
  setMetadata: (meta: Partial<AppLayout['metadata']>) => void;
  setBackendConfig: (config: Partial<BackendConfig>) => void;
  setProject: (layout: AppLayout) => void;
  undo: () => void;
  redo: () => void;
  saveProject: () => void;
  loadProject: (id: string) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  createProject: (name: string, storeType?: string) => void;
  openProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
  setShowProjectSwitcher: (show: boolean) => void;
}

function pushHistory(state: AppkitState): Partial<AppkitState> {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(structuredClone(state.project));
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

/** Helper to update sections on the current page */
function updatePageSections(
  state: AppkitState,
  updater: (sections: Section[]) => Section[],
): { project: AppLayout } & Partial<AppkitState> {
  const page = state.currentPage;
  const pageConfig = state.project.pages[page];
  const sections = updater(pageConfig.sections);
  const newProject = {
    ...state.project,
    pages: { ...state.project.pages, [page]: { ...pageConfig, sections } },
  };
  return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
}

const initialProject = createDefaultLayout();

export const useAppkitStore = create<AppkitState>()((set, get) => ({
  projects: [],
  currentProjectId: null,
  project: initialProject,
  backendConfig: createDefaultBackendConfig(),
  currentPage: 'home',
  selectedSectionId: null,
  history: [structuredClone(initialProject)],
  historyIndex: 0,
  showProjectSwitcher: true,

  // === Section actions ===

  addSection: (type, index) => {
    set((state) => {
      const section: Section = {
        id: nanoid(10),
        type,
        config: createDefaultSectionConfig(type),
      };
      const page = state.currentPage;
      const pageConfig = state.project.pages[page];
      const sections = [...pageConfig.sections];
      if (index !== undefined) {
        sections.splice(index, 0, section);
      } else {
        sections.push(section);
      }
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: { ...pageConfig, sections } },
      };
      return {
        project: newProject,
        selectedSectionId: section.id,
        ...pushHistory({ ...state, project: newProject }),
      };
    });
  },

  updateSection: (id, configChanges) => {
    set((state) => updatePageSections(state, (sections) =>
      sections.map((s) => s.id !== id ? s : { ...s, config: { ...s.config, ...configChanges } })
    ));
  },

  updateSectionSpacing: (id, spacing) => {
    set((state) => updatePageSections(state, (sections) =>
      sections.map((s) => s.id !== id ? s : { ...s, spacing: { ...s.spacing, ...spacing } })
    ));
  },

  updateSectionStyling: (id, styling) => {
    set((state) => updatePageSections(state, (sections) =>
      sections.map((s) => s.id !== id ? s : { ...s, styling: { ...s.styling, ...styling } })
    ));
  },

  updateSectionCustomStyle: (id, customStyle) => {
    set((state) => updatePageSections(state, (sections) =>
      sections.map((s) => s.id !== id ? s : { ...s, customStyle: { ...s.customStyle, ...customStyle } })
    ));
  },

  removeSection: (id) => {
    set((state) => ({
      ...updatePageSections(state, (sections) => sections.filter((s) => s.id !== id)),
      selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
    }));
  },

  reorderSections: (activeId, overId) => {
    set((state) => {
      const page = state.currentPage;
      const pageConfig = state.project.pages[page];
      const sections = [...pageConfig.sections];
      const oldIndex = sections.findIndex((s) => s.id === activeId);
      const newIndex = sections.findIndex((s) => s.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;
      const [moved] = sections.splice(oldIndex, 1);
      sections.splice(newIndex, 0, moved);
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: { ...pageConfig, sections } },
      };
      return {
        project: newProject,
        ...pushHistory({ ...state, project: newProject }),
      };
    });
  },

  // === Page actions ===

  setPage: (page) => set({ currentPage: page, selectedSectionId: null }),

  addPage: (label, slug, navType, icon) => {
    set((state) => {
      const newProject = {
        ...state.project,
        pages: {
          ...state.project.pages,
          [slug]: { label, slug, icon, isCore: false, navType, sections: [] },
        },
      };
      return {
        project: newProject,
        currentPage: slug,
        ...pushHistory({ ...state, project: newProject }),
      };
    });
  },

  removePage: (slug) => {
    set((state) => {
      const page = state.project.pages[slug];
      if (!page || page.isCore) return state;
      const { [slug]: _, ...rest } = state.project.pages;
      const newProject = { ...state.project, pages: rest };
      return {
        project: newProject,
        currentPage: state.currentPage === slug ? 'home' : state.currentPage,
        ...pushHistory({ ...state, project: newProject }),
      };
    });
  },

  renamePage: (slug, label) => {
    set((state) => {
      const page = state.project.pages[slug];
      if (!page) return state;
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [slug]: { ...page, label } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  setPageNavType: (slug, navType) => {
    set((state) => {
      const page = state.project.pages[slug];
      if (!page) return state;
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [slug]: { ...page, navType } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  // === Section group actions ===

  addGroup: (name) => {
    set((state) => {
      const page = state.currentPage;
      const pageConfig = state.project.pages[page];
      const groups = [...(pageConfig.groups ?? []), { id: nanoid(10), name, sectionIds: [], collapsed: false }];
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: { ...pageConfig, groups } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  removeGroup: (groupId) => {
    set((state) => {
      const page = state.currentPage;
      const pageConfig = state.project.pages[page];
      const groups = (pageConfig.groups ?? []).filter((g) => g.id !== groupId);
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: { ...pageConfig, groups } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  renameGroup: (groupId, name) => {
    set((state) => {
      const page = state.currentPage;
      const pageConfig = state.project.pages[page];
      const groups = (pageConfig.groups ?? []).map((g) =>
        g.id === groupId ? { ...g, name } : g
      );
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: { ...pageConfig, groups } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  addSectionToGroup: (groupId, sectionId) => {
    set((state) => {
      const page = state.currentPage;
      const pageConfig = state.project.pages[page];
      const groups = (pageConfig.groups ?? []).map((g) =>
        g.id === groupId ? { ...g, sectionIds: [...g.sectionIds, sectionId] } : g
      );
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: { ...pageConfig, groups } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  removeSectionFromGroup: (groupId, sectionId) => {
    set((state) => {
      const page = state.currentPage;
      const pageConfig = state.project.pages[page];
      const groups = (pageConfig.groups ?? []).map((g) =>
        g.id === groupId ? { ...g, sectionIds: g.sectionIds.filter((id) => id !== sectionId) } : g
      );
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: { ...pageConfig, groups } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  toggleGroupCollapse: (groupId) => {
    set((state) => {
      const page = state.currentPage;
      const pageConfig = state.project.pages[page];
      const groups = (pageConfig.groups ?? []).map((g) =>
        g.id === groupId ? { ...g, collapsed: !g.collapsed } : g
      );
      const newProject = {
        ...state.project,
        pages: { ...state.project.pages, [page]: { ...pageConfig, groups } },
      };
      return { project: newProject };
    });
  },

  // === Theme library actions ===

  saveTheme: (name) => {
    set((state) => {
      const theme: SavedTheme = {
        id: nanoid(10),
        name,
        base: structuredClone(state.project.theme),
        variants: [],
        createdAt: new Date().toISOString(),
      };
      const themes = [...(state.project.themes ?? []), theme];
      const newProject = { ...state.project, themes, activeThemeId: theme.id };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  deleteTheme: (themeId) => {
    set((state) => {
      const themes = (state.project.themes ?? []).filter((t) => t.id !== themeId);
      const activeThemeId = state.project.activeThemeId === themeId ? '' : state.project.activeThemeId;
      const newProject = { ...state.project, themes, activeThemeId };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  setActiveTheme: (themeId) => {
    set((state) => {
      const theme = (state.project.themes ?? []).find((t) => t.id === themeId);
      if (!theme) return state;
      const newProject = {
        ...state.project,
        theme: structuredClone(theme.base),
        activeThemeId: themeId,
        activeVariantId: undefined,
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  addVariant: (themeId, name, overrides) => {
    set((state) => {
      const themes = (state.project.themes ?? []).map((t) => {
        if (t.id !== themeId) return t;
        return { ...t, variants: [...t.variants, { id: nanoid(10), name, overrides }] };
      });
      const newProject = { ...state.project, themes };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  removeVariant: (themeId, variantId) => {
    set((state) => {
      const themes = (state.project.themes ?? []).map((t) => {
        if (t.id !== themeId) return t;
        return { ...t, variants: t.variants.filter((v) => v.id !== variantId) };
      });
      const activeVariantId = state.project.activeVariantId === variantId ? undefined : state.project.activeVariantId;
      const newProject = { ...state.project, themes, activeVariantId };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  setActiveVariant: (variantId) => {
    set((state) => {
      if (!variantId) {
        // Remove variant, revert to base theme
        const theme = (state.project.themes ?? []).find((t) => t.id === state.project.activeThemeId);
        if (!theme) return state;
        const newProject = { ...state.project, theme: structuredClone(theme.base), activeVariantId: undefined };
        return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
      }
      const activeTheme = (state.project.themes ?? []).find((t) => t.id === state.project.activeThemeId);
      if (!activeTheme) return state;
      const variant = activeTheme.variants.find((v) => v.id === variantId);
      if (!variant) return state;
      const mergedTheme: ThemeConfig = {
        ...structuredClone(activeTheme.base),
        colors: { ...activeTheme.base.colors, ...variant.overrides.colors },
        typography: { ...activeTheme.base.typography, ...variant.overrides.typography },
        layout: { ...activeTheme.base.layout, ...variant.overrides.layout },
      };
      const newProject = { ...state.project, theme: mergedTheme, activeVariantId: variantId };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  // === Other ===

  selectSection: (id) => set({ selectedSectionId: id }),

  setTheme: (theme) => {
    set((state) => {
      const newProject = {
        ...state.project,
        theme: { ...state.project.theme, ...theme },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  setThemeColors: (colors) => {
    set((state) => {
      const newProject = {
        ...state.project,
        theme: { ...state.project.theme, colors: { ...state.project.theme.colors, ...colors } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  setThemeTypography: (typo) => {
    set((state) => {
      const newProject = {
        ...state.project,
        theme: { ...state.project.theme, typography: { ...state.project.theme.typography, ...typo } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  setThemeLayout: (layout) => {
    set((state) => {
      const newProject = {
        ...state.project,
        theme: { ...state.project.theme, layout: { ...state.project.theme.layout, ...layout } },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  setMetadata: (meta) => {
    set((state) => {
      const newProject = {
        ...state.project,
        metadata: { ...state.project.metadata, ...meta },
      };
      return { project: newProject, ...pushHistory({ ...state, project: newProject }) };
    });
  },

  setBackendConfig: (config) => {
    set((state) => ({
      backendConfig: { ...state.backendConfig, ...config },
    }));
  },

  setProject: (layout) => set({ project: migrateLayout(layout) }),

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

  saveProject: () => {
    const { project, currentProjectId, backendConfig } = get();
    if (!currentProjectId) return;
    localStorage.setItem(`appkit:project:${currentProjectId}`, JSON.stringify(project));
    localStorage.setItem(`appkit:backend:${currentProjectId}`, JSON.stringify(backendConfig));
    const projects = get().projects.map((p) =>
      p.id === currentProjectId ? { ...p, updatedAt: new Date().toISOString() } : p
    );
    set({ projects });
    localStorage.setItem('appkit:projects', JSON.stringify(projects));
  },

  loadProject: (id) => {
    try {
      const stored = localStorage.getItem(`appkit:project:${id}`);
      if (stored) {
        const raw = JSON.parse(stored);
        const project = migrateLayout(raw);
        set({ project, history: [structuredClone(project)], historyIndex: 0 });
      }
      const backendStored = localStorage.getItem(`appkit:backend:${id}`);
      if (backendStored) {
        set({ backendConfig: JSON.parse(backendStored) });
      } else {
        set({ backendConfig: createDefaultBackendConfig() });
      }
    } catch {}
  },

  saveToLocalStorage: () => {
    get().saveProject();
  },

  loadFromLocalStorage: () => {
    try {
      const storedProjects = localStorage.getItem('appkit:projects');
      if (storedProjects) {
        const projects = JSON.parse(storedProjects) as ProjectSummary[];
        set({ projects });
        if (projects.length > 0) {
          const lastId = localStorage.getItem('appkit:currentProjectId');
          const targetId = lastId && projects.find((p) => p.id === lastId) ? lastId : projects[0].id;
          set({ currentProjectId: targetId, showProjectSwitcher: false });
          get().loadProject(targetId);
        } else {
          set({ showProjectSwitcher: true });
        }
      } else {
        set({ showProjectSwitcher: true });
      }
    } catch {}
  },

  createProject: (name, storeType) => {
    const id = nanoid(10);
    const now = new Date().toISOString();
    const newLayout = createDefaultLayout();
    newLayout.metadata.name = name;

    set((state) => ({
      projects: [...state.projects, { id, name, storeType, createdAt: now, updatedAt: now }],
      currentProjectId: id,
      project: newLayout,
      backendConfig: createDefaultBackendConfig(),
      history: [structuredClone(newLayout)],
      historyIndex: 0,
      selectedSectionId: null,
      currentPage: 'home',
      showProjectSwitcher: false,
    }));

    localStorage.setItem(`appkit:project:${id}`, JSON.stringify(newLayout));
    localStorage.setItem('appkit:currentProjectId', id);
    const projects = get().projects;
    localStorage.setItem('appkit:projects', JSON.stringify(projects));
  },

  openProject: (id) => {
    const { saveProject } = get();
    saveProject();
    set({ currentProjectId: id, selectedSectionId: null, currentPage: 'home', showProjectSwitcher: false });
    localStorage.setItem('appkit:currentProjectId', id);
    get().loadProject(id);
  },

  duplicateProject: (id) => {
    const state = get();
    const original = state.projects.find((p) => p.id === id);
    if (!original) return;
    const newId = nanoid(10);
    const now = new Date().toISOString();

    const sourceData = localStorage.getItem(`appkit:project:${id}`);
    if (sourceData) {
      localStorage.setItem(`appkit:project:${newId}`, sourceData);
    }
    const sourceBackend = localStorage.getItem(`appkit:backend:${id}`);
    if (sourceBackend) {
      localStorage.setItem(`appkit:backend:${newId}`, sourceBackend);
    }

    const newProject = { ...original, id: newId, name: `${original.name} (copy)`, createdAt: now, updatedAt: now };
    set((s) => ({ projects: [...s.projects, newProject] }));
    localStorage.setItem('appkit:projects', JSON.stringify(get().projects));
  },

  deleteProject: (id) => {
    localStorage.removeItem(`appkit:project:${id}`);
    localStorage.removeItem(`appkit:backend:${id}`);
    set((state) => {
      const projects = state.projects.filter((p) => p.id !== id);
      localStorage.setItem('appkit:projects', JSON.stringify(projects));
      const wasActive = state.currentProjectId === id;
      return {
        projects,
        currentProjectId: wasActive ? null : state.currentProjectId,
        showProjectSwitcher: wasActive ? true : state.showProjectSwitcher,
      };
    });
  },

  setShowProjectSwitcher: (show) => set({ showProjectSwitcher: show }),
}));
