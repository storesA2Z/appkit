import React, { useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useAppkitStore } from '../store/appkit-store';
import type { Section, ThemeConfig } from '@appkit/schema';

type CodeTab = 'screen' | 'theme' | 'json';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function CodeEditor() {
  const project = useAppkitStore((s) => s.project);
  const currentPage = useAppkitStore((s) => s.currentPage);
  const setProject = useAppkitStore((s) => s.setProject);
  const [tab, setTab] = useState<CodeTab>('screen');

  const pageConfig = project.pages[currentPage];
  const sections = pageConfig?.sections ?? [];

  const screenCode = useMemo(() => generateScreenCode(currentPage, pageConfig?.label ?? currentPage, sections), [currentPage, sections]);
  const themeCode = useMemo(() => generateThemeCode(project.theme), [project.theme]);
  const jsonCode = useMemo(() => JSON.stringify(project, null, 2), [project]);

  const activeCode = tab === 'json' ? jsonCode : tab === 'theme' ? themeCode : screenCode;
  const activeLang = tab === 'json' ? 'json' : 'typescript';

  const handleJsonChange = (value: string | undefined) => {
    if (!value || tab !== 'json') return;
    try {
      const parsed = JSON.parse(value);
      if (parsed.pages && parsed.theme && parsed.metadata) {
        setProject(parsed);
      }
    } catch {}
  };

  const tabs: { id: CodeTab; file: string }[] = [
    { id: 'screen', file: `${capitalize(currentPage)}Screen.tsx` },
    { id: 'theme', file: 'theme.ts' },
    { id: 'json', file: 'layout.json' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center border-b border-ide-border bg-ide-toolbar shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-[11px] font-mono border-b-2 transition-colors ${
              tab === t.id
                ? 'text-ide-text-bright border-ide-accent bg-ide-panel'
                : 'text-ide-text-dim border-transparent hover:text-ide-text hover:bg-ide-hover'
            }`}
          >{t.file}</button>
        ))}
        <div className="flex-1" />
        <span className="px-3 text-[9px] text-ide-text-dim">
          {tab === 'json' ? 'Editable — auto-applies' : 'Read-only — export preview'}
        </span>
      </div>
      <div className="flex-1">
        <Editor
          key={tab}
          language={activeLang}
          value={activeCode}
          onChange={tab === 'json' ? handleJsonChange : undefined}
          theme="vs-dark"
          options={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            bracketPairColorization: { enabled: true },
            tabSize: 2,
            wordWrap: 'on',
            readOnly: tab !== 'json',
          }}
        />
      </div>
    </div>
  );
}

function generateScreenCode(page: string, label: string, sections: Section[]): string {
  const name = capitalize(page);
  const types = [...new Set(sections.map((s) => s.type))];
  const comps = types.map((t) => t.split('_').map(capitalize).join('') + 'Section');

  return `import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import theme from "../theme/theme";
${comps.map((c) => `import ${c} from "../sections/${c}";`).join('\n')}

// ${label} — ${sections.length} section${sections.length !== 1 ? 's' : ''}

export default function ${name}Screen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
${sections.map((s) => {
  const comp = s.type.split('_').map(capitalize).join('') + 'Section';
  const configStr = JSON.stringify(s.config, null, 6)
    .split('\n').map((l, i) => i === 0 ? l : '      ' + l).join('\n');
  return `      <${comp}\n        config={${configStr}}\n      />`;
}).join('\n')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 24 },
});
`;
}

function generateThemeCode(theme: ThemeConfig): string {
  return `// Theme generated from AppKit Builder

export const theme = {
  colors: {
    primary: "${theme.colors.primary}",
    secondary: "${theme.colors.secondary}",
    accent: "${theme.colors.accent}",
    background: "${theme.colors.background}",
    text: "${theme.colors.text}",
    lightGray: "#f5f5f5",
    mediumGray: "#cccccc",
    darkGray: "#666666",
    white: "#ffffff",
    black: "#000000",
  },
  typography: {
    fontFamily: "${theme.typography.fontFamily}",
    fontSize: ${parseInt(theme.typography.fontSize) || 14},
    fontWeight: "${theme.typography.fontWeight}" as const,
  },
  layout: {
    borderRadius: ${parseInt(theme.layout.borderRadius) || 8},
    spacing: ${parseInt(theme.layout.spacing) || 16},
  },
};

export type Theme = typeof theme;
export default theme;
`;
}
