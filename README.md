<div align="center">

# AppKit

**Open-Source Mobile App Builder for React Native & Expo**

Build mobile apps visually, edit code in VS Code, preview live — all in the browser.

The open-source alternative to FlutterFlow for React Native. Visual builder + code editor + AI assistant.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-000020)](https://expo.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## What is AppKit?

AppKit is an open-source mobile app builder that combines a **drag-and-drop visual editor**, an **embedded VS Code** (OpenVSCode Server), and a **live Expo preview** — all running in your browser. Design your app visually, switch to code when you need full control, and use **AI (Claude)** to accelerate both.

Unlike proprietary tools like FlutterFlow or Adalo, AppKit generates **real Expo Router projects** — no vendor lock-in, no proprietary format. Every project you create is a standard React Native app you can eject and run with `npx expo start`.

## Why AppKit?

- **No lock-in** — generates real Expo Router projects, not a proprietary format
- **Visual + Code** — design visually, then fine-tune in a real VS Code editor
- **AI-assisted** — Claude helps you build faster with context-aware suggestions
- **Open source** — MIT licensed, self-hosted, fully extensible
- **Full-stack ready** — real TypeScript, real React Native components, real navigation

## Features

### Code Editor + Live Preview
- **Embedded VS Code** (OpenVSCode Server) — full IDE in the browser
- **Expo Snack live preview** in a phone-frame device simulator
- **Resizable split panes** — Editor | Preview | AI Chat side by side
- **Real-time file sync** — edit in VS Code, preview updates instantly
- **Real Expo Router projects** — scaffolded to disk, runs with `npx expo start`

### Visual Builder
- **Drag-and-drop sections** with 13 built-in component types
- **Design/Code mode toggle** — switch without losing state in either mode
- **Design-to-Code sync** — visual changes serialize to real `.tsx` files
- **Per-section property editors** with live preview
- **Theme system** with saved presets, undo/redo, multi-page support

### AI Assistant
- **Claude-powered chat sidebar** with streaming responses
- **Context-aware** — understands your project structure and layout
- Your API key stays in your browser — sent directly to Anthropic, never stored on a server

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+

### Install & Run

```bash
git clone https://github.com/anthropics/appkit.git
cd appkit
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

## How It Works

```
Create Project → Real Expo Router app scaffolded to disk
       ↓
Design Mode → Drag-and-drop sections, configure properties
       ↓
Sync to Code → Visual layout serialized to real .tsx files
       ↓
Code Mode → Edit in VS Code, preview updates live
       ↓
Export → Download as .zip or run locally with npx expo start
```

## Architecture

Monorepo with 8 packages managed by pnpm + Turborepo:

```
packages/
  editor/         # App shell: VS Code + Expo preview + AI chat (Vite + React)
  builder/        # Visual drag-and-drop builder (Vite + React, Zustand, dnd-kit)
  schema/         # TypeScript types, validation, JSON Schema, defaults
  preview/        # Device frame + section renderers
  ai/             # Claude streaming client and tool definitions
  export/         # Expo project generator from visual layouts
  create-appkit/  # Project scaffolder with Expo Router templates
  mcp-server/     # Model Context Protocol workspace for programmatic access
```

## Built-In Section Types

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
| `custom` | Bring your own React Native component |

## MCP Integration

The `@appkit/mcp-server` package provides programmatic layout access via the [Model Context Protocol](https://modelcontextprotocol.io). Use it with Claude Desktop, Cursor, Windsurf, or any MCP-compatible client to read and modify app layouts programmatically.

## Contributing

We welcome contributions! Whether it's bug fixes, new section types, AI improvements, or documentation — PRs are open.

```bash
# Fork, clone, then:
pnpm install
pnpm test        # make sure everything passes
# make your changes
pnpm test        # make sure nothing broke
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **State:** Zustand
- **Drag & Drop:** dnd-kit
- **Editor:** OpenVSCode Server (Gitpod)
- **Preview:** Expo Snack embedded
- **AI:** Claude API (Anthropic)
- **Build:** pnpm, Turborepo
- **Testing:** Vitest

## Comparison

| Feature | AppKit | FlutterFlow | Adalo | Draftbit |
|---------|--------|-------------|-------|----------|
| Open source | Yes (MIT) | No | No | No |
| React Native / Expo | Yes | No (Flutter) | No | Yes |
| Embedded code editor | Yes (VS Code) | No | No | No |
| AI assistant | Yes (Claude) | Yes | No | No |
| Real project files | Yes | No | No | Partial |
| Self-hosted | Yes | No | No | No |
| Free | Yes | Freemium | Freemium | Freemium |

## License

MIT

---

<div align="center">

**Built with [Claude](https://claude.ai) and [Expo](https://expo.dev)**

</div>
