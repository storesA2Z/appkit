# AppKit V3 — Code Editor + Preview (Sub-Project 1)

## Overview

Transform AppKit from a visual-only builder into a full development environment for React Native / Expo apps. Sub-project 1 adds an embedded code editor (OpenVSCode Server) and live preview (Expo Snack) in a Bolt-style side-by-side layout, with a collapsible AI chat sidebar ready for future agentic features.

This is the first of four sub-projects:
1. **Code Editor + Preview** (this spec)
2. AI Agent (Claude with file access, code generation, MCP tools)
3. Visual Builder V2 (generic RN components, navigation builder, data binding)
4. Cloud Runtime (Expo EAS builds, OTA updates, deploy)

## Goals

1. Embed OpenVSCode Server so users get a real VS Code experience in the browser
2. Show live Expo Snack preview alongside the editor with file-save-triggered hot reload
3. Scaffold real Expo Router projects on disk — no proprietary format, no lock-in
4. Keep the current visual builder accessible via Design/Code mode toggle
5. Include a basic Claude chat sidebar (streaming Q&A, no agentic features yet)

## Target User

React Native / Expo developers who want a visual + code hybrid environment. Also non-technical founders who start in Design mode and graduate to Code mode as they learn.

## Architecture

### Approach: Monolith Shell

Single Vite + React app that manages the layout and embeds external tools via iframes. One command starts everything: the shell dev server and the OpenVSCode Server subprocess.

```
┌─────────────────────────────────────────────────────────────┐
│  Toolbar: [Logo] [Project Name] [Design | Code] [▶ Run] [↓ Export] [AI ☰]  │
├────────────────────────────┬──────────────────┬─────────────┤
│                            │                  │             │
│    OpenVSCode Server       │   Expo Snack     │  AI Chat    │
│    (iframe)                │   Preview        │  (Claude)   │
│                            │   (iframe)       │             │
│    - File tree             │                  │  Collapsible│
│    - Multi-tab editor      │   - Live reload  │  sidebar    │
│    - Terminal              │   - Device frame  │             │
│                            │                  │             │
├────────────────────────────┴──────────────────┴─────────────┤
│  Status Bar: [branch] [errors/warnings] [Expo status] [port]│
└─────────────────────────────────────────────────────────────┘
```

- **Design mode**: Current AppKit builder (WidgetTree + SectionCanvas + PropertiesPanel) fills the content area
- **Code mode**: VS Code iframe (left) + Expo Snack preview (right) + AI chat sidebar (far right, collapsible)
- **Resizable panes**: Allotment (existing dependency)
- **Mode switching**: Show/hide containers — no unmount, VS Code keeps state

## Components

### App Shell (`packages/editor`)

New package. Vite + React app that serves as the main entry point.

```
packages/editor/
├── src/
│   ├── App.tsx                    # Shell layout with Allotment
│   ├── components/
│   │   ├── Toolbar.tsx            # Project name, mode toggle, run, export
│   │   ├── VSCodePane.tsx         # iframe wrapper for OpenVSCode Server
│   │   ├── PreviewPane.tsx        # Expo Snack iframe + DeviceFrame
│   │   ├── AiChatSidebar.tsx      # Collapsible Claude chat
│   │   └── StatusBar.tsx          # Connection status, branch, errors
│   ├── services/
│   │   ├── vscode-server.ts       # Start/stop OpenVSCode Server process
│   │   ├── file-watcher.ts        # chokidar watcher → Snack sync
│   │   ├── snack-bridge.ts        # postMessage API to Snack iframe
│   │   └── project-manager.ts     # Create/open/list projects in ~/.appkit/
│   └── templates/
│       └── expo-router-tabs/      # Scaffold template files
├── index.html
├── vite.config.ts
├── tailwind.config.js             # Reuse Warm Studio tokens
└── package.json
```

### OpenVSCode Server Integration

- Ships as an npm dependency or downloaded on first run (~80MB)
- Setup: `npx appkit setup` handles one-time download
- Shell starts the server as a child process on port 3100
- Embedded via iframe: `<iframe src="http://localhost:3100/?folder=/path/to/project" />`
- Communication via `postMessage` for file-save events
- Lifecycle: starts with shell, terminates when shell closes

