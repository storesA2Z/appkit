# Warm Studio Design Refresh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the AppKit Builder UI with a "Warm Studio" theme — softer dark base, warm gray text, multi-accent section colors, tighter spacing.

**Architecture:** Pure visual/CSS change. Update Tailwind tokens in `tailwind.config.js`, base styles in `index.css`, then sweep all builder components to use new tokens and fix unstyled inputs. A new `section-colors.ts` constants file provides the section type color map reused by WidgetTree and PropertiesPanel.

**Tech Stack:** Tailwind CSS (custom theme), React, TypeScript

---

### Task 1: Create section color constants

**Files:**
- Create: `packages/builder/src/constants/section-colors.ts`

- [ ] **Step 1: Create the section colors map**

```typescript
// packages/builder/src/constants/section-colors.ts
import type { SectionType } from '@appkit/schema';

export const SECTION_COLORS: Record<SectionType, string> = {
  banner: '#f97066',
  hero: '#f472b6',
  categories: '#fbbf24',
  products: '#2dd4bf',
  collections: '#38bdf8',
  flash_sale: '#fb923c',
  reviews: '#a3e635',
  video: '#a78bfa',
  offer: '#f9a8d4',
  header: '#60a5fa',
  tabs: '#22d3ee',
  marquee: '#34d399',
  custom: '#94a3b8',
};
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /tmp/appkit-clean && npx tsc --noEmit -p packages/builder/tsconfig.json 2>&1 | head -20`
Expected: No errors (or only pre-existing ones unrelated to this file)

- [ ] **Step 3: Commit**

```bash
git add packages/builder/src/constants/section-colors.ts
git commit -m "feat: add section type color constants for Warm Studio theme"
```

---

### Task 2: Update Tailwind tokens

**Files:**
- Modify: `packages/builder/tailwind.config.js`

- [ ] **Step 1: Replace the entire `ide` color block**

In `packages/builder/tailwind.config.js`, replace the `ide: { ... }` block (lines 18–33) with:

```javascript
        ide: {
          bg: '#1a1b23',
          panel: '#1f2029',
          toolbar: '#262730',
          surface: '#2a2b35',
          border: '#2e2f3a',
          'border-bright': 'rgba(255,255,255,0.12)',
          hover: '#2a2b35',
          active: 'rgba(255,255,255,0.08)',
          text: '#a8a29e',
          'text-dim': '#6b6560',
          'text-bright': '#ede9e3',
          'text-muted': '#857f78',
          accent: '#6366f1',
          'accent-dim': 'rgba(99,102,241,0.15)',
          'accent-border': 'rgba(99,102,241,0.3)',
        },
```

- [ ] **Step 2: Update box-shadow `glow` and `device` to use new accent**

Replace the `boxShadow` block (lines 36–40) with:

```javascript
      boxShadow: {
        'panel': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'device': '0 0 60px rgba(99,102,241,0.08), 0 20px 60px rgba(0,0,0,0.4)',
        'glow': '0 0 12px rgba(99,102,241,0.3)',
        'dropdown': '0 12px 40px rgba(0,0,0,0.3)',
      },
```

- [ ] **Step 3: Verify Tailwind config is valid**

Run: `cd /tmp/appkit-clean && node -e "const c = require('./packages/builder/tailwind.config.js'); console.log('OK', Object.keys(c.theme.extend.colors.ide))"`
Expected: `OK` followed by the token names

- [ ] **Step 4: Commit**

```bash
git add packages/builder/tailwind.config.js
git commit -m "style: update Tailwind ide tokens to Warm Studio palette"
```

---

### Task 3: Update base styles

**Files:**
- Modify: `packages/builder/src/index.css`

- [ ] **Step 1: Update body colors**

Replace lines 12–13:
```css
    background-color: #0f0f14;
    color: #e2e8f0;
```
with:
```css
    background-color: #1a1b23;
    color: #ede9e3;
```

- [ ] **Step 2: Update scrollbar-ide thumb colors**

