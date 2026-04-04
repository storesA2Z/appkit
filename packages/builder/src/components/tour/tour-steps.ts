export interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="widget-tree"]',
    title: 'Widget Tree',
    description: 'Browse and organize your app sections. Switch between Layers and Pages views. Drag to reorder, right-click for options.',
    placement: 'right',
  },
  {
    target: '[data-tour="section-canvas"]',
    title: 'Live Preview',
    description: 'See your app in a realistic device frame. Switch between iPhone and Android, zoom in/out, and toggle light/dark mode.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="properties-panel"]',
    title: 'Properties Panel',
    description: 'Edit section settings, theme tokens, custom styles, and get suggestions. Select a section to see its properties.',
    placement: 'left',
  },
  {
    target: '[data-tour="mode-switcher"]',
    title: 'Design / Code / Preview',
    description: 'Switch between visual editor, JSON code editor (with Monaco), and full preview mode.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="theme-selector"]',
    title: 'Theme Library',
    description: 'Save, switch, and manage themes. Create variants for A/B testing or seasonal looks.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="command-palette"]',
    title: 'Command Palette (⌘K)',
    description: 'Quick-access everything: jump to pages, add sections, and run commands. Press ⌘K anytime.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="import-btn"]',
    title: 'Import Projects',
    description: 'Import existing AppKit JSON or reverse-engineer a React Native / Expo project into AppKit sections.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="export-btn"]',
    title: 'Export & Ship',
    description: 'Export your app as a production-ready Expo project with all screens, sections, theme, and a personalized README.',
    placement: 'bottom',
  },
];
