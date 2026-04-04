# AppKit V3: Code Editor + Preview — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an embedded code editor (OpenVSCode Server) and live Expo Snack preview to AppKit in a Bolt-style side-by-side layout, with a collapsible AI chat sidebar.

**Architecture:** New `packages/editor` Vite+React app that embeds OpenVSCode Server (iframe on port 3100) and Expo Snack (iframe) in resizable panes. On "New Project", scaffolds a real Expo Router project to `~/.appkit/projects/`. Current visual builder loaded as Design mode via toggle. AI chat reuses existing `@appkit/ai` streaming.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS (Warm Studio tokens), Allotment (resizable panes), OpenVSCode Server, Expo Snack embed API, chokidar (file watching), `@appkit/ai` (Claude streaming)

---

## File Structure

### New: `packages/editor/`

```
packages/editor/
├── src/
│   ├── App.tsx                         # Shell layout
│   ├── main.tsx                        # React entry
│   ├── index.css                       # Base styles (reuse Warm Studio)
│   ├── components/
│   │   ├── Toolbar.tsx                 # Top bar: logo, project, mode toggle, actions
│   │   ├── VSCodePane.tsx              # OpenVSCode Server iframe wrapper
│   │   ├── PreviewPane.tsx             # Expo Snack iframe + DeviceFrame
│   │   ├── AiChatSidebar.tsx           # Collapsible Claude chat
│   │   └── StatusBar.tsx               # Bottom bar: connection status
│   ├── services/
│   │   ├── vscode-server.ts            # Start/stop OpenVSCode Server (Node API)
│   │   ├── file-watcher.ts             # chokidar → Snack sync
│   │   ├── snack-bridge.ts             # postMessage API to Snack iframe
│   │   └── project-manager.ts          # Create/open/list projects
│   ├── store/
│   │   └── editor-store.ts             # Zustand store for editor state
│   └── types.ts                        # Shared types
├── server/
│   └── dev-server.ts                   # Express server: starts Vite + OpenVSCode + file watcher
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
└── package.json
```

### New: `packages/create-appkit/templates/expo-router-tabs/`

```
templates/expo-router-tabs/
├── app/
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── explore.tsx
│       └── profile.tsx
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
├── constants/
│   └── theme.ts
├── assets/
│   └── .gitkeep
├── app.json.tmpl
├── package.json.tmpl
├── tsconfig.json
└── .appkit.json.tmpl
```

### Modified: `packages/schema/src/types.ts`

Add `AppkitProjectMeta` type for `.appkit.json`.

### Modified: `packages/create-appkit/src/index.ts`

Rewrite to scaffold from templates directory with variable substitution.

---

### Task 1: Scaffold `packages/editor` package

**Files:**
- Create: `packages/editor/package.json`
- Create: `packages/editor/tsconfig.json`
- Create: `packages/editor/tsconfig.node.json`
- Create: `packages/editor/vite.config.ts`
- Create: `packages/editor/tailwind.config.js`
- Create: `packages/editor/postcss.config.js`
- Create: `packages/editor/index.html`
- Create: `packages/editor/src/main.tsx`
- Create: `packages/editor/src/index.css`
- Create: `packages/editor/src/types.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@appkit/editor",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "tsx server/dev-server.ts",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@appkit/ai": "workspace:*",
    "@appkit/builder": "workspace:*",
    "@appkit/preview": "workspace:*",
    "@appkit/schema": "workspace:*",
    "allotment": "^1.20.5",
    "chokidar": "^4.0.0",
    "express": "^4.21.0",
    "lucide-react": "^0.460.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.0",
    "vite": "^6.0.0",
    "vitest": "^3.1.0"
  }
}
```

Write this to `packages/editor/package.json`.

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["server", "vite.config.ts"]
}
```

- [ ] **Step 4: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5200, open: true },
});
```

- [ ] **Step 5: Create tailwind.config.js**

Copy the Warm Studio tokens from `packages/builder/tailwind.config.js` — same config, different content path:

```javascript
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
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
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'glow': '0 0 12px rgba(99,102,241,0.3)',
        'dropdown': '0 12px 40px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 7: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AppKit — Code Editor</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create src/main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 9: Create src/index.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #1a1b23;
    color: #ede9e3;
    margin: 0;
    overflow: hidden;
  }
}

@layer utilities {
  .scrollbar-ide {
    scrollbar-width: thin;
    scrollbar-color: #2e2f3a transparent;
  }
  .scrollbar-ide::-webkit-scrollbar { width: 5px; }
  .scrollbar-ide::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-ide::-webkit-scrollbar-thumb { background-color: #2e2f3a; border-radius: 9999px; }
  .scrollbar-ide::-webkit-scrollbar-thumb:hover { background-color: #3a3b46; }
}
```

- [ ] **Step 10: Create src/types.ts**

```typescript
export type EditorMode = 'design' | 'code';

export interface AppkitProject {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  schemaVersion: string;
}

export interface EditorState {
  mode: EditorMode;
  currentProject: AppkitProject | null;
  projects: AppkitProject[];
  aiSidebarOpen: boolean;
  vscodePort: number;
  snackConnected: boolean;
}
```

