import { schemaPrompt, type AppLayout } from '@appkit/schema';

export interface AiContext {
  storeType: string | null;
  brandGuidelines: string | null;
  currentLayout: AppLayout;
  currentPage: string;
  selectedSectionId: string | null;
}

export function buildSystemPrompt(context: AiContext): string {
  const pageConfig = context.currentLayout.pages[context.currentPage];
  const sections = pageConfig?.sections ?? [];

  const parts = [
    schemaPrompt,
    '',
    '## Current State',
    `Current page: ${context.currentPage}`,
    `Sections on current page: ${sections.length}`,
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
    const section = sections.find(
      (s) => s.id === context.selectedSectionId
    );
    if (section) {
      parts.push('', `## Currently Selected Section`, `Type: ${section.type}`, `ID: ${section.id}`, `Config: ${JSON.stringify(section.config, null, 2)}`);
    }
  }

  parts.push(
    '',
    '## Current Layout JSON',
    JSON.stringify(sections, null, 2),
  );

  return parts.join('\n');
}
