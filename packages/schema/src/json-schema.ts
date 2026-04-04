const sectionSchema = {
  type: 'object' as const,
  required: ['id', 'type', 'config'],
  properties: {
    id: { type: 'string' as const, description: 'Unique section ID (nanoid)' },
    type: {
      type: 'string' as const,
      enum: [
        'banner', 'categories', 'products', 'collections',
        'header', 'video', 'flash_sale', 'reviews',
        'offer', 'hero', 'tabs', 'marquee', 'custom',
      ],
    },
    config: { type: 'object' as const, description: 'Section-specific configuration' },
    spacing: {
      type: 'object' as const,
      properties: {
        marginTop: { type: 'number' as const, minimum: 0 },
        marginBottom: { type: 'number' as const, minimum: 0 },
        paddingTop: { type: 'number' as const, minimum: 0 },
        paddingBottom: { type: 'number' as const, minimum: 0 },
      },
    },
    styling: {
      type: 'object' as const,
      properties: {
        backgroundColor: { type: 'string' as const },
        borderRadius: { type: 'number' as const, minimum: 0 },
        borderColor: { type: 'string' as const },
        borderWidth: { type: 'number' as const, minimum: 0 },
      },
    },
    customStyle: { type: 'object' as const, description: 'Custom RN style overrides' },
  },
};

export const layoutJsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'AppLayout',
  description: 'appkit e-commerce mobile app layout schema',
  type: 'object' as const,
  properties: {
    pages: {
      type: 'object' as const,
      description: 'Layout pages with sections',
      additionalProperties: {
        type: 'object' as const,
        required: ['label', 'slug', 'isCore', 'navType', 'sections'],
        properties: {
          label: { type: 'string' as const },
          slug: { type: 'string' as const },
          icon: { type: 'string' as const },
          isCore: { type: 'boolean' as const },
          navType: { type: 'string' as const, enum: ['tab', 'stack', 'drawer'] },
          sections: {
            type: 'array' as const,
            maxItems: 10,
            items: sectionSchema,
          },
          groups: {
            type: 'array' as const,
            items: {
              type: 'object' as const,
              properties: {
                id: { type: 'string' as const },
                name: { type: 'string' as const },
                sectionIds: { type: 'array' as const, items: { type: 'string' as const } },
                collapsed: { type: 'boolean' as const },
              },
            },
          },
        },
      },
    },
    theme: { type: 'object' as const },
    themes: { type: 'array' as const },
    activeThemeId: { type: 'string' as const },
    metadata: { type: 'object' as const },
  },
  required: ['pages', 'theme', 'metadata'],
};