- [ ] **Step 11: Create a minimal src/App.tsx placeholder**

```tsx
import React from 'react';

export default function App() {
  return (
    <div className="h-screen flex items-center justify-center bg-ide-bg text-ide-text-bright">
      <p className="text-lg font-mono">AppKit Editor — loading...</p>
    </div>
  );
}
```

- [ ] **Step 12: Install dependencies and verify build**

Run:
```bash
cd /tmp/appkit-clean && pnpm install && npx turbo run build --filter=@appkit/editor 2>&1 | tail -10
```
Expected: Build succeeds

- [ ] **Step 13: Commit**

```bash
git add packages/editor/
git commit -m "feat: scaffold @appkit/editor package with Vite + Tailwind"
```

---

### Task 2: Add `AppkitProjectMeta` type to schema

**Files:**
- Modify: `packages/schema/src/types.ts`
- Modify: `packages/schema/src/index.ts`
- Test: `packages/schema/src/__tests__/types.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `packages/schema/src/__tests__/types.test.ts`:

```typescript
import {
  // ... existing imports ...
  type AppkitProjectMeta,
} from '../index';

// ... existing tests ...

describe('AppkitProjectMeta', () => {
  it('should accept valid project metadata', () => {
    const meta: AppkitProjectMeta = {
      name: 'My App',
      id: 'proj_123',
      schemaVersion: '3.0.0',
      createdAt: '2026-04-04T00:00:00Z',
      template: 'expo-router-tabs',
    };
    expect(meta.name).toBe('My App');
    expect(meta.template).toBe('expo-router-tabs');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /tmp/appkit-clean && npx turbo run test --filter=@appkit/schema 2>&1 | tail -20`
Expected: FAIL — `AppkitProjectMeta` not exported

- [ ] **Step 3: Add the type to types.ts**

Add at the end of `packages/schema/src/types.ts`:

```typescript
export interface AppkitProjectMeta {
  name: string;
  id: string;
  schemaVersion: string;
  createdAt: string;
  template: string;
}
```

- [ ] **Step 4: Export from index.ts**

Add `AppkitProjectMeta` to the exports in `packages/schema/src/index.ts`.

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /tmp/appkit-clean && npx turbo run test --filter=@appkit/schema 2>&1 | tail -20`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/schema/
git commit -m "feat: add AppkitProjectMeta type to schema"
```

---

### Task 3: Create Expo Router template

**Files:**
- Create: `packages/create-appkit/templates/expo-router-tabs/app/_layout.tsx`
- Create: `packages/create-appkit/templates/expo-router-tabs/app/(tabs)/_layout.tsx`
- Create: `packages/create-appkit/templates/expo-router-tabs/app/(tabs)/index.tsx`
- Create: `packages/create-appkit/templates/expo-router-tabs/app/(tabs)/explore.tsx`
- Create: `packages/create-appkit/templates/expo-router-tabs/app/(tabs)/profile.tsx`
- Create: `packages/create-appkit/templates/expo-router-tabs/components/ui/Button.tsx`
- Create: `packages/create-appkit/templates/expo-router-tabs/components/ui/Card.tsx`
- Create: `packages/create-appkit/templates/expo-router-tabs/components/ui/Input.tsx`
- Create: `packages/create-appkit/templates/expo-router-tabs/constants/theme.ts`
- Create: `packages/create-appkit/templates/expo-router-tabs/assets/.gitkeep`
- Create: `packages/create-appkit/templates/expo-router-tabs/app.json.tmpl`
- Create: `packages/create-appkit/templates/expo-router-tabs/package.json.tmpl`
- Create: `packages/create-appkit/templates/expo-router-tabs/tsconfig.json`
- Create: `packages/create-appkit/templates/expo-router-tabs/.appkit.json.tmpl`

- [ ] **Step 1: Create app/_layout.tsx**

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- [ ] **Step 2: Create app/(tabs)/_layout.tsx**

```tsx
import { Tabs } from 'expo-router';
import { Home, Compass, User } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
```

- [ ] **Step 3: Create app/(tabs)/index.tsx**

```tsx
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to your app</Text>
        <Text style={styles.subtitle}>Start building something amazing</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24 },
  header: { paddingTop: 60, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 16, color: theme.colors.textMuted, marginTop: 8 },
});
```

- [ ] **Step 4: Create app/(tabs)/explore.tsx**

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
});
```

- [ ] **Step 5: Create app/(tabs)/profile.tsx**

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
});
```

- [ ] **Step 6: Create components/ui/Button.tsx**

```tsx
import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.base, isPrimary ? styles.primary : styles.secondary, style]}
    >
      <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: theme.colors.accent },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border },
  text: { fontSize: 14, fontWeight: '600' },
  textPrimary: { color: '#ffffff' },
  textSecondary: { color: theme.colors.text },
});
```

- [ ] **Step 7: Create components/ui/Card.tsx**

```tsx
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
```

- [ ] **Step 8: Create components/ui/Input.tsx**

```tsx
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { theme } from '../../constants/theme';

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={theme.colors.textMuted}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
});
```

- [ ] **Step 9: Create constants/theme.ts**

```typescript
export const theme = {
  colors: {
    primary: '#111827',
    accent: '#6366f1',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    white: '#ffffff',
    black: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

export type Theme = typeof theme;
```

- [ ] **Step 10: Create template config files**

`packages/create-appkit/templates/expo-router-tabs/app.json.tmpl`:
```json
{
  "expo": {
    "name": "{{PROJECT_NAME}}",
    "slug": "{{PROJECT_SLUG}}",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "{{PROJECT_SLUG}}",
    "platforms": ["ios", "android"],
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

`packages/create-appkit/templates/expo-router-tabs/package.json.tmpl`:
```json
{
  "name": "{{PROJECT_SLUG}}",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-safe-area-context": "^4.14.0",
    "react-native-screens": "~4.4.0",
    "lucide-react-native": "^0.460.0",
    "react-native-svg": "^15.9.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "^5.8.0"
  }
}
```

`packages/create-appkit/templates/expo-router-tabs/tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

`packages/create-appkit/templates/expo-router-tabs/.appkit.json.tmpl`:
```json
{
  "name": "{{PROJECT_NAME}}",
  "id": "{{PROJECT_ID}}",
  "schemaVersion": "3.0.0",
  "createdAt": "{{CREATED_AT}}",
  "template": "expo-router-tabs"
}
```

`packages/create-appkit/templates/expo-router-tabs/assets/.gitkeep`: empty file.

- [ ] **Step 11: Commit**

```bash
git add packages/create-appkit/templates/
git commit -m "feat: add Expo Router tabs template for project scaffolding"
```

---

### Task 4: Rewrite `create-appkit` scaffolder with template support

**Files:**
- Modify: `packages/create-appkit/src/index.ts`
- Create: `packages/create-appkit/src/scaffold.ts`
- Test: `packages/create-appkit/src/__tests__/scaffold.test.ts`

- [ ] **Step 1: Create scaffold.ts**

```typescript
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, copyFileSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

interface ScaffoldOptions {
  projectName: string;
  targetDir: string;
  template?: string;
}

export function scaffoldProject({ projectName, targetDir, template = 'expo-router-tabs' }: ScaffoldOptions): string {
  const templateDir = resolve(dirname(new URL(import.meta.url).pathname), '../../templates', template);

  if (!existsSync(templateDir)) {
    throw new Error(`Template "${template}" not found at ${templateDir}`);
  }

  mkdirSync(targetDir, { recursive: true });

  const vars: Record<string, string> = {
    '{{PROJECT_NAME}}': projectName,
    '{{PROJECT_SLUG}}': projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    '{{PROJECT_ID}}': `proj_${randomUUID().slice(0, 8)}`,
    '{{CREATED_AT}}': new Date().toISOString(),
  };

  copyDirRecursive(templateDir, targetDir, vars);

  return targetDir;
}

function copyDirRecursive(src: string, dest: string, vars: Record<string, string>): void {
  mkdirSync(dest, { recursive: true });

  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, join(dest, entry), vars);
    } else if (entry.endsWith('.tmpl')) {
      const destName = entry.replace('.tmpl', '');
      let content = readFileSync(srcPath, 'utf-8');
      for (const [key, value] of Object.entries(vars)) {
        content = content.replaceAll(key, value);
      }
      writeFileSync(join(dest, destName), content);
    } else {
      copyFileSync(srcPath, join(dest, entry));
    }
  }
}
```

- [ ] **Step 2: Write test**

Create `packages/create-appkit/src/__tests__/scaffold.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scaffoldProject } from '../scaffold';

