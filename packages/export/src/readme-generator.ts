import type { AppLayout } from '@appkit/schema';

export function generateReadme(layout: AppLayout): string {
  const { metadata, pages, theme } = layout;
  const pageEntries = Object.entries(pages);
  const totalSections = pageEntries.reduce((sum, [, p]) => sum + p.sections.length, 0);
  const sectionTypes = [...new Set(pageEntries.flatMap(([, p]) => p.sections.map((s) => s.type)))];
  const customSections = pageEntries.flatMap(([, p]) => p.sections.filter((s) => s.type === 'custom'));

  return `# ${metadata.name}

${metadata.description}

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
\`\`\`

## Project Structure

\`\`\`
├── App.tsx                      # Entry point with navigation setup
├── src/
│   ├── data/
│   │   ├── layout.json          # AppKit layout configuration (${totalSections} sections)
│   │   └── mock-data.ts         # Sample products and categories
│   ├── theme/
│   │   └── theme.ts             # Theme tokens (colors, typography, spacing)
│   ├── navigation/
│   │   └── BottomTabs.tsx       # Tab navigator with ${pageEntries.length} tabs
│   ├── screens/
│   │   ${pageEntries.map(([slug, p]) => `├── ${capitalize(slug)}Screen.tsx   # ${p.label} (${p.sections.length} sections)`).join('\n│   ')}
│   ├── sections/
│   │   ├── SectionRenderer.tsx  # Routes section type → component
│   │   ├── custom-registry.ts   # Register your custom components here
│   │   └── ...                  # One file per section type
│   └── components/
│       └── ProductCard.tsx      # Reusable product card
├── package.json
├── app.json                     # Expo config
└── tsconfig.json
\`\`\`

## Pages

${pageEntries.map(([slug, page]) => {
  const navLabel = page.navType === 'tab' ? '(bottom tab)' : page.navType === 'drawer' ? '(drawer)' : '(stack)';
  return `### ${page.label} ${navLabel}
- **Slug:** \`${slug}\`
- **Sections:** ${page.sections.length > 0 ? page.sections.map((s) => `\`${s.type}\``).join(', ') : '_none_'}`;
}).join('\n\n')}

## Section Types Used

${sectionTypes.map((t) => `- **${t}** — ${sectionDescription(t)}`).join('\n')}

## Theme

| Token | Value |
|-------|-------|
| Primary | \`${theme.colors.primary}\` |
| Secondary | \`${theme.colors.secondary}\` |
| Accent | \`${theme.colors.accent}\` |
| Background | \`${theme.colors.background}\` |
| Text | \`${theme.colors.text}\` |
| Font | ${theme.typography.fontFamily} |
| Border Radius | ${theme.layout.borderRadius} |
| Spacing | ${theme.layout.spacing} |

You can customize the theme in \`src/theme/theme.ts\`. All section components reference theme tokens, so changes propagate automatically.

${customSections.length > 0 ? `## Custom Sections

This project includes ${customSections.length} custom section(s). To add your own:

1. Create a component in \`src/sections/\` or \`src/components/\`
2. Register it in \`src/sections/custom-registry.ts\`:

\`\`\`typescript
import MyPromoCard from "../components/MyPromoCard";

export const customSectionRegistry: Record<string, ComponentType<any>> = {
  MyPromoCard,
};
\`\`\`

3. In \`layout.json\`, set \`customConfig.componentName\` to match the registry key.
` : ''}
## Customization Guide

### Adding a new section
1. Create \`src/sections/MySection.tsx\` with a \`config\` prop
2. Register it in the \`builtInSections\` map in \`SectionRenderer.tsx\`
3. Add the section data to \`layout.json\` under the desired page

### Changing navigation
- Edit \`src/navigation/BottomTabs.tsx\` to add/remove/reorder tabs
- The tab icons use \`@expo/vector-icons/Ionicons\`

### Connecting real data
- Replace \`src/data/mock-data.ts\` with API calls to your backend
- Products, categories, and collections follow the interfaces defined in \`mock-data.ts\`

### Building for production
\`\`\`bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
\`\`\`

## Version

- App version: ${metadata.version}
- Generated with AppKit Builder
`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sectionDescription(type: string): string {
  const descriptions: Record<string, string> = {
    hero: 'Full-width hero image with overlay text and CTA',
    banner: 'Image/video carousel with autoplay support',
    header: 'Text divider or section heading',
    video: 'Embedded video player',
    marquee: 'Scrolling ticker/announcement bar',
    categories: 'Category grid or horizontal scroll',
    products: 'Product listing with multiple layout variants',
    collections: 'Multi-collection display',
    tabs: 'Tabbed content with collection switching',
    flash_sale: 'Countdown timer with promotional content',
    reviews: 'Product reviews and ratings display',
    offer: 'Promotional card with discount info',
    custom: 'Custom component registered in custom-registry.ts',
  };
  return descriptions[type] || 'Custom section';
}
