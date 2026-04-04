/**
 * Analyzes React Native / Expo project files to build a component tree.
 * Works with uploaded file contents (not filesystem access).
 */

export interface ParsedComponent {
  name: string;
  filePath: string;
  imports: string[];
  jsxElements: string[];
  styleProperties: Record<string, string>;
  props: string[];
}

export interface ProjectAnalysis {
  components: ParsedComponent[];
  dependencies: Record<string, string>;
  screens: string[];
  hasExpoRouter: boolean;
  hasReactNavigation: boolean;
  entryFile: string | null;
}

interface FileEntry {
  path: string;
  content: string;
}

const COMPONENT_PATTERN = /(?:export\s+(?:default\s+)?)?(?:function|const)\s+(\w+)\s*[=(]/g;
const IMPORT_PATTERN = /import\s+(?:[\w{},\s*]+)\s+from\s+['"]([^'"]+)['"]/g;
const JSX_ELEMENT_PATTERN = /<(\w+)[\s/>]/g;
const STYLE_PROPERTY_PATTERN = /(\w+)\s*:\s*['"]?(#[0-9a-fA-F]{3,8}|[\d.]+|'[^']*'|"[^"]*")['"']?/g;
const SCREEN_PATTERN = /Screen|Page|View|Tab/i;

export function analyzeProject(files: FileEntry[]): ProjectAnalysis {
  const packageJson = files.find((f) => f.path.endsWith('package.json'));
  const dependencies = packageJson ? extractDependencies(packageJson.content) : {};

  const sourceFiles = files.filter(
    (f) => /\.(tsx?|jsx?)$/.test(f.path) && !f.path.includes('node_modules')
  );

  const components: ParsedComponent[] = [];
  const screens: string[] = [];

  for (const file of sourceFiles) {
    const parsed = parseComponent(file);
    if (parsed.length > 0) {
      components.push(...parsed);
      for (const comp of parsed) {
        if (SCREEN_PATTERN.test(comp.name) || SCREEN_PATTERN.test(file.path)) {
          screens.push(comp.name);
        }
      }
    }
  }

  const entryFile =
    files.find((f) => /App\.(tsx?|jsx?)$/.test(f.path))?.path ??
    files.find((f) => /index\.(tsx?|jsx?)$/.test(f.path))?.path ??
    null;

  return {
    components,
    dependencies,
    screens,
    hasExpoRouter: 'expo-router' in dependencies,
    hasReactNavigation: '@react-navigation/native' in dependencies,
    entryFile,
  };
}

function extractDependencies(packageJsonContent: string): Record<string, string> {
  try {
    const pkg = JSON.parse(packageJsonContent);
    return { ...pkg.dependencies, ...pkg.devDependencies };
  } catch {
    return {};
  }
}

function parseComponent(file: FileEntry): ParsedComponent[] {
  const { path, content } = file;
  const results: ParsedComponent[] = [];

  const imports: string[] = [];
  let match: RegExpExecArray | null;

  IMPORT_PATTERN.lastIndex = 0;
  while ((match = IMPORT_PATTERN.exec(content)) !== null) {
    imports.push(match[1]);
  }

  const jsxElements: string[] = [];
  JSX_ELEMENT_PATTERN.lastIndex = 0;
  while ((match = JSX_ELEMENT_PATTERN.exec(content)) !== null) {
    const el = match[1];
    if (el[0] === el[0].toUpperCase() && !jsxElements.includes(el)) {
      jsxElements.push(el);
    }
  }

  const styleProperties: Record<string, string> = {};
  STYLE_PROPERTY_PATTERN.lastIndex = 0;
  while ((match = STYLE_PROPERTY_PATTERN.exec(content)) !== null) {
    styleProperties[match[1]] = match[2];
  }

  COMPONENT_PATTERN.lastIndex = 0;
  while ((match = COMPONENT_PATTERN.exec(content)) !== null) {
    const name = match[1];
    if (name[0] === name[0].toUpperCase()) {
      results.push({ name, filePath: path, imports, jsxElements, styleProperties, props: [] });
    }
  }

  return results;
}