describe('scaffoldProject', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'appkit-scaffold-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('creates project directory with template files', () => {
    const targetDir = join(dir, 'my-app');
    scaffoldProject({ projectName: 'My App', targetDir });

    expect(existsSync(join(targetDir, 'app', '_layout.tsx'))).toBe(true);
    expect(existsSync(join(targetDir, 'app', '(tabs)', '_layout.tsx'))).toBe(true);
    expect(existsSync(join(targetDir, 'app', '(tabs)', 'index.tsx'))).toBe(true);
    expect(existsSync(join(targetDir, 'components', 'ui', 'Button.tsx'))).toBe(true);
    expect(existsSync(join(targetDir, 'constants', 'theme.ts'))).toBe(true);
  });

  it('substitutes template variables in .tmpl files', () => {
    const targetDir = join(dir, 'test-app');
    scaffoldProject({ projectName: 'Test App', targetDir });

    const appJson = JSON.parse(readFileSync(join(targetDir, 'app.json'), 'utf-8'));
    expect(appJson.expo.name).toBe('Test App');
    expect(appJson.expo.slug).toBe('test-app');

    const appkitJson = JSON.parse(readFileSync(join(targetDir, '.appkit.json'), 'utf-8'));
    expect(appkitJson.name).toBe('Test App');
    expect(appkitJson.template).toBe('expo-router-tabs');
    expect(appkitJson.id).toMatch(/^proj_/);
  });

  it('creates package.json with expo dependencies', () => {
    const targetDir = join(dir, 'expo-app');
    scaffoldProject({ projectName: 'Expo App', targetDir });

    const pkg = JSON.parse(readFileSync(join(targetDir, 'package.json'), 'utf-8'));
    expect(pkg.dependencies.expo).toBeDefined();
    expect(pkg.dependencies['expo-router']).toBeDefined();
    expect(pkg.scripts.start).toBe('expo start');
  });
});
```

- [ ] **Step 3: Add vitest to create-appkit**

Add to `packages/create-appkit/package.json`:
```json
{
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "vitest": "^3.1.0"
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd /tmp/appkit-clean && pnpm install && npx turbo run test --filter=create-appkit 2>&1 | tail -20`
Expected: 3 tests pass

- [ ] **Step 5: Update index.ts to use scaffoldProject**

Replace `packages/create-appkit/src/index.ts`:

```typescript
#!/usr/bin/env node

import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { scaffoldProject } from './scaffold';

const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
  console.log('Usage: create-appkit <project-name>');
  console.log('');
  console.log('Example:');
  console.log('  npm create appkit@latest my-app');
  process.exit(1);
}