Replace the `scrollbar-ide` section (lines 27–34):
```css
  .scrollbar-ide {
    scrollbar-width: thin;
    scrollbar-color: #2e2f3a transparent;
  }
  .scrollbar-ide::-webkit-scrollbar { width: 5px; }
  .scrollbar-ide::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-ide::-webkit-scrollbar-thumb { background-color: #2e2f3a; border-radius: 9999px; }
  .scrollbar-ide::-webkit-scrollbar-thumb:hover { background-color: #3a3b46; }
```

- [ ] **Step 3: Update dot-grid pattern**

Replace the `dot-grid` rule (lines 36–39):
```css
  .dot-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 20px 20px;
  }
```

- [ ] **Step 4: Verify the app still loads**

Run: `cd /tmp/appkit-clean && npx turbo run build --filter=@appkit/builder 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add packages/builder/src/index.css
git commit -m "style: update base styles to Warm Studio palette"
```

---

### Task 4: Fix PropertiesPanel header and delete button

**Files:**
- Modify: `packages/builder/src/components/PropertiesPanel.tsx:82,96`

- [ ] **Step 1: Fix the `border-surface-3` class**

In `packages/builder/src/components/PropertiesPanel.tsx`, replace line 82:
```tsx
      <div className="px-4 py-3 border-b border-surface-3 flex items-center justify-between">
```
with:
```tsx
      <div className="px-4 py-3 border-b border-ide-border flex items-center justify-between">
```

- [ ] **Step 2: Fix the delete button hover bg**

Replace line 96:
```tsx
          className="p-1.5 text-ide-text-dim hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
```
with:
```tsx
          className="p-1.5 text-ide-text-dim hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
```

- [ ] **Step 3: Add section type color accent to the header icon**

Replace lines 83–88 (the icon container):
```tsx
        <div className="flex items-center gap-2.5">
          {SectionIcon && (
            <div className="w-7 h-7 rounded-lg bg-ide-accent-dim flex items-center justify-center">
              <SectionIcon size={14} className="text-ide-accent" />
            </div>
          )}
```
with:
```tsx
        <div className="flex items-center gap-2.5">
          {SectionIcon && (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${SECTION_COLORS[section.type as SectionType] ?? '#6366f1'}20` }}
            >
              <SectionIcon size={14} style={{ color: SECTION_COLORS[section.type as SectionType] ?? '#6366f1' }} />
            </div>
          )}
```

- [ ] **Step 4: Add section color left border to the header**

Replace the outer header div:
```tsx
      <div className="px-4 py-3 border-b border-ide-border flex items-center justify-between">
```
with:
```tsx
      <div className="px-4 py-3 border-b border-ide-border flex items-center justify-between" style={{ borderLeftWidth: '3px', borderLeftColor: SECTION_COLORS[section.type as SectionType] ?? '#6366f1' }}>
```

- [ ] **Step 5: Change scrollbar-thin to scrollbar-ide on the scrollable area**

Replace line 103:
```tsx
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5 animate-fade-in">
```
with:
```tsx
      <div className="flex-1 overflow-y-auto scrollbar-ide p-4 space-y-5 animate-fade-in">
```

- [ ] **Step 6: Add the import for SECTION_COLORS at the top of the file**

Add after the existing imports:
```typescript
import { SECTION_COLORS } from '../constants/section-colors';
```

- [ ] **Step 7: Commit**

```bash
git add packages/builder/src/components/PropertiesPanel.tsx
git commit -m "style: apply Warm Studio tokens to PropertiesPanel"
```

---

### Task 5: Style all property input fields for dark theme

**Files:**
- Modify: All 14 files in `packages/builder/src/components/properties/`

The property components use unstyled `border rounded` classes on inputs, selects, and textareas. These render with white backgrounds on dark theme. Every occurrence needs dark-theme styling.

- [ ] **Step 1: Batch-fix all input/select/textarea classes**

Run this sed command to replace all unstyled form elements across all property files:

```bash
cd /tmp/appkit-clean

# Fix "text-sm border rounded-md" pattern (selects, most inputs)
find packages/builder/src/components/properties -name '*.tsx' -exec sed -i '' \
  's/text-sm border rounded-md/text-sm bg-ide-bg border border-ide-border rounded-md text-ide-text-bright focus:border-ide-accent focus:outline-none/g' {} +

