/**
 * Maps parsed RN components to AppKit section types using heuristics.
 */

import type { SectionType } from '@appkit/schema';
import type { ParsedComponent } from './analyzer';

export interface SectionMatch {
  component: ParsedComponent;
  sectionType: SectionType;
  confidence: number; // 0-1
  reason: string;
}

interface MatchRule {
  sectionType: SectionType;
  keywords: string[];
  jsxHints: string[];
  importHints: string[];
  weight: number;
}

const MATCH_RULES: MatchRule[] = [
  {
    sectionType: 'hero',
    keywords: ['hero', 'banner', 'splash', 'cover', 'jumbotron'],
    jsxHints: ['ImageBackground', 'LinearGradient'],
    importHints: ['expo-linear-gradient', 'react-native-linear-gradient'],
    weight: 1,
  },
  {
    sectionType: 'banner',
    keywords: ['carousel', 'slider', 'swiper', 'banner'],
    jsxHints: ['FlatList', 'ScrollView', 'Swiper'],
    importHints: ['react-native-swiper', 'react-native-snap-carousel', 'react-native-reanimated-carousel'],
    weight: 1,
  },
  {
    sectionType: 'products',
    keywords: ['product', 'item', 'card', 'listing', 'shop'],
    jsxHints: ['FlatList', 'SectionList'],
    importHints: [],
    weight: 0.8,
  },
  {
    sectionType: 'categories',
    keywords: ['category', 'categories', 'grid', 'department'],
    jsxHints: ['FlatList', 'ScrollView'],
    importHints: [],
    weight: 0.8,
  },
  {
    sectionType: 'collections',
    keywords: ['collection', 'collections', 'group'],
    jsxHints: ['SectionList', 'FlatList'],
    importHints: [],
    weight: 0.7,
  },
  {
    sectionType: 'header',
    keywords: ['header', 'title', 'heading', 'section-header'],
    jsxHints: ['Text'],
    importHints: [],
    weight: 0.6,
  },
  {
    sectionType: 'video',
    keywords: ['video', 'player', 'media'],
    jsxHints: ['Video', 'WebView'],
    importHints: ['expo-av', 'expo-video', 'react-native-video'],
    weight: 1,
  },
  {
    sectionType: 'flash_sale',
    keywords: ['flash', 'sale', 'countdown', 'timer', 'deal'],
    jsxHints: [],
    importHints: [],
    weight: 0.9,
  },
  {
    sectionType: 'reviews',
    keywords: ['review', 'rating', 'star', 'feedback', 'testimonial'],
    jsxHints: [],
    importHints: [],
    weight: 0.8,
  },
  {
    sectionType: 'offer',
    keywords: ['offer', 'promo', 'discount', 'coupon', 'deal'],
    jsxHints: [],
    importHints: [],
    weight: 0.8,
  },
  {
    sectionType: 'tabs',
    keywords: ['tab', 'tabs', 'tabbed', 'tabbar'],
    jsxHints: ['TabView', 'TabBar'],
    importHints: ['react-native-tab-view'],
    weight: 0.9,
  },
  {
    sectionType: 'marquee',
    keywords: ['marquee', 'ticker', 'scroll-text', 'announcement'],
    jsxHints: ['Animated'],
    importHints: ['react-native-reanimated'],
    weight: 0.7,
  },
];

export function matchComponents(components: ParsedComponent[]): SectionMatch[] {
  const matches: SectionMatch[] = [];

  for (const comp of components) {
    const best = findBestMatch(comp);
    if (best) {
      matches.push(best);
    }
  }

  return matches.sort((a, b) => b.confidence - a.confidence);
}

function findBestMatch(comp: ParsedComponent): SectionMatch | null {
  let bestScore = 0;
  let bestRule: MatchRule | null = null;
  let bestReason = '';

  const nameLower = comp.name.toLowerCase();
  const pathLower = comp.filePath.toLowerCase();

  for (const rule of MATCH_RULES) {
    let score = 0;
    const reasons: string[] = [];

    // Check component name and file path against keywords
    for (const kw of rule.keywords) {
      if (nameLower.includes(kw) || pathLower.includes(kw)) {
        score += 0.4 * rule.weight;
        reasons.push(`name matches "${kw}"`);
      }
    }

    // Check JSX elements
    for (const hint of rule.jsxHints) {
      if (comp.jsxElements.includes(hint)) {
        score += 0.3 * rule.weight;
        reasons.push(`uses <${hint}>`);
      }
    }

    // Check imports
    for (const hint of rule.importHints) {
      if (comp.imports.some((i) => i.includes(hint))) {
        score += 0.3 * rule.weight;
        reasons.push(`imports ${hint}`);
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
      bestReason = reasons.join(', ');
    }
  }

  if (!bestRule || bestScore < 0.2) return null;

  return {
    component: comp,
    sectionType: bestRule.sectionType,
    confidence: Math.min(bestScore, 1),
    reason: bestReason,
  };
}
