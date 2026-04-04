import { describe, it, expect, beforeEach } from 'vitest';
import { useAppkitStore } from '../appkit-store';

describe('appkit store', () => {
  beforeEach(() => {
    useAppkitStore.setState(useAppkitStore.getInitialState());
  });

  it('starts with default layout', () => {
    const state = useAppkitStore.getState();
    expect(state.project.pages.home.sections).toEqual([]);
    expect(state.project.pages.home.label).toBe('Home');
    expect(state.currentPage).toBe('home');
    expect(state.selectedSectionId).toBeNull();
  });

  it('adds a section', () => {
    const { addSection } = useAppkitStore.getState();
    addSection('header');
    const state = useAppkitStore.getState();
    expect(state.project.pages.home.sections).toHaveLength(1);
    expect(state.project.pages.home.sections[0].type).toBe('header');
    expect(state.project.pages.home.sections[0].id).toBeDefined();
  });

  it('adds a section at specific index', () => {
    const store = useAppkitStore.getState();
    store.addSection('header');
    store.addSection('banner');
    store.addSection('hero', 1);
    const state = useAppkitStore.getState();
    expect(state.project.pages.home.sections[0].type).toBe('header');
    expect(state.project.pages.home.sections[1].type).toBe('hero');
    expect(state.project.pages.home.sections[2].type).toBe('banner');
  });

  it('removes a section', () => {
    const store = useAppkitStore.getState();
    store.addSection('header');
    const id = useAppkitStore.getState().project.pages.home.sections[0].id;
    store.removeSection(id);
    expect(useAppkitStore.getState().project.pages.home.sections).toHaveLength(0);
  });

  it('updates a section config', () => {
    const store = useAppkitStore.getState();
    store.addSection('header');
    const id = useAppkitStore.getState().project.pages.home.sections[0].id;
    store.updateSection(id, { text: 'New Arrivals' });
    const section = useAppkitStore.getState().project.pages.home.sections[0];
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
    expect(useAppkitStore.getState().project.pages.home.sections).toHaveLength(1);
    store.undo();
    expect(useAppkitStore.getState().project.pages.home.sections).toHaveLength(0);
    store.redo();
    expect(useAppkitStore.getState().project.pages.home.sections).toHaveLength(1);
  });

  it('adds and removes custom pages', () => {
    const store = useAppkitStore.getState();
    store.addPage('About Us', 'about-us', 'stack', '📖');
    const state = useAppkitStore.getState();
    expect(state.project.pages['about-us']).toBeDefined();
    expect(state.project.pages['about-us'].label).toBe('About Us');
    expect(state.project.pages['about-us'].isCore).toBe(false);
    expect(state.currentPage).toBe('about-us');

    store.removePage('about-us');
    expect(useAppkitStore.getState().project.pages['about-us']).toBeUndefined();
    expect(useAppkitStore.getState().currentPage).toBe('home');
  });

  it('cannot remove core pages', () => {
    const store = useAppkitStore.getState();
    store.removePage('home');
    expect(useAppkitStore.getState().project.pages.home).toBeDefined();
  });

  it('manages section groups', () => {
    const store = useAppkitStore.getState();
    store.addGroup('Above Fold');
    const state = useAppkitStore.getState();
    const groups = state.project.pages.home.groups!;
    expect(groups).toHaveLength(1);
    expect(groups[0].name).toBe('Above Fold');

    store.addSection('header');
    const sectionId = useAppkitStore.getState().project.pages.home.sections[0].id;
    store.addSectionToGroup(groups[0].id, sectionId);
    expect(useAppkitStore.getState().project.pages.home.groups![0].sectionIds).toContain(sectionId);

    store.removeSectionFromGroup(groups[0].id, sectionId);
    expect(useAppkitStore.getState().project.pages.home.groups![0].sectionIds).toHaveLength(0);
  });

  it('saves and activates themes', () => {
    const store = useAppkitStore.getState();
    store.saveTheme('My Theme');
    const state = useAppkitStore.getState();
    expect(state.project.themes).toHaveLength(1);
    expect(state.project.themes![0].name).toBe('My Theme');
    expect(state.project.activeThemeId).toBe(state.project.themes![0].id);
  });

  it('updates custom style on sections', () => {
    const store = useAppkitStore.getState();
    store.addSection('header');
    const id = useAppkitStore.getState().project.pages.home.sections[0].id;
    store.updateSectionCustomStyle(id, { backgroundColor: '#000' });
    const section = useAppkitStore.getState().project.pages.home.sections[0];
    expect(section.customStyle).toEqual({ backgroundColor: '#000' });
  });
});
