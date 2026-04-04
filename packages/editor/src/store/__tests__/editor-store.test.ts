import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../editor-store';

describe('editor store', () => {
  beforeEach(() => {
    useEditorStore.setState(useEditorStore.getInitialState());
  });

  it('starts in code mode with no project', () => {
    const state = useEditorStore.getState();
    expect(state.mode).toBe('code');
    expect(state.currentProject).toBeNull();
    expect(state.aiSidebarOpen).toBe(false);
  });

  it('switches mode', () => {
    useEditorStore.getState().setMode('design');
    expect(useEditorStore.getState().mode).toBe('design');
  });

  it('toggles AI sidebar', () => {
    useEditorStore.getState().toggleAiSidebar();
    expect(useEditorStore.getState().aiSidebarOpen).toBe(true);
    useEditorStore.getState().toggleAiSidebar();
    expect(useEditorStore.getState().aiSidebarOpen).toBe(false);
  });

  it('sets current project', () => {
    const project = { id: 'p1', name: 'Test', path: '/tmp/test', createdAt: '2026-01-01', schemaVersion: '3.0.0' };
    useEditorStore.getState().setCurrentProject(project);
    expect(useEditorStore.getState().currentProject).toEqual(project);
  });

  it('sets vscode ready', () => {
    useEditorStore.getState().setVSCodeReady(true);
    expect(useEditorStore.getState().vscodeReady).toBe(true);
  });

  it('sets snack connected', () => {
    useEditorStore.getState().setSnackConnected(true);
    expect(useEditorStore.getState().snackConnected).toBe(true);
  });
});
