export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: 'starter' | 'ecommerce' | 'food' | 'personal' | 'business';
  features: string[];
}

const templates: TemplateInfo[] = [
  {
    id: 'expo-router-tabs',
    name: 'Blank Starter',
    description: 'Clean Expo Router app with tab navigation. Best for starting from scratch.',
    category: 'starter',
    features: ['Tab navigation', '3 screens', 'Theme system', 'UI components'],
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    description: 'Full shopping app with product listings, categories, cart, and promotions.',
    category: 'ecommerce',
    features: ['Product grid', 'Category browser', 'Cart screen', 'Promo banners', 'Search'],
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Food',
    description: 'Food ordering app with menu categories, featured items, and order flow.',
    category: 'food',
    features: ['Menu categories', 'Featured dishes', 'Order screen', 'Hero banner', 'Reviews'],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Personal portfolio and blog app. Clean minimal design with project showcase.',
    category: 'personal',
    features: ['Project gallery', 'About screen', 'Contact form', 'Blog list', 'Stack navigation'],
  },
  {
    id: 'saas-dashboard',
    name: 'SaaS Dashboard',
    description: 'Utility dashboard with stats, activity feed, and settings. Great for data-driven apps.',
    category: 'business',
    features: ['Stats cards', 'Activity feed', 'Settings screen', 'Profile', 'Charts placeholder'],
  },
];

export function getTemplates(): TemplateInfo[] {
  return templates;
}

export function getTemplate(id: string): TemplateInfo | undefined {
  return templates.find((t) => t.id === id);
}
