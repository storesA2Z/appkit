# Warm Studio — AppKit Builder Design Refresh

## Overview

Visual refresh of the AppKit Builder UI applying a "Warm Studio" aesthetic: VS Code/Cursor information density combined with Figma/Framer warmth and colorful section type indicators. This is a CSS/token-level change — no data model or feature changes.

## Goals

1. Fix text contrast issues (current normal text `#6b7280` is nearly invisible on `#0f0f14`)
2. Shift from cold blue-grays to warm grays for a friendlier, Figma-like feel
3. Add distinct per-section-type colors for visual scannability in widget tree and properties panel
4. Soften the base darkness from near-black to comfortable dark (`#1a1b23`)
5. Tighten spacing inconsistencies across panels

## Color System

### Base Palette

| Token | Old | New | Purpose |
|-------|-----|-----|---------|
| `ide.bg` | `#0f0f14` | `#1a1b23` | App background |
| `ide.panel` | `#141419` | `#1f2029` | Side panels, dropdowns |
| `ide.toolbar` | `#18181f` | `#262730` | Toolbars, tab bars |
| `ide.surface` | (none) | `#2a2b35` | Cards, hover states |
| `ide.border` | `#1e1e2e` | `#2e2f3a` | Borders, dividers |
| `ide.accent` | `#818cf8` | `#6366f1` | Primary actions, focus rings |
| `ide.accent-dim` | (none) | `#4f46e5` | Accent hover/pressed |
| `ide.hover` | `#1a1a2e` | `#2a2b35` | List/item hover bg |

### Text Hierarchy (Warm Grays)

| Token | Old | New |
|-------|-----|-----|
| `ide.text-bright` | `#e2e8f0` | `#ede9e3` |
| `ide.text` | `#6b7280` | `#a8a29e` |
| `ide.text-dim` | `#4b5563` | `#6b6560` |
| `ide.text-muted` | `#94a3b8` | `#857f78` |

### Section Type Colors

Used for widget tree dots, section labels, and property panel left-border accents.

| Section | Color | Hex |
|---------|-------|-----|
| banner | Coral | `#f97066` |
| hero | Rose | `#f472b6` |
| categories | Amber | `#fbbf24` |
| products | Teal | `#2dd4bf` |
| collections | Sky | `#38bdf8` |
| flash_sale | Orange | `#fb923c` |
| reviews | Lime | `#a3e635` |
| video | Purple | `#a78bfa` |
| offer | Pink | `#f9a8d4` |
| header | Blue | `#60a5fa` |
| tabs | Cyan | `#22d3ee` |
| marquee | Emerald | `#34d399` |
| custom | Slate | `#94a3b8` |

## Typography

No font changes. Sizing adjustments only:

| Element | Old | New |
|---------|-----|-----|
| Panel headers | 11px, normal | 11px, weight 500 |
| Section labels in widget tree | 11px | 12px |
| Property labels | 10px | 11px |
| Toolbar buttons | 11px | 11px (unchanged) |
| Code editor | 12px JetBrains Mono | 12px (unchanged) |

## Spacing

| Element | Old | New |
|---------|-----|-----|
| Panel padding | Mixed 8-12px | Consistent 12px |
| Section list item gap | Tight | 8px |
| Toolbar height | ~36px | 40px |
| Widget tree indent | 12px | 16px |
| Property panel group gap | None | 16px |

## Component-Level Changes

### Widget Tree

- 6px colored dot per section using its type color
- Section type label at 80% opacity of its type color, 100% on hover
- Drag handle: `ide.text-dim` grip dots, `ide.text` on hover
- Group headers: uppercase 10px `ide.text-dim`, chevron, section count badge in `bg-ide-surface`

### Canvas Toolbar

- Mode switcher: pill-shaped toggle, active state `bg-ide-accent text-white`
- Device/zoom/theme toggle buttons: `bg-ide-surface` on hover, `ide.text` icons

### Properties Panel

- Input fields: `bg-ide-bg` with `border-ide-border`, focus ring `ring-1 ring-ide-accent/50`
- Section headers: left 3px border in section's type color
- Group spacing: 16px between property groups

### Selection & Focus

- Selected item: `bg-ide-surface` + left 3px accent border
- Focus ring: `ring-1 ring-ide-accent/50`
- Active tab: bottom 2px accent border (existing pattern)

### Scrollbars

- Thumb color: `#2e2f3a` (visible on new bg)
- Keep thin width

### Base Styles (index.css)

- Body bg: `#1a1b23`
- Body color: `#ede9e3`
- dot-grid pattern: update to match new bg

## Files Affected

All changes within `packages/builder/`:

1. `tailwind.config.js` — update all `ide.*` color tokens, add `ide.surface`, `ide.accent-dim`
2. `src/index.css` — update body bg/color, scrollbar colors, dot-grid pattern
3. `src/components/WidgetTree.tsx` — section color dots, spacing, font sizes
4. `src/components/SectionCanvas.tsx` — toolbar pill toggle, spacing
5. `src/components/Toolbar.tsx` — toolbar height, hover states
6. `src/components/PropertiesPanel.tsx` — input styling, section color borders, group spacing
7. Any component with hardcoded colors that should reference tokens

## Out of Scope

- No data model changes
- No new features or components
- No schema/preview/export/mcp-server package changes
- No structural refactoring