# Fix "text-xs border rounded" pattern (banner/tabs/spacing smaller inputs)
find packages/builder/src/components/properties -name '*.tsx' -exec sed -i '' \
  's/text-xs border rounded"/text-xs bg-ide-bg border border-ide-border rounded text-ide-text-bright focus:border-ide-accent focus:outline-none"/g' {} +

# Fix the "p-2 border rounded-md" card containers
find packages/builder/src/components/properties -name '*.tsx' -exec sed -i '' \
  's/p-2 border rounded-md/p-2 border border-ide-border rounded-md bg-ide-panel/g' {} +
```

- [ ] **Step 2: Fix action button colors (text-blue-600, text-red-500)**

```bash
cd /tmp/appkit-clean

# Fix "+ Add" buttons: text-blue-600 → text-ide-accent
find packages/builder/src/components/properties -name '*.tsx' -exec sed -i '' \
  's/text-blue-600 hover:text-blue-800/text-ide-accent hover:text-ide-text-bright/g' {} +

# Fix "Remove" buttons: text-red-500 → text-red-400
find packages/builder/src/components/properties -name '*.tsx' -exec sed -i '' \
  's/text-red-500"/text-red-400"/g' {} +

# Fix CustomProperties blue info text
sed -i '' 's/text-blue-600 leading-relaxed/text-ide-accent leading-relaxed/g' \
  packages/builder/src/components/properties/CustomProperties.tsx

# Fix CustomProperties error styling
sed -i '' "s/border-red-300 bg-red-50/border-red-400 bg-red-500\/10/g" \
  packages/builder/src/components/properties/CustomProperties.tsx
```

- [ ] **Step 3: Fix property label text colors**

```bash
cd /tmp/appkit-clean

# Fix labels that use text-ide-text (old dim) — bump to readable
find packages/builder/src/components/properties -name '*.tsx' -exec sed -i '' \
  's/text-xs font-medium text-ide-text"/text-[11px] font-medium text-ide-text-bright"/g' {} +
```

- [ ] **Step 4: Verify files still compile**

Run: `cd /tmp/appkit-clean && npx tsc --noEmit -p packages/builder/tsconfig.json 2>&1 | head -20`
Expected: No new errors

- [ ] **Step 5: Commit**

```bash
cd /tmp/appkit-clean
git add packages/builder/src/components/properties/
git commit -m "style: dark-theme all property panel inputs for Warm Studio"
```

---

### Task 6: Fix remaining stale color classes across builder

**Files:**
- Modify: `packages/builder/src/components/BackendConfigPanel.tsx`
- Modify: `packages/builder/src/components/ThemeMetadataPanel.tsx`

- [ ] **Step 1: Fix border-surface-3 in BackendConfigPanel and ThemeMetadataPanel**

```bash
cd /tmp/appkit-clean
sed -i '' 's/border-surface-3/border-ide-border/g' \
  packages/builder/src/components/BackendConfigPanel.tsx \
  packages/builder/src/components/ThemeMetadataPanel.tsx
```

- [ ] **Step 2: Commit**

```bash
git add packages/builder/src/components/BackendConfigPanel.tsx packages/builder/src/components/ThemeMetadataPanel.tsx
git commit -m "style: replace stale surface-3 border classes with ide-border"
```

---

### Task 7: Update WidgetTree with section color dots and spacing

**Files:**
- Modify: `packages/builder/src/components/WidgetTree.tsx`

- [ ] **Step 1: Add SECTION_COLORS import**

Add after the existing imports at the top of `packages/builder/src/components/WidgetTree.tsx`:
```typescript
import { SECTION_COLORS } from '../constants/section-colors';
```

- [ ] **Step 2: Replace emoji icons with colored dots in ungrouped sections**

Replace the ungrouped section button content (lines 112–116):
```tsx
                  <GripVertical size={9} className="opacity-30 shrink-0" />
                  <span className="text-[9px]">{sectionIcons[section.type] ?? '📄'}</span>
                  <span className="truncate">{section.type}</span>
```
with:
```tsx
                  <GripVertical size={9} className="text-ide-text-dim hover:text-ide-text shrink-0" />
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: SECTION_COLORS[section.type] ?? '#94a3b8' }}
                  />
                  <span className="truncate text-[12px]" style={{ color: `${SECTION_COLORS[section.type] ?? '#94a3b8'}cc` }}>
                    {section.type.replace('_', ' ')}
                  </span>
