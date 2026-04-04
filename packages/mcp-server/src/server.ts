#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { Workspace } from './workspace.js';
import { registerResources } from './resources.js';
import { SECTION_TYPES, PAGE_TYPES, validateSection } from '@appkit/schema';
import type { SectionType, Section } from '@appkit/schema';

const workspaceDir = process.argv.find((arg, i) => process.argv[i - 1] === '--workspace') || process.cwd();

const workspace = new Workspace(workspaceDir);

const server = new McpServer({
  name: 'appkit',
  version: '0.1.0',
});

server.tool('get_project', 'Get the full project including layout, theme, and metadata', {}, async () => {
  const project = workspace.loadProject();
  return { content: [{ type: 'text', text: JSON.stringify(project, null, 2) }] };
});

server.tool('list_sections', 'List all sections on a page', {
  page: z.enum(PAGE_TYPES as unknown as [string, ...string[]]).describe('Page name'),
}, async ({ page }) => {
  const sections = workspace.getSections(page);
  return { content: [{ type: 'text', text: JSON.stringify(sections, null, 2) }] };
});

server.tool('add_section', 'Add a new section to a page', {
  page: z.enum(PAGE_TYPES as unknown as [string, ...string[]]),
  type: z.enum(SECTION_TYPES as unknown as [string, ...string[]]),
  id: z.string().describe('Unique section ID'),
  config: z.record(z.any()).describe('Section config object'),
  index: z.number().optional().describe('Insert position'),
}, async ({ page, type, id, config, index }) => {
  const section: Section = { id, type: type as SectionType, config: config as any };
  const validation = validateSection(section);
  if (!validation.valid) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Validation failed', errors: validation.errors }) }] };
  }
  workspace.addSection(page, section, index);
  return { content: [{ type: 'text', text: JSON.stringify({ success: true, id }) }] };
});

server.tool('update_section', 'Update a section config', {
  page: z.enum(PAGE_TYPES as unknown as [string, ...string[]]),
  sectionId: z.string(),
  changes: z.record(z.any()).describe('Config fields to merge'),
}, async ({ page, sectionId, changes }) => {
  workspace.updateSection(page, sectionId, changes);
  return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
});

server.tool('remove_section', 'Remove a section from a page', {
  page: z.enum(PAGE_TYPES as unknown as [string, ...string[]]),
  sectionId: z.string(),
}, async ({ page, sectionId }) => {
  workspace.removeSection(page, sectionId);
  return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
});

server.tool('set_theme', 'Update theme colors, typography, or layout', {
  theme: z.record(z.any()).describe('Partial theme to merge'),
}, async ({ theme }) => {
  const project = workspace.loadProject();
  project.layout.theme = { ...project.layout.theme, ...theme };
  workspace.saveProject(project);
  return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
});

server.tool('set_metadata', 'Update app metadata', {
  metadata: z.record(z.any()).describe('Partial metadata to merge'),
}, async ({ metadata }) => {
  const project = workspace.loadProject();
  project.layout.metadata = { ...project.layout.metadata, ...metadata };
  workspace.saveProject(project);
  return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
});

const resources = registerResources(workspace);
for (const [uri, resource] of Object.entries(resources)) {
  server.resource(resource.name, uri, { mimeType: resource.mimeType, description: resource.description }, async () => ({
    contents: [{ uri, text: resource.handler(), mimeType: resource.mimeType }],
  }));
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
