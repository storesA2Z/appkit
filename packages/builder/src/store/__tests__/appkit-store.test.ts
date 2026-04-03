import { describe, it, expect, beforeEach } from 'vitest';
import { useAppkitStore } from '../appkit-store';

describe('appkit store', () => {
  beforeEach(() => {
    useAppkitStore.setState(useAppkitStore.getInitialState());
  });

  it('starts with default layout', () => {
    const state = useAppkitStore.getState();
    expect(state.project.pages.home).toEqual([]);
    expect(state.currentPage).toBe('home');
    expect(state.selectedSectionId).toBeNull();
  });

  it('adds a section', () => {
    const { addSection } = useAppkitStore.getState();
    addSection('header');
    const state = useAppkitStore.getState();
    expect(state.project.pages.home).toHaveLength(1);
    expect(state.project.pages.home[0].type).toBe('header');
    expect(state.project.pages.home[0].id).toBeDefined();
  });

  it('adds a section at specific index', () => {
    const store = useAppkitStore.getState();
    store.addSection('header');
    store.addSection('banner');
    store.addSection('hero', 1);
    const state = useAppkitStore.getState();
    expect(state.project.pages.home[0].type).toBe('header');
    expect(state.project.pages.home[1].type).toBe('hero');
    expect(state.project.pages.home[2].type).toBe('banner');
  });

  it('removes a section', () => {
    const store = useAppkitStore.getState();
    store.addSection('header');
    const id = useAppkitStore.getState().project.pages.home[0].id;
    store.removeSection(id);
    expect(useAppkitStore.getState().project.pages.home).toHaveLength(0);
  });

  it('updates a section config', () => {
    const store = useAppkitStore.getState();
    store.addSection('header');
    const id = useAppkitStore.getState().project.pages.home[0].id;
    store.updateSection(id, { text: 'New Arrivals' });
    const section = useAppkitStore.getState().project.pages.home[0];
    expect((section.config as any).text).toBe('New Arrivals');
  });

  it('switches pages', () => {
    const store = useAppkitStore.getState();
    store.setPage('explore');
    expect(useAppkitStore.getState().currentPage).toBe('explore');
  });

  it('supports undo/redo', () => {
    const store = useAppkitStore.getState();
    store.addSection('header');
    expect(useAppkitStore.getState().project.pages.home).toHaveLength(1);
    store.undo();
    expect(useAppkitStore.getState().project.pages.home).toHaveLength(0);
    store.redo();
    expect(useAppkitStore.getState().project.pages.home).toHaveLength(1);
  });
});