```

- [ ] **Step 3: Same change for grouped sections**

Replace the grouped section button content (lines 85–89):
```tsx
                            <GripVertical size={9} className="opacity-30 shrink-0" />
                            <span className="text-[9px]">{sectionIcons[section.type] ?? '📄'}</span>
                            <span className="truncate">{section.type}</span>
```
with:
```tsx
                            <GripVertical size={9} className="text-ide-text-dim shrink-0" />
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: SECTION_COLORS[section.type] ?? '#94a3b8' }}
                            />
                            <span className="truncate text-[12px]" style={{ color: `${SECTION_COLORS[section.type] ?? '#94a3b8'}cc` }}>
                              {section.type.replace('_', ' ')}
                            </span>
```

- [ ] **Step 4: Update section picker dropdown to use colored dots**

Replace the section picker button content (lines 136–138):
```tsx
                    <span className="text-[9px]">{sectionIcons[type]}</span>
                    <span className="capitalize">{type.replace('_', ' ')}</span>
```
with:
```tsx
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: SECTION_COLORS[type] ?? '#94a3b8' }}
                    />
                    <span className="capitalize">{type.replace('_', ' ')}</span>
```

- [ ] **Step 5: Update widget tree indent from pl-4 to pl-5**

Replace both instances of `className="pl-4"` (lines 61 and 76) with `className="pl-5"`.

- [ ] **Step 6: Update group header styling**

Replace the group header div (lines 69–73):
```tsx
                  <div className="flex items-center gap-1.5 px-1.5 py-1 text-ide-text rounded hover:bg-ide-hover cursor-pointer">
                    {group.collapsed ? <ChevronRight size={9} /> : <ChevronDown size={9} />}
                    <span className="text-[9px]">📦</span>
                    <span className="text-ide-text-muted">{group.name}</span>
                    <span className="ml-auto text-[8px] text-ide-text-dim">{groupSections.length}</span>
```
with:
```tsx
                  <div className="flex items-center gap-1.5 px-1.5 py-1.5 text-ide-text rounded hover:bg-ide-hover cursor-pointer">
                    {group.collapsed ? <ChevronRight size={9} /> : <ChevronDown size={9} />}
                    <span className="uppercase text-[10px] tracking-wider text-ide-text-dim">{group.name}</span>
                    <span className="ml-auto text-[8px] text-ide-text-dim bg-ide-surface px-1 py-0.5 rounded">{groupSections.length}</span>
```

- [ ] **Step 7: Add gap between section items**

Replace `<div className="pl-5">` (after step 5 changes) for the ungrouped sections container. Wrap the ungrouped section list in a container with gap:

Find:
```tsx
          <div className="pl-5">
            {groups.map((group) => {
```

The ungrouped sections after the groups loop should use `space-y-1` for 8px gaps. Add `space-y-1` class to both the group's inner section list and the ungrouped section list containers.

In the section list after groups (around line 99), wrap the ungrouped sections map in:
```tsx
          <div className="space-y-1">
            {ungroupedSections.map((section, i) => (
```
And close the div after the map.

- [ ] **Step 8: Commit**

```bash
git add packages/builder/src/components/WidgetTree.tsx
git commit -m "style: add section color dots and improved spacing to WidgetTree"
```

---

### Task 8: Update Toolbar to Warm Studio

**Files:**
- Modify: `packages/builder/src/components/Toolbar.tsx`

- [ ] **Step 1: Update toolbar height from h-10 to h-11**

Replace line 53:
```tsx
    <header className="h-10 bg-ide-toolbar border-b border-ide-border flex items-center px-3 justify-between shrink-0 z-10">
```
with:
```tsx
    <header className="h-11 bg-ide-toolbar border-b border-ide-border flex items-center px-4 justify-between shrink-0 z-10">
```

- [ ] **Step 2: Update mode switcher to pill style**

Replace the mode switcher block (lines 80–89):
```tsx
      <div data-tour="mode-switcher" className="flex bg-ide-hover rounded-md p-0.5">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`px-3 py-1 text-[11px] font-medium rounded transition-all ${
              mode === m.id ? 'bg-ide-accent-dim text-ide-accent' : 'text-ide-text hover:text-ide-text-bright'
            }`}
          >{m.label}</button>
        ))}
      </div>
```
with:
```tsx
      <div data-tour="mode-switcher" className="flex bg-ide-surface rounded-full p-0.5">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`px-3.5 py-1 text-[11px] font-medium rounded-full transition-all ${
              mode === m.id ? 'bg-ide-accent text-white shadow-glow' : 'text-ide-text hover:text-ide-text-bright'
            }`}
          >{m.label}</button>
        ))}
      </div>
