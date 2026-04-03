import type { ToolCall } from './claude-client';
import type { AppLayout, SectionType, PageType } from '@appkit/schema';

export interface StoreActions {
  addSection: (type: SectionType, index?: number) => void;
  updateSection: (id: string, changes: Record<string, any>) => void;
  removeSection: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  setTheme: (theme: Partial<AppLayout['theme']>) => void;
  setMetadata: (meta: Partial<AppLayout['metadata']>) => void;
  setPage: (page: PageType) => void;
  getState: () => { project: AppLayout; currentPage: PageType };
}

export function executeToolCall(
  toolCall: ToolCall,
  actions: StoreActions,
): { result: string; success: boolean } {
  try {
    const { name, input } = toolCall;

    switch (name) {
      case 'get_current_state': {
        const state = actions.getState();
        const page = input.page || state.currentPage;
        return {
          result: JSON.stringify({
            currentPage: state.currentPage,
            sections: state.project.pages[page as PageType],
            theme: state.project.theme,
            metadata: state.project.metadata,
          }),
          success: true,
        };
      }

      case 'list_section_types': {
        return {
          result: JSON.stringify([
            'banner', 'categories', 'products', 'collections',
            'header', 'video', 'flash_sale', 'reviews',
            'offer', 'hero', 'tabs', 'marquee',
          ]),
          success: true,
        };
      }

      case 'add_section': {
        if (input.page) actions.setPage(input.page);
        actions.addSection(input.type, input.position);
        if (input.config) {
          const state = actions.getState();
          const page = (input.page || state.currentPage) as PageType;
          const sections = state.project.pages[page];
          const added = sections[sections.length - 1];
          if (added) {
            actions.updateSection(added.id, input.config);
          }
        }
        return { result: `Added ${input.type} section`, success: true };
      }

      case 'update_section': {
        actions.updateSection(input.sectionId, input.changes);
        return { result: `Updated section ${input.sectionId}`, success: true };
      }

      case 'remove_section': {
        actions.removeSection(input.sectionId);
        return { result: `Removed section ${input.sectionId}`, success: true };
      }

      case 'set_theme': {
        actions.setTheme(input);
        return { result: 'Theme updated', success: true };
      }

      case 'set_metadata': {
        actions.setMetadata(input);
        return { result: 'Metadata updated', success: true };
      }

      default:
        return { result: `Unknown tool: ${name}`, success: false };
    }
  } catch (error) {
    return { result: `Error: ${error}`, success: false };
  }
}
