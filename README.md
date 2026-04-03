# AppKit

Open-source drag-and-drop mobile app builder for React Native / Expo e-commerce apps.

Build production-ready mobile storefronts visually with a component-based layout editor, real-time phone preview, and optional AI assistance via Claude.

## Features

- **Visual builder** with drag-and-drop section reordering (dnd-kit)
- **12 e-commerce section types**: banner, categories, products, collections, header, video, flash sale, reviews, offers, hero, tabs, marquee
- **Live mobile preview** in a device frame with bottom tab navigation
- **Per-section property editors** for fine-grained configuration
- **Theme editor** for colors, typography, and layout spacing
- **Multi-page support**: home, explore, search, profile
- **Undo/redo** with full history stack
- **Multi-project management** with localStorage persistence
- **AI-powered builder** (optional) via Claude API — describe your store and let AI build the layout
- **JSON import/export** for `.appkit.json` project files
- **Expo project export** — generate a ready-to-run Expo project from your layout
- **MCP server** for programmatic workspace access
- **Keyboard shortcuts**: Ctrl+Z undo, Ctrl+Shift+Z redo, Delete to remove

## Architecture

Monorepo with 6 packages managed by pnpm + Turborepo:

```
packages/
  schema/       # Types, validation, JSON Schema, AI prompt context
  preview/      # React device frame + 12 section renderers
  builder/      # Vite + React 18 app (Zustand store, dnd-kit, Tailwind CSS)
  ai/           # Claude streaming client, tool definitions, chat panel
  export/       # JSON and Expo project exporters
  mcp-server/   # File-based workspace CRUD for MCP integration
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+

### Install & Run

```bash
pnpm install
pnpm build
pnpm dev       # starts the builder at http://localhost:5173
```

### Run Tests

```bash
pnpm test
```

### Typecheck

```bash
pnpm typecheck
```

## Section Types

| Type | Description |
|------|-------------|
| `banner` | Image/video carousel with autoplay |
| `categories` | Collection grid, list, or circular icons |
| `products` | Product cards with sort and filter options |
| `collections` | Multi-collection showcase |
| `header` | Text header with optional subtitle and alignment |
| `video` | Video player or shoppable video carousel |
| `flash_sale` | Countdown timer with sale details |
| `reviews` | Top-rated product reviews display |
| `offer` | Promotional offer card with CTA |
| `hero` | Full-width hero image with text overlay |
| `tabs` | Tabbed content with multiple collections |
| `marquee` | Scrolling announcement ticker |

## AI Integration (Optional)

The builder includes an optional AI assistant powered by Claude. Enter your Anthropic API key in the builder to enable it. The AI can:

- Build entire store layouts from a description
- Add, update, and remove sections
- Apply themes and configure sections
- Follow e-commerce conversion best practices

Your API key stays in your browser and is only sent directly to Anthropic's API.

## Examples

See `examples/` for complete store layouts:

- **Fashion Store** — hero, circular categories, product grid, flash sale, reviews, marquee
- **Grocery Store** — category grid, banner carousel, product list, flash sale, marquee

## Export

### JSON Export

Export your layout as a `.appkit.json` file for sharing or version control.

### Expo Export

Generate a complete Expo project with:
- `package.json` with all dependencies
- `app.json` with Expo configuration
- `App.tsx` with navigation setup
- Layout data and theme configuration

## MCP Server

The `@appkit/mcp-server` package provides a file-based workspace for programmatic layout management via the [Model Context Protocol](https://modelcontextprotocol.io). Use it to integrate AppKit with any MCP-compatible client (Claude Desktop, Cursor, Windsurf, etc.).

### Workspace API

```typescript
import { Workspace } from '@appkit/mcp-server';

const workspace = new Workspace('./my-store');

// Load or create a project
const project = workspace.loadProject();

// CRUD operations on sections
workspace.addSection('home', {
  id: 'hero-1',
  type: 'hero',
  config: {
    type: 'hero',
    heroConfig: {
      imageUrl: 'https://example.com/hero.jpg',
      title: 'Summer Sale',
      subtitle: '50% off everything',
      ctaText: 'Shop Now',
      textPosition: 'center',
      overlayOpacity: 0.4,
      height: 280,
    },
  },
});

workspace.updateSection('home', 'hero-1', { title: 'Winter Sale' });
workspace.removeSection('home', 'hero-1');

// Get all sections for a page
const sections = workspace.getSections('home');

// Full layout read/write
const layout = workspace.getLayout();
workspace.setLayout(layout);
```

Projects are persisted as `layout.json` in the workspace directory, making them easy to version control.

## License

MIT
