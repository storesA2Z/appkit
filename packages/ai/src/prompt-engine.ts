import { schemaPrompt, type AppLayout, type PageType } from '@appkit/schema';

export interface AiContext {
  storeType: string | null;
  brandGuidelines: string | null;
  currentLayout: AppLayout;
  currentPage: PageType;
  selectedSectionId: string | null;
}

export function buildSystemPrompt(context: AiContext): string {
  const parts = [
    schemaPrompt,
    '',
    '## Current State',
    `Current page: ${context.currentPage}`,
    `Sections on current page: ${context.currentLayout.pages[context.currentPage].length}`,
    `Theme: primary=${context.currentLayout.theme.colors.primary}, accent=${context.currentLayout.theme.colors.accent}`,
    `App name: ${context.currentLayout.metadata.name}`,
  ];

  if (context.storeType) {
    parts.push(`Store type: ${context.storeType}`);
  }

  if (context.brandGuidelines) {
    parts.push('', '## Brand Guidelines', context.brandGuidelines);
  }

  if (context.selectedSectionId) {
    const section = context.currentLayout.pages[context.currentPage].find(
      (s) => s.id === context.selectedSectionId
    );
    if (section) {
      parts.push('', `## Currently Selected Section`, `Type: ${section.type}`, `ID: ${section.id}`, `Config: ${JSON.stringify(section.config, null, 2)}`);
    }
  }

  parts.push(
    '',
    '## Current Layout JSON',
    JSON.stringify(context.currentLayout.pages[context.currentPage], null, 2),
  );

  return parts.join('\n');
}
