# AppKit

Open-source mobile app builder for React Native / Expo. Build apps visually, edit code in VS Code, preview live — all in the browser.

AppKit combines a drag-and-drop visual builder with an embedded code editor (OpenVSCode Server) and live Expo preview. Design your app visually, switch to code when you need full control, and use AI to accelerate both.

## Features

### Code Editor + Live Preview
- **Embedded VS Code** (OpenVSCode Server) — full IDE experience in the browser
- **Expo Snack live preview** in a phone-frame device simulator
- **Resizable split panes** — Editor | Preview | AI Chat side by side
- **File watcher** syncs edits to preview in real-time
- **Real Expo Router projects** — scaffolded on disk, runs with `npx expo start`

### Visual Builder
- **Drag-and-drop sections** with 13 component types
- **Design/Code mode toggle** — switch between visual and code editing without losing state
- **Design-to-Code sync** — visual changes serialize to real Expo project files
- **Per-section property editors** with live preview
- **Theme system** with saved presets, undo/redo, multi-page support

### AI Assistant
- **Claude-powered chat sidebar** with streaming responses
- **Context-aware** — understands your project structure
- API key stays in your browser, sent directly to Anthropic

## Architecture

Monorepo with 8 packages managed by pnpm + Turborepo:

```
packages/
  editor/         # App shell: VS Code + Expo preview + AI chat (Vite + React)
  builder/        # Visual drag-and-drop builder (Vite + React, Zustand, dnd-kit)
  schema/         # Types, validation, JSON Schema, defaults
  preview/        # Device frame + section renderers
  ai/             # Claude streaming client and tool definitions
  export/         # Expo project generator
  create-appkit/  # Project scaffolder with Expo Router templates
  mcp-server/     # MCP workspace for programmatic access
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+

### Install & Run

```bash
pnpm install
pnpm build

# Start the full editor (VS Code + Preview + AI)
cd packages/editor && pnpm dev

# Or start just the visual builder
cd packages/builder && pnpm dev
```

### Run Tests

```bash
pnpm test
```

### Create a New Project

```bash
# Projects are scaffolded as real Expo Router apps
# The editor creates them at ~/.appkit/projects/
```

## Section Types

| Type | Description |
|------|-------------|
| `banner` | Image/video carousel with autoplay |
| `hero` | Full-width hero image with text overlay |
| `categories` | Collection grid, list, or circular icons |
| `products` | Product cards with sort and filter options |
| `collections` | Multi-collection showcase |
| `header` | Text header with optional subtitle |
| `video` | Video player or shoppable video carousel |
| `flash_sale` | Countdown timer with sale details |
| `reviews` | Product reviews display |
| `offer` | Promotional offer card with CTA |
| `tabs` | Tabbed content with multiple collections |
| `marquee` | Scrolling announcement ticker |
| `custom` | Your own React Native component |

## How It Works

```
Create Project → Expo Router app scaffolded to disk
                      ↓
Design Mode → drag-and-drop sections, configure properties
                      ↓
Sync to Code → visual layout serialized to real .tsx files
                      ↓
Code Mode → edit in VS Code, preview updates live via Snack
                      ↓
Export → download as .zip or run locally with npx expo start
```

## MCP Server

The `@appkit/mcp-server` package provides programmatic layout access via the [Model Context Protocol](https://modelcontextprotocol.io). Use it with Claude Desktop, Cursor, or any MCP-compatible client.

## License

MIT
