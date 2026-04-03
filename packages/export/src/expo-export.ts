import type { AppLayout, Section, ThemeConfig } from '@appkit/schema';

export interface ExpoProjectFile {
  path: string;
  content: string;
}

export function generateExpoProject(layout: AppLayout): ExpoProjectFile[] {
  const files: ExpoProjectFile[] = [];

  // layout.json — the source of truth for the app
  files.push({
    path: 'src/data/layout.json',
    content: JSON.stringify(layout, null, 2),
  });

  // theme.ts
  files.push({
    path: 'src/theme/theme.ts',
    content: generateThemeFile(layout.theme),
  });

  // package.json
  files.push({
    path: 'package.json',
    content: generatePackageJson(layout.metadata.name),
  });

  // app.json (Expo config)
  files.push({
    path: 'app.json',
    content: generateAppJson(layout.metadata),
  });

  // App.tsx entry point
  files.push({
    path: 'App.tsx',
    content: generateAppEntry(),
  });

  return files;
}

function generateThemeFile(theme: ThemeConfig): string {
  return `export const theme = ${JSON.stringify(theme, null, 2)} as const;

export type Theme = typeof theme;
`;
}

function generatePackageJson(name: string): string {
  return JSON.stringify({
    name: name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    main: 'App.tsx',
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
      build: 'eas build',
    },
    dependencies: {
      expo: '~52.0.0',
      react: '18.3.1',
      'react-native': '0.76.0',
      '@react-navigation/bottom-tabs': '^7.0.0',
      '@react-navigation/native': '^7.0.0',
      'react-native-screens': '~4.4.0',
      'react-native-safe-area-context': '~5.0.0',
    },
    devDependencies: {
      typescript: '^5.8.0',
      '@types/react': '^18.2.0',
    },
  }, null, 2);
}

function generateAppJson(metadata: { name: string; description: string; version: string; icon?: string; splash?: string }): string {
  return JSON.stringify({
    expo: {
      name: metadata.name,
      slug: metadata.name.toLowerCase().replace(/\s+/g, '-'),
      version: metadata.version,
      orientation: 'portrait',
      icon: metadata.icon || './assets/icon.png',
      splash: { image: metadata.splash || './assets/splash.png', resizeMode: 'contain', backgroundColor: '#ffffff' },
      ios: { supportsTablet: true, bundleIdentifier: `com.appkit.${metadata.name.toLowerCase().replace(/\s+/g, '')}` },
      android: { adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' }, package: `com.appkit.${metadata.name.toLowerCase().replace(/\s+/g, '')}` },
    },
  }, null, 2);
}

function generateAppEntry(): string {
  return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import layout from './src/data/layout.json';
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();

function PageScreen({ route }: any) {
  const sections = layout.pages[route.name as keyof typeof layout.pages] || [];
  // Render sections dynamically based on layout.json
  return null; // TODO: Implement SectionRenderer for React Native
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="home" component={PageScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="explore" component={PageScreen} options={{ title: 'Explore' }} />
        <Tab.Screen name="profile" component={PageScreen} options={{ title: 'Profile' }} />
        <Tab.Screen name="search" component={PageScreen} options={{ title: 'Search' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
`;
}
