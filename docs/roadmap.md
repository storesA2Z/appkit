# AppKit Roadmap

AppKit is an open-source mobile app builder for React Native / Expo — think FlutterFlow, but open-source, with AI and a real code editor.

## Current State

### Visual Builder (shipped)
- Drag-and-drop section-based layout builder
- 13 section types: banner, hero, categories, products, collections, flash sale, reviews, video, offer, header, tabs, marquee, custom
- Multi-page support with tab navigation (home, explore, search, profile + custom pages)
- Section groups, undo/redo, theme system with saved presets
- Properties panel per section type with live preview
- Design/Code mode toggle (JSON editor)
- Export to real Expo project
- AI assistant panel (Claude) for layout suggestions
- "Warm Studio" dark theme: VS Code density + Figma warmth
- MCP server for programmatic layout manipulation

### Code Editor + Preview (shipped)
- Embedded OpenVSCode Server (real VS Code in the browser)
- Expo Snack live preview with device frame
- Resizable split panes (Allotment): Editor | Preview | AI Chat
- Design/Code mode toggle that preserves iframe state
- Project scaffolding: real Expo Router projects with tabs template
- AI chat sidebar with Claude streaming
- File watcher (chokidar) syncing edits to Snack preview
- Design-to-Code sync: visual builder layout serialized to Expo files

---

## Sub-Project 2: AI Agent

Connect Claude to the codebase with file access, code generation, and tool use.

- Claude reads/writes project files via MCP or API
- Agentic code generation: "add a settings screen with dark mode toggle"
- Context-aware suggestions based on current file and project structure
- Tool use: create files, modify sections, run commands
- Conversation memory within project session

## Sub-Project 3: Visual Builder V2

Upgrade from section-based to generic React Native component editing.

- Generic RN component palette (View, Text, Image, ScrollView, etc.)
- Visual drag-and-drop for arbitrary component trees
- Navigation builder (stack, tabs, drawer — beyond default tabs)
- Data binding UI: connect components to state/API
- Two-way sync: edit visually, see code update; edit code, see visual update

## Sub-Project 4: Cloud Runtime

Ship apps without leaving the browser.

- Expo EAS cloud builds (iOS + Android)
- OTA updates via expo-updates
- One-click deploy to TestFlight / Play Store internal testing
- Build history and rollback
- Environment management (dev / staging / production)

---

## Future Ideas (not yet planned)

- Collaboration / multi-user editing
- Extension / plugin marketplace
- Authentication and user accounts system
- Marketplace for templates and components
- GitHub integration (push/pull projects)
- Custom domain hosting for web exports
