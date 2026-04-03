import { useEffect } from 'react';
import { useAppkitStore } from '../store/appkit-store';

export function useKeyboardShortcuts() {
  const undo = useAppkitStore((s) => s.undo);
  const redo = useAppkitStore((s) => s.redo);
  const removeSection = useAppkitStore((s) => s.removeSection);
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCmd = e.metaKey || e.ctrlKey;

      if (isCmd && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (isCmd && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSectionId) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        removeSection(selectedSectionId);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, removeSection, selectedSectionId]);
}