const targetDir = resolve(process.cwd(), projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'));

if (existsSync(targetDir)) {
  console.error(`Error: Directory already exists: ${targetDir}`);
  process.exit(1);
}

scaffoldProject({ projectName, targetDir });

console.log(`\nCreated "${projectName}" — a React Native app powered by Expo.\n`);
console.log('Next steps:\n');
console.log(`  cd ${projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`);
console.log('  npm install');
console.log('  npx expo start');
console.log('');
```

- [ ] **Step 6: Commit**

```bash
git add packages/create-appkit/
git commit -m "feat: rewrite create-appkit with Expo Router template scaffolding"
```

---

### Task 5: Create Zustand editor store

**Files:**
- Create: `packages/editor/src/store/editor-store.ts`
- Test: `packages/editor/src/store/__tests__/editor-store.test.ts`

- [ ] **Step 1: Write the test**

Create `packages/editor/src/store/__tests__/editor-store.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../editor-store';

describe('editor store', () => {
  beforeEach(() => {
    useEditorStore.setState(useEditorStore.getInitialState());
  });

  it('starts in code mode with no project', () => {
    const state = useEditorStore.getState();
    expect(state.mode).toBe('code');
    expect(state.currentProject).toBeNull();
    expect(state.aiSidebarOpen).toBe(false);
  });

  it('switches mode', () => {
    useEditorStore.getState().setMode('design');
    expect(useEditorStore.getState().mode).toBe('design');
  });

  it('toggles AI sidebar', () => {
    useEditorStore.getState().toggleAiSidebar();
    expect(useEditorStore.getState().aiSidebarOpen).toBe(true);
    useEditorStore.getState().toggleAiSidebar();
    expect(useEditorStore.getState().aiSidebarOpen).toBe(false);
  });

  it('sets current project', () => {
    const project = { id: 'p1', name: 'Test', path: '/tmp/test', createdAt: '2026-01-01', schemaVersion: '3.0.0' };
    useEditorStore.getState().setCurrentProject(project);
    expect(useEditorStore.getState().currentProject).toEqual(project);
  });

  it('sets vscode ready', () => {
    useEditorStore.getState().setVSCodeReady(true);
    expect(useEditorStore.getState().vscodeReady).toBe(true);
  });

  it('sets snack connected', () => {
    useEditorStore.getState().setSnackConnected(true);
    expect(useEditorStore.getState().snackConnected).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /tmp/appkit-clean && npx turbo run test --filter=@appkit/editor 2>&1 | tail -20`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the store**

Create `packages/editor/src/store/editor-store.ts`:

```typescript
import { create } from 'zustand';

export type EditorMode = 'design' | 'code';

export interface AppkitProject {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  schemaVersion: string;
}

interface EditorStoreState {
  mode: EditorMode;
  currentProject: AppkitProject | null;
  projects: AppkitProject[];
  aiSidebarOpen: boolean;
  vscodeReady: boolean;
  snackConnected: boolean;
  vscodePort: number;
}

interface EditorStoreActions {
  setMode: (mode: EditorMode) => void;
  toggleAiSidebar: () => void;
  setCurrentProject: (project: AppkitProject | null) => void;
  setProjects: (projects: AppkitProject[]) => void;
  setVSCodeReady: (ready: boolean) => void;
  setSnackConnected: (connected: boolean) => void;
}

export const useEditorStore = create<EditorStoreState & EditorStoreActions>()((set) => ({
  mode: 'code',
  currentProject: null,
  projects: [],
  aiSidebarOpen: false,
  vscodeReady: false,
  snackConnected: false,
  vscodePort: 3100,

  setMode: (mode) => set({ mode }),
  toggleAiSidebar: () => set((s) => ({ aiSidebarOpen: !s.aiSidebarOpen })),
  setCurrentProject: (project) => set({ currentProject: project }),
  setProjects: (projects) => set({ projects }),
  setVSCodeReady: (ready) => set({ vscodeReady: ready }),
  setSnackConnected: (connected) => set({ snackConnected: connected }),
}));
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /tmp/appkit-clean && npx turbo run test --filter=@appkit/editor 2>&1 | tail -20`
Expected: 6 tests pass

- [ ] **Step 5: Commit**

```bash
git add packages/editor/src/store/
git commit -m "feat: add Zustand editor store for AppKit editor state"
```

---

### Task 6: Build project-manager service

**Files:**
- Create: `packages/editor/src/services/project-manager.ts`
- Test: `packages/editor/src/services/__tests__/project-manager.test.ts`

- [ ] **Step 1: Write the test**

Create `packages/editor/src/services/__tests__/project-manager.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ProjectManager } from '../project-manager';

describe('ProjectManager', () => {
  let baseDir: string;
  let pm: ProjectManager;

  beforeEach(() => {
    baseDir = mkdtempSync(join(tmpdir(), 'appkit-pm-'));
    pm = new ProjectManager(baseDir);
  });

  afterEach(() => {
    rmSync(baseDir, { recursive: true, force: true });
  });

  it('creates a new project with Expo files', () => {
    const project = pm.createProject('My First App');
    expect(existsSync(project.path)).toBe(true);
    expect(existsSync(join(project.path, 'app', '_layout.tsx'))).toBe(true);
    expect(existsSync(join(project.path, 'package.json'))).toBe(true);
    expect(existsSync(join(project.path, '.appkit.json'))).toBe(true);
    expect(project.name).toBe('My First App');
  });

  it('lists projects', () => {
    pm.createProject('App One');
    pm.createProject('App Two');
    const projects = pm.listProjects();
    expect(projects).toHaveLength(2);
    expect(projects.map((p) => p.name)).toContain('App One');
    expect(projects.map((p) => p.name)).toContain('App Two');
  });

  it('opens an existing project', () => {
    const created = pm.createProject('Test App');
    const opened = pm.openProject(created.id);
    expect(opened).not.toBeNull();
    expect(opened!.name).toBe('Test App');
  });

  it('returns null for non-existent project', () => {
    expect(pm.openProject('nonexistent')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /tmp/appkit-clean && npx turbo run test --filter=@appkit/editor 2>&1 | tail -20`
Expected: FAIL — ProjectManager not found

- [ ] **Step 3: Implement project-manager.ts**

Create `packages/editor/src/services/project-manager.ts`:

```typescript
import { existsSync, readdirSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { scaffoldProject } from 'create-appkit/scaffold';
import type { AppkitProject } from '../store/editor-store';

export class ProjectManager {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    mkdirSync(baseDir, { recursive: true });
  }

  createProject(name: string): AppkitProject {
    const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const targetDir = join(this.baseDir, slug);

    scaffoldProject({ projectName: name, targetDir });

    const meta = JSON.parse(readFileSync(join(targetDir, '.appkit.json'), 'utf-8'));

    return {
      id: meta.id,
      name: meta.name,
      path: targetDir,
      createdAt: meta.createdAt,
      schemaVersion: meta.schemaVersion,
    };
  }

  listProjects(): AppkitProject[] {
    if (!existsSync(this.baseDir)) return [];

    const entries = readdirSync(this.baseDir, { withFileTypes: true });
    const projects: AppkitProject[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const metaPath = join(this.baseDir, entry.name, '.appkit.json');
      if (!existsSync(metaPath)) continue;

      const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
      projects.push({
        id: meta.id,
        name: meta.name,
        path: join(this.baseDir, entry.name),
        createdAt: meta.createdAt,
        schemaVersion: meta.schemaVersion,
      });
    }

    return projects;
  }

  openProject(id: string): AppkitProject | null {
    const projects = this.listProjects();
    return projects.find((p) => p.id === id) ?? null;
  }
}
```

- [ ] **Step 4: Export scaffoldProject from create-appkit package**

Update `packages/create-appkit/package.json` to add exports:
```json
{
  "exports": {
    ".": "./dist/index.js",
    "./scaffold": "./dist/scaffold.js"
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /tmp/appkit-clean && pnpm install && npx turbo run test --filter=@appkit/editor 2>&1 | tail -20`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add packages/editor/src/services/ packages/create-appkit/package.json
git commit -m "feat: add ProjectManager service for creating and listing Expo projects"
```

---

### Task 7: Build snack-bridge service

**Files:**
- Create: `packages/editor/src/services/snack-bridge.ts`

- [ ] **Step 1: Create the Snack bridge**

```typescript
export interface SnackFile {
  contents: string;
  type: 'CODE' | 'ASSET';
}

export type SnackFiles = Record<string, SnackFile>;

export class SnackBridge {
  private iframe: HTMLIFrameElement | null = null;
  private origin = 'https://snack.expo.dev';

  attach(iframe: HTMLIFrameElement): void {
    this.iframe = iframe;
  }

  detach(): void {
    this.iframe = null;
  }

  updateFiles(files: SnackFiles): void {
    if (!this.iframe?.contentWindow) return;

    this.iframe.contentWindow.postMessage(
      { type: 'snack/updateFiles', files },
      this.origin,
    );
  }

  updateSingleFile(path: string, contents: string): void {
    this.updateFiles({
      [path]: { contents, type: 'CODE' },
    });
  }
}

export const snackBridge = new SnackBridge();
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/src/services/snack-bridge.ts
git commit -m "feat: add SnackBridge service for Expo Snack postMessage API"
```

---

### Task 8: Build UI components — Toolbar

**Files:**
- Create: `packages/editor/src/components/Toolbar.tsx`

- [ ] **Step 1: Create Toolbar**

```tsx
import React from 'react';
import { Layers, Download, MessageSquare, Play } from 'lucide-react';
import { useEditorStore, type EditorMode } from '../store/editor-store';

const modes: { id: EditorMode; label: string }[] = [
  { id: 'design', label: 'Design' },
  { id: 'code', label: 'Code' },
];

export function Toolbar() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const currentProject = useEditorStore((s) => s.currentProject);
  const toggleAiSidebar = useEditorStore((s) => s.toggleAiSidebar);
  const aiSidebarOpen = useEditorStore((s) => s.aiSidebarOpen);

  const handleExport = () => {
    // Future: zip and download project
  };

  return (
    <header className="h-11 bg-ide-toolbar border-b border-ide-border flex items-center px-4 justify-between shrink-0 z-10">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-ide-accent to-purple-700 flex items-center justify-center">
            <Layers size={11} className="text-white" />
          </div>
          <span className="font-bold text-xs tracking-tight text-ide-text-bright">appkit</span>
        </div>
        <span className="w-px h-4 bg-ide-border" />
        <span className="text-[11px] text-ide-text truncate max-w-[160px]">
          {currentProject?.name ?? 'No Project'}
        </span>
      </div>

      <div className="flex bg-ide-surface rounded-full p-0.5">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3.5 py-1 text-[11px] font-medium rounded-full transition-all ${
              mode === m.id ? 'bg-ide-accent text-white shadow-glow' : 'text-ide-text hover:text-ide-text-bright'
            }`}
          >{m.label}</button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-ide-text hover:text-ide-text-bright hover:bg-ide-hover rounded transition-colors"
          title="Run preview"
        >
          <Play size={11} /> Run
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold bg-ide-accent text-white rounded-md hover:opacity-90 transition-opacity"
        >
          <Download size={11} /> Export
        </button>
        <span className="w-px h-4 bg-ide-border" />
        <button
          onClick={toggleAiSidebar}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded transition-colors ${
            aiSidebarOpen ? 'text-ide-accent bg-ide-accent-dim' : 'text-ide-text hover:text-ide-text-bright hover:bg-ide-hover'
          }`}
        >
          <MessageSquare size={11} /> AI
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/src/components/Toolbar.tsx
git commit -m "feat: add editor Toolbar with mode toggle and AI sidebar button"
```

---

### Task 9: Build UI components — VSCodePane, PreviewPane, StatusBar

**Files:**
- Create: `packages/editor/src/components/VSCodePane.tsx`
- Create: `packages/editor/src/components/PreviewPane.tsx`
- Create: `packages/editor/src/components/StatusBar.tsx`

- [ ] **Step 1: Create VSCodePane**

```tsx
import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editor-store';

export function VSCodePane() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vscodePort = useEditorStore((s) => s.vscodePort);
  const currentProject = useEditorStore((s) => s.currentProject);
  const vscodeReady = useEditorStore((s) => s.vscodeReady);

  const folderParam = currentProject ? `?folder=${encodeURIComponent(currentProject.path)}` : '';
  const src = `http://localhost:${vscodePort}/${folderParam}`;

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== `http://localhost:${vscodePort}`) return;
      // Handle messages from VS Code if needed
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [vscodePort]);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center bg-ide-bg text-ide-text-dim">
        <p className="text-sm">Create or open a project to start coding</p>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {!vscodeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-ide-bg z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-ide-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-ide-text-dim">Starting VS Code Server...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        className="w-full h-full border-none"
        title="VS Code Editor"
        onLoad={() => useEditorStore.getState().setVSCodeReady(true)}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create PreviewPane**

```tsx
import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editor-store';
import { snackBridge } from '../services/snack-bridge';

export function PreviewPane() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentProject = useEditorStore((s) => s.currentProject);
  const setSnackConnected = useEditorStore((s) => s.setSnackConnected);

  useEffect(() => {
    if (iframeRef.current) {
      snackBridge.attach(iframeRef.current);
    }
    return () => snackBridge.detach();
  }, []);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center bg-ide-bg text-ide-text-dim">
        <p className="text-sm">Preview will appear here</p>
      </div>
    );
  }

  const snackUrl = 'https://snack.expo.dev/embedded?platform=web&preview=true&theme=dark';

  return (
    <div className="h-full flex flex-col bg-ide-bg">
      <div className="h-8 bg-ide-toolbar border-b border-ide-border flex items-center px-3 text-[10px] text-ide-text shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${currentProject ? 'bg-emerald-400' : 'bg-ide-text-dim'}`} />
          <span>Preview</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative" style={{ width: 375, height: 812, maxHeight: '100%' }}>
          <div className="absolute inset-0 rounded-[3rem] border-[3px] border-ide-border bg-black overflow-hidden">
            <iframe
              ref={iframeRef}
              src={snackUrl}
              className="w-full h-full border-none"
              title="Expo Snack Preview"
              onLoad={() => setSnackConnected(true)}
              allow="cross-origin-isolated"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create StatusBar**

```tsx
import React from 'react';
import { useEditorStore } from '../store/editor-store';

export function StatusBar() {
  const vscodeReady = useEditorStore((s) => s.vscodeReady);
  const snackConnected = useEditorStore((s) => s.snackConnected);
  const currentProject = useEditorStore((s) => s.currentProject);
  const mode = useEditorStore((s) => s.mode);

  return (
    <footer className="h-6 bg-ide-toolbar border-t border-ide-border flex items-center px-3 text-[10px] text-ide-text-dim shrink-0">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${vscodeReady ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          VS Code {vscodeReady ? 'Ready' : 'Starting...'}
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${snackConnected ? 'bg-emerald-400' : 'bg-ide-text-dim'}`} />
          Snack {snackConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        {currentProject && <span>{currentProject.name}</span>}
        <span className="capitalize">{mode} mode</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/editor/src/components/VSCodePane.tsx packages/editor/src/components/PreviewPane.tsx packages/editor/src/components/StatusBar.tsx
git commit -m "feat: add VSCodePane, PreviewPane, and StatusBar components"
```

---

### Task 10: Build AI Chat Sidebar

**Files:**
- Create: `packages/editor/src/components/AiChatSidebar.tsx`

- [ ] **Step 1: Create AiChatSidebar**

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { streamClaude, type Message, type StreamEvent } from '@appkit/ai';
import { useEditorStore } from '../store/editor-store';

export function AiChatSidebar() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('appkit-api-key') ?? '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toggleAiSidebar = useEditorStore((s) => s.toggleAiSidebar);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('appkit-api-key', key);
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming || !apiKey) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    let assistantText = '';
    setMessages([...updatedMessages, { role: 'assistant', content: '' }]);

    try {
      for await (const event of streamClaude(apiKey, updatedMessages, { layout: null as any, currentPage: '', actions: [] })) {
        if (event.type === 'text' && event.text) {
          assistantText += event.text;
          setMessages([...updatedMessages, { role: 'assistant', content: assistantText }]);
        }
        if (event.type === 'done') break;
        if (event.type === 'error') {
          assistantText = `Error: ${event.error}`;
          setMessages([...updatedMessages, { role: 'assistant', content: assistantText }]);
          break;
        }
      }
    } catch (err: any) {
      setMessages([...updatedMessages, { role: 'assistant', content: `Error: ${err.message}` }]);
    }

    setIsStreaming(false);
  };

  if (!apiKey) {
    return (
      <div className="h-full flex flex-col bg-ide-panel">
        <div className="flex items-center justify-between px-3 py-2 border-b border-ide-border">
          <span className="text-[11px] font-semibold text-ide-text-bright">AI Assistant</span>
          <button onClick={toggleAiSidebar} className="p-1 text-ide-text-dim hover:text-ide-text-bright rounded">
            <X size={12} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-xs text-ide-text-muted mb-3">Enter your API key to chat with Claude</p>
          <input
            type="password"
            placeholder="sk-ant-..."
            onChange={(e) => handleApiKeyChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-ide-bg border border-ide-border rounded-lg text-ide-text-bright focus:border-ide-accent focus:outline-none"
          />
          <p className="text-[9px] text-ide-text-dim mt-2">Stored locally. Sent directly to Anthropic.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <div className="flex items-center justify-between px-3 py-2 border-b border-ide-border">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-semibold text-ide-text-bright">AI Assistant</span>
        </div>
        <button onClick={toggleAiSidebar} className="p-1 text-ide-text-dim hover:text-ide-text-bright rounded">
          <X size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-ide px-3 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-[12px] leading-relaxed rounded-lg px-3 py-2 ${
              msg.role === 'user'
                ? 'bg-ide-accent text-white ml-6'
                : 'bg-ide-surface text-ide-text-bright mr-4'
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content as string}</div>
          </div>
        ))}
        {isStreaming && messages.length > 0 && messages[messages.length - 1].content === '' && (
          <div className="flex items-center gap-1.5 text-[10px] text-ide-text-dim px-3">
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-ide-accent animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-ide-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 rounded-full bg-ide-accent animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-2 border-t border-ide-border"
      >
        <div className="flex gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isStreaming}
            className="flex-1 px-3 py-2 text-xs bg-ide-bg border border-ide-border rounded-lg text-ide-text-bright placeholder:text-ide-text-dim focus:border-ide-accent focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="p-2 bg-ide-accent text-white rounded-lg hover:opacity-90 disabled:opacity-30 transition-opacity"
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/src/components/AiChatSidebar.tsx
git commit -m "feat: add AI chat sidebar with Claude streaming"
```

---

### Task 11: Build the App shell layout

**Files:**
- Modify: `packages/editor/src/App.tsx`

- [ ] **Step 1: Replace the placeholder App.tsx**

```tsx
import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Toolbar } from './components/Toolbar';
import { VSCodePane } from './components/VSCodePane';
import { PreviewPane } from './components/PreviewPane';
import { AiChatSidebar } from './components/AiChatSidebar';
import { StatusBar } from './components/StatusBar';
import { useEditorStore } from './store/editor-store';

export default function App() {
  const mode = useEditorStore((s) => s.mode);
  const aiSidebarOpen = useEditorStore((s) => s.aiSidebarOpen);

  return (
    <div className="h-screen flex flex-col bg-ide-bg select-none">
      <Toolbar />

      <div className="flex-1 overflow-hidden">
        {mode === 'design' && (
          <div className="h-full flex items-center justify-center text-ide-text-dim">
            <p className="text-sm">Design mode — visual builder will be loaded here</p>
          </div>
        )}

        {mode === 'code' && (
          <Allotment>
            <Allotment.Pane minSize={300} preferredSize="55%">
              <VSCodePane />
            </Allotment.Pane>

            <Allotment.Pane minSize={250}>
              <PreviewPane />
            </Allotment.Pane>

            {aiSidebarOpen && (
              <Allotment.Pane minSize={250} preferredSize={300} maxSize={400}>
                <AiChatSidebar />
              </Allotment.Pane>
            )}
          </Allotment>
        )}
      </div>

      <StatusBar />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/src/App.tsx
git commit -m "feat: wire up App shell with Allotment panes for code editor layout"
```

---

### Task 12: Create dev server (Express + OpenVSCode Server launcher)

**Files:**
- Create: `packages/editor/server/dev-server.ts`

- [ ] **Step 1: Create dev-server.ts**

```typescript
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'vite';
import express from 'express';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const VSCODE_PORT = 3100;
const VITE_PORT = 5200;

let vscodeProcess: ChildProcess | null = null;

function findOpenVSCode(): string | null {
  const candidates = [
    resolve(process.cwd(), 'node_modules', '.bin', 'openvscode-server'),
    resolve(process.env.HOME ?? '', '.appkit', 'openvscode-server', 'bin', 'openvscode-server'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function startVSCodeServer(): void {
  const binary = findOpenVSCode();

  if (!binary) {
    console.log('\n⚠️  OpenVSCode Server not found.');
    console.log('   Install it with: npx appkit setup');
    console.log('   Or install manually: npm install -g @gitpod/openvscode-server');
    console.log('   The editor will start without VS Code — you can still use the preview.\n');
    return;
  }

  vscodeProcess = spawn(binary, [
    '--port', String(VSCODE_PORT),
    '--without-connection-token',
    '--host', '127.0.0.1',
  ], {
    stdio: 'pipe',
    env: { ...process.env },
  });

  vscodeProcess.stdout?.on('data', (data: Buffer) => {
    const msg = data.toString().trim();
    if (msg) console.log(`[vscode] ${msg}`);
  });

  vscodeProcess.stderr?.on('data', (data: Buffer) => {
    const msg = data.toString().trim();
    if (msg) console.error(`[vscode] ${msg}`);
  });

  vscodeProcess.on('error', (err) => {
    console.error(`[vscode] Failed to start: ${err.message}`);
  });

  console.log(`[appkit] OpenVSCode Server starting on port ${VSCODE_PORT}`);
}

async function startVite(): Promise<void> {
  const server = await createServer({
    configFile: resolve(process.cwd(), 'vite.config.ts'),
    server: { port: VITE_PORT },
  });
  await server.listen();
  console.log(`[appkit] Editor UI ready at http://localhost:${VITE_PORT}`);
}

async function main(): Promise<void> {
  console.log('\n🚀 Starting AppKit Editor...\n');

  startVSCodeServer();
  await startVite();

  console.log('\n✅ AppKit Editor is running!');
  console.log(`   Editor:  http://localhost:${VITE_PORT}`);
  console.log(`   VS Code: http://localhost:${VSCODE_PORT}\n`);

  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    vscodeProcess?.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    vscodeProcess?.kill();
    process.exit(0);
  });
}

main().catch(console.error);
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/server/
git commit -m "feat: add dev server that starts Vite + OpenVSCode Server"
```

---

### Task 13: Build and verify everything

**Files:** None (verification only)

- [ ] **Step 1: Install all dependencies**

Run: `cd /tmp/appkit-clean && pnpm install`

- [ ] **Step 2: Run all tests**

Run: `cd /tmp/appkit-clean && npx turbo run test 2>&1 | tail -30`
Expected: All test suites pass

- [ ] **Step 3: Build editor package**

Run: `cd /tmp/appkit-clean && npx turbo run build --filter=@appkit/editor 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 4: Verify TypeScript**

Run: `cd /tmp/appkit-clean && npx turbo run typecheck 2>&1 | tail -20`
Expected: No type errors

- [ ] **Step 5: Fix any issues found**

If build/test failures, fix and re-run.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: fix any remaining build/test issues for editor package"
```
