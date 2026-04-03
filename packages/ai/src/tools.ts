export const appkitTools = [
  {
    name: 'get_current_state',
    description: 'Read the current app layout state including all pages, theme, and metadata',
    input_schema: {
      type: 'object' as const,
      properties: {
        page: { type: 'string', enum: ['home', 'explore', 'profile', 'search'], description: 'Optional: get only a specific page' },
      },
      required: [] as string[],
    },
  },
  {
    name: 'list_section_types',
    description: 'List all available section types with their config schemas and descriptions',
    input_schema: { type: 'object' as const, properties: {}, required: [] as string[] },
  },
  {
    name: 'add_section',
    description: 'Add a new section to a page at a specific position',
    input_schema: {
      type: 'object' as const,
      properties: {
        page: { type: 'string', enum: ['home', 'explore', 'profile', 'search'] },
        type: { type: 'string', enum: ['banner','categories','products','collections','header','video','flash_sale','reviews','offer','hero','tabs','marquee'] },
        config: { type: 'object', description: 'Section-specific config matching the type' },
        position: { type: 'number', description: 'Index to insert at (appends if omitted)' },
      },
      required: ['page', 'type', 'config'],
    },
  },
  {
    name: 'update_section',
    description: 'Update an existing section config by section ID',
    input_schema: {
      type: 'object' as const,
      properties: {
        sectionId: { type: 'string', description: 'The section ID to update' },
        changes: { type: 'object', description: 'Partial config changes to merge' },
      },
      required: ['sectionId', 'changes'],
    },
  },
  {
    name: 'remove_section',
    description: 'Remove a section by ID',
    input_schema: {
      type: 'object' as const,
      properties: {
        sectionId: { type: 'string' },
      },
      required: ['sectionId'],
    },
  },
  {
    name: 'reorder_sections',
    description: 'Reorder sections on a page by providing the new order of section IDs',
    input_schema: {
      type: 'object' as const,
      properties: {
        page: { type: 'string', enum: ['home', 'explore', 'profile', 'search'] },
        sectionIds: { type: 'array', items: { type: 'string' }, description: 'Section IDs in desired order' },
      },
      required: ['page', 'sectionIds'],
    },
  },
  {
    name: 'set_theme',
    description: 'Update the app theme (colors, typography, layout)',
    input_schema: {
      type: 'object' as const,
      properties: {
        colors: { type: 'object' },
        typography: { type: 'object' },
        layout: { type: 'object' },
      },
      required: [] as string[],
    },
  },
  {
    name: 'set_metadata',
    description: 'Update app metadata (name, description, version)',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        version: { type: 'string' },
      },
      required: [] as string[],
    },
  },
  {
    name: 'analyze_layout',
    description: 'Analyze the current layout for UX issues, conversion optimization, and mobile best practices. Returns suggestions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        page: { type: 'string', enum: ['home', 'explore', 'profile', 'search'] },
      },
      required: ['page'],
    },
  },
  {
    name: 'build_entire_app',
    description: 'Generate complete layouts for all 4 pages based on store type and brand style',
    input_schema: {
      type: 'object' as const,
      properties: {
        storeType: { type: 'string', enum: ['fashion', 'grocery', 'electronics', 'beauty', 'home', 'general'] },
        brandStyle: { type: 'string', description: 'e.g. luxury, minimal, bold, playful' },
        features: { type: 'array', items: { type: 'string' }, description: 'Features to include like flash sales, reviews, loyalty' },
      },
      required: ['storeType'],
    },
  },
  {
    name: 'generate_custom_component',
    description: 'Generate a custom React Native component when built-in sections are not enough',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'Component name in PascalCase' },
        description: { type: 'string', description: 'What the component should do' },
        ecommerceContext: { type: 'string', description: 'e.g. size guide, loyalty widget, brand story' },
      },
      required: ['name', 'description'],
    },
  },
];