```

- [ ] **Step 3: Update the logo gradient to use new accent**

Replace line 56:
```tsx
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-ide-accent to-brand-700 flex items-center justify-center">
```
with:
```tsx
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-ide-accent to-purple-700 flex items-center justify-center">
```

- [ ] **Step 4: Commit**

```bash
git add packages/builder/src/components/Toolbar.tsx
git commit -m "style: apply Warm Studio pill mode switcher and spacing to Toolbar"
```

---

### Task 9: Update CanvasToolbar

**Files:**
- Modify: `packages/builder/src/components/CanvasToolbar.tsx`

- [ ] **Step 1: Update toolbar background and height**

Replace line 25:
```tsx
    <div className="h-8 bg-ide-hover border-b border-ide-border flex items-center justify-between px-2.5 text-[10px] text-ide-text shrink-0">
```
with:
```tsx
    <div className="h-9 bg-ide-toolbar border-b border-ide-border flex items-center justify-between px-3 text-[10px] text-ide-text shrink-0">
```

- [ ] **Step 2: Update button active states to use ide-surface**

Replace all instances of `bg-ide-active` with `bg-ide-surface` in CanvasToolbar.tsx:

```bash
sed -i '' 's/bg-ide-active/bg-ide-surface/g' packages/builder/src/components/CanvasToolbar.tsx
```

- [ ] **Step 3: Commit**

```bash
git add packages/builder/src/components/CanvasToolbar.tsx
git commit -m "style: update CanvasToolbar to Warm Studio tokens"
```

---

### Task 10: Update App.tsx right panel tabs and spacing

**Files:**
- Modify: `packages/builder/src/App.tsx`

- [ ] **Step 1: Update right panel tab bar padding**

Replace lines 96–107 (the tab bar):
```tsx
              <div className="flex border-b border-ide-border text-[10px]">
                {(['props', 'style', 'css', 'ai'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setRightTab(tab)}
                    className={`flex-1 py-2 text-center capitalize transition-colors ${
                      rightTab === tab
                        ? 'text-ide-accent border-b-[1.5px] border-ide-accent font-semibold'
                        : 'text-ide-text-dim hover:text-ide-text'
                    }`}
                  >{tab}</button>
                ))}
              </div>
```
with:
```tsx
              <div className="flex border-b border-ide-border text-[10px]">
                {(['props', 'style', 'css', 'ai'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setRightTab(tab)}
                    className={`flex-1 py-2.5 text-center capitalize transition-colors ${
                      rightTab === tab
                        ? 'text-ide-accent border-b-2 border-ide-accent font-semibold'
                        : 'text-ide-text-dim hover:text-ide-text'
                    }`}
                  >{tab}</button>
                ))}
              </div>
```

- [ ] **Step 2: Commit**

```bash
git add packages/builder/src/App.tsx
git commit -m "style: adjust right panel tab spacing for Warm Studio"
```

---

### Task 11: Run full test suite and verify build

**Files:** None (verification only)

- [ ] **Step 1: Run all tests**

Run: `cd /tmp/appkit-clean && npx turbo run test 2>&1 | tail -30`
Expected: All test suites pass

- [ ] **Step 2: Run builder build**

Run: `cd /tmp/appkit-clean && npx turbo run build --filter=@appkit/builder 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 3: If any test failures, fix and re-run**

Test failures should be rare since this is a CSS-only change. If the Tailwind config has a syntax error, fix it. If a snapshot test exists, update the snapshot.

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve test/build issues from Warm Studio refresh"
```