### Expo Snack Preview

- Embeds `https://snack.expo.dev/embedded` via iframe
- Files synced to Snack via `postMessage` API
- Sync flow: user edits in VS Code → file saved to disk → chokidar watcher detects change → shell reads file → postMessage to Snack iframe → Snack hot reloads
- Wrapped in current DeviceFrame component (iPhone/Android CSS frames)
- Device switcher and light/dark toggle from current CanvasToolbar
- Limitations accepted for MVP:
  - Preview is Expo Web, not pixel-perfect native
  - Some npm packages won't work in Snack's bundler
  - ~1-2 second delay between save and preview refresh

### Project Scaffolding

On "New Project", generate a real Expo Router project:

```
my-app/
├── app/
│   ├── _layout.tsx              # Root layout with tab navigator
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar config
│   │   ├── index.tsx            # Home screen
│   │   ├── explore.tsx          # Explore screen
│   │   └── profile.tsx          # Profile screen
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── sections/
│       ├── BannerSection.tsx
│       ├── ProductsSection.tsx
│       └── HeroSection.tsx
├── constants/
│   └── theme.ts
├── assets/
│   └── images/
├── app.json
├── package.json
├── tsconfig.json
└── .appkit.json                 # AppKit metadata
```

- Templates stored in `packages/create-appkit/templates/`
- MVP ships with one template: "Blank Expo Router with tabs"
- `.appkit.json` marks directory as AppKit project (project name, created date, schema version)
- Projects stored at `~/.appkit/projects/{project-id}/`
- Generated code is real, runnable: `cd project && npx expo start`

### AI Chat Sidebar

- Collapsible right sidebar, 300px wide, defaults collapsed
- Reuses `@appkit/ai` streaming (streamClaude, message types)
- User provides Claude API key (stored in localStorage)
- Simple chat: user types question, Claude responds with streaming markdown
- No file access, no code generation, no tool use in sub-project 1
- Layout: header with collapse button, scrollable message list, input + send

### Design Mode Toggle

- Toolbar pill toggle: Design | Code
- Design mode loads current `@appkit/builder` as a component — untouched
- Code mode loads the VS Code + Snack + AI layout
- Switching is show/hide (no unmount) so VS Code keeps its state
- Design → Code: AppKit schema written to disk as real Expo files
- Code → Design: reads `.appkit.json` + files, reconstructs schema. If code has been customized beyond visual editing, Design mode shows a fallback message.
- One-directional sync for MVP (Design → Code is reliable; Code → Design is best-effort)

## Package Changes

### New packages:
- `packages/editor` — Main app shell (Vite + React)

### Modified packages:
- `packages/create-appkit` — Enhanced with real Expo Router template scaffolding
- `packages/ai` — Expose chat component for reuse in new shell
- `packages/schema` — Add `.appkit.json` project metadata type

### Unchanged packages:
- `packages/builder` — Loaded as component inside Design mode
- `packages/preview` — DeviceFrame reused in PreviewPane
- `packages/export` — Untouched
- `packages/mcp-server` — Untouched

## Data Flow

```
User creates project
  → project-manager scaffolds Expo files to ~/.appkit/projects/{id}/
  → OpenVSCode Server opens that workspace
  → file-watcher starts watching the directory

User edits code in VS Code
  → file saved to disk
  → chokidar detects change
  → snack-bridge reads file, posts to Snack iframe
  → Snack hot reloads preview

User switches Design → Code
  → builder schema serialized to Expo files on disk
  → VS Code iframe refreshes workspace
  → file-watcher picks up changes, syncs to Snack

User switches Code → Design
  → project-manager reads .appkit.json + file tree
  → attempts to reconstruct AppKit schema
  → if files match expected structure: Design mode loads normally
  → if customized beyond schema: shows "code-only project" message

User clicks Export
  → downloads project directory as .zip
  → real Expo project, runs with npx expo start
```

## Out of Scope

- AI code generation / agentic features (sub-project 2)
- Generic RN component library / visual drag-and-drop for non-section components (sub-project 3)
- Cloud builds / OTA / deploy (sub-project 4)
- Collaboration / multi-user
- Data binding / state management UI
- Extension marketplace
- Authentication / user accounts
- Navigation builder (beyond the default tab layout)
