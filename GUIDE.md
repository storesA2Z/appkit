# AppKit User Guide

Everything you need to go from zero to a running app in 5 minutes.

---

## 1. Quick Start

### Install

```bash
git clone https://github.com/anthropics/appkit.git
cd appkit
pnpm install
pnpm build
```

### Start the Editor

```bash
cd packages/editor
pnpm dev
```

This starts three things:
- **Editor UI** at `http://localhost:5200` — the main app you'll use
- **OpenVSCode Server** at `http://localhost:3100` — embedded VS Code (starts automatically)
- **File watcher** — syncs your code edits to the live preview

Open `http://localhost:5200` in your browser. You'll see the AppKit editor with a toolbar at the top, an empty workspace in the middle, and a status bar at the bottom.

### What you're looking at

```
┌──────────────────────────────��──────────────────┐
│  [appkit logo]  [Project Name]  [Design|Code]   │  ← Toolbar
├──────────────────┬───────────────┬────────────���─┤
│                  │               │              │
│  VS Code Editor  │  Phone        │  AI Chat     │
│                  │  Preview      │  (collapsed) │
│                  │               │              │
├──────────────────┴──────────────���┴──────────────┤
│  [VS Code: ●]  [Snack: ●]  [project name]      │  ← Status Bar
└──────────────────────────────────────────���──────┘
```

---

## 2. Create Your First App

### Pick a Template

When you create a new project, you'll choose from these templates:

| Template | Best for | What's inside |
|----------|----------|---------------|
| **Blank Starter** | Starting from scratch | Empty tabs app with theme |
| **E-Commerce Store** | Shopping apps | Products, categories, cart, promotions |
| **Restaurant** | Food & delivery | Menu, featured items, order history |
| **Portfolio** | Personal showcase | Project gallery, about, contact form |
| **SaaS Dashboard** | Data & utility apps | Stats cards, activity feed, settings |

Each template creates a **real Expo Router project** — not a locked-in proprietary format. You can eject it and run it with `npx expo start` at any time.

### What's in a project

```
my-app/
├── app/
│   ├── _layout.tsx          # Root layout (Stack navigator)
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar configuration
│       ├── index.tsx        # First tab (Home)
│       └── *.tsx            # Other tabs
├���─ components/
│   └── ui/                  # Reusable UI components
├── constants/
│   └── theme.ts             # Colors, spacing, border radius
├── assets/                  # Images and fonts
├── .appkit.json             # AppKit metadata (project name, ID)
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

### The .appkit.json file

This marks a directory as an AppKit project. It stores:
- **name** — your project's display name
- **id** — unique project identifier
- **template** — which template was used to create it
- **schemaVersion** — for future migrations

You don't need to edit this file — AppKit manages it.

---

## 3. Design Mode

Click **Design** in the toolbar to switch to the visual builder.

### The Interface

The visual builder has three panels:
- **Left: Widget Tree** — all your sections listed by page, with colored dots by type
- **Center: Canvas** — live preview of your layout with device frame
- **Right: Properties** — edit the selected section's configuration

### Adding Sections

1. Click the **+** button at the bottom of the Widget Tree
2. Pick a section type (banner, hero, products, etc.)
3. The section appears in the canvas and widget tree
4. Click it to configure in the Properties panel

### Section Types

Each section type has a specific purpose:

- **Banner** — image carousel for promotions (swipes automatically)
- **Hero** — full-width image with text overlay and call-to-action button
- **Categories** — grid or circular icons for navigation
- **Products** — product cards in grid or horizontal scroll
- **Collections** — showcase multiple product collections
- **Header** — text heading with optional subtitle
- **Video** — embedded video player
- **Flash Sale** — countdown timer with promotion details
- **Reviews** — customer review display
- **Offer** — promotional card with CTA
- **Tabs** — tabbed content for different collections
- **Marquee** — scrolling announcement text
- **Custom** — your own React Native component

### Reordering

Drag sections in the Widget Tree to reorder them. The canvas updates live.

### Themes

The theme editor (Properties panel → Style tab) controls:
- **Colors** — primary, accent, background, text
- **Typography** — font family, size, weight
- **Layout** — border radius, spacing

Save themes as presets and switch between them.

### Undo/Redo

- **Undo**: `Ctrl+Z` (or `Cmd+Z` on Mac)
- **Redo**: `Ctrl+Shift+Z` (or `Cmd+Shift+Z`)

---

## 4. Code Mode

Click **Code** in the toolbar to switch to the code editor.

### VS Code

The left pane is a full VS Code instance (OpenVSCode Server). You get:
- File tree, multi-tab editor, terminal
- Syntax highlighting, IntelliSense, extensions
- Standard keyboard shortcuts

Edit any `.tsx` file and save — the preview updates automatically.

### Live Preview

The right pane shows your app running in an Expo Snack simulator. It:
- Looks like a phone with a device frame
- Updates when you save files in VS Code
- Runs Expo Web (not pixel-perfect native, but close)

There's a ~1-2 second delay between saving and seeing the preview refresh.

### Sync to Code (Design → Code)

When you've made changes in Design mode and switch to Code mode, click **Sync to Code** in the Design mode toolbar bar. This:
1. Takes your visual layout (sections, theme, configuration)
2. Generates real `.tsx` files from it
3. Writes them to your project directory

The generated code is standard React Native — you can edit it freely in Code mode.

**Important:** Sync is one-directional for now. Design → Code works reliably. Code → Design is not yet supported (if you edit code manually, Design mode won't reflect those changes).

---

## 5. AI Chat

Click the **AI** button in the toolbar to open the chat sidebar.

### Setup

1. Enter your Anthropic API key (starts with `sk-ant-`)
2. Your key is stored in your browser's localStorage
3. It's sent directly to Anthropic's API — AppKit never sees it

### What to Ask

The AI assistant can help with:
- "What section types are available?"
- "How do I add a product grid to my home page?"
- "Explain how the theme system works"
- "What's the best layout for a fashion store?"

### Limitations

In the current version, the AI can answer questions and give advice, but it **cannot**:
- Read or write your project files
- Add/remove sections for you
- Generate code directly

These features are coming in Sub-Project 2 (AI Agent).

---

## 6. Export & Run Locally

### Download as ZIP

Click **Export** in the toolbar to download your project as a `.zip` file. Unzip it and you have a complete Expo project.

### Run Locally

```bash
cd my-app
npm install
npx expo start
```

This starts the Expo dev server. Scan the QR code with the Expo Go app on your phone to see your app running natively.

### What You Get

The exported project is a standard Expo Router app:
- Runs on iOS, Android, and Web
- No AppKit dependency — it's a standalone project
- All source code is yours to modify
- Deploy with `eas build` for production builds

---

## 7. Next Steps

### Create Your Own Template

1. Copy an existing template from `packages/create-appkit/templates/`
2. Modify the screens, theme, and components
3. Update the template registry in `packages/create-appkit/src/templates.ts`
4. Your template appears in the "New Project" flow

### Add Custom Section Types

1. Create your component in `components/sections/`
2. Register it in the section registry
3. Use type `custom` in the builder with your component name

### MCP Integration

Use the `@appkit/mcp-server` package to manipulate layouts programmatically from Claude Desktop, Cursor, or any MCP-compatible client. See the [README](README.md#mcp-integration) for details.

### Contributing

We welcome PRs! See the [README](README.md#contributing) for setup instructions.
