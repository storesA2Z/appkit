/**
 * Extracts theme information (colors, fonts, spacing) from RN project files.
 */

import type { ThemeConfig } from '@appkit/schema';
import type { ParsedComponent } from './analyzer';

const COLOR_HEX_PATTERN = /#([0-9a-fA-F]{3,8})\b/g;
const FONT_FAMILY_PATTERN = /fontFamily\s*:\s*['"]([^'"]+)['"]/g;
const FONT_SIZE_PATTERN = /fontSize\s*:\s*(\d+)/g;
const BORDER_RADIUS_PATTERN = /borderRadius\s*:\s*(\d+)/g;
const SPACING_PATTERN = /(?:margin|padding)(?:Top|Bottom|Left|Right|Horizontal|Vertical)?\s*:\s*(\d+)/g;

interface ExtractedTheme {
  colors: string[];
  fonts: string[];
  fontSizes: number[];
  borderRadii: number[];
  spacingValues: number[];
}

export function extractTheme(components: ParsedComponent[]): ThemeConfig {
  const extracted = extractRawValues(components);
  return buildThemeConfig(extracted);
}

function extractRawValues(components: ParsedComponent[]): ExtractedTheme {
  const colors: string[] = [];
  const fonts: string[] = [];
  const fontSizes: number[] = [];
  const borderRadii: number[] = [];
  const spacingValues: number[] = [];

  for (const comp of components) {
    const styles = Object.entries(comp.styleProperties);
    for (const [key, value] of styles) {
      const colorMatch = value.match(COLOR_HEX_PATTERN);
      if (colorMatch) {
        colors.push(...colorMatch);
      }
    }
  }

  // Re-parse all style-related content from raw file content isn't available,
  // so we use the styleProperties map from analyzer
  for (const comp of components) {
    for (const [key, value] of Object.entries(comp.styleProperties)) {
      if (key === 'fontFamily') {
        fonts.push(value.replace(/['"]/g, ''));
      }
      if (key === 'fontSize') {
        const num = parseInt(value, 10);
        if (!isNaN(num)) fontSizes.push(num);
      }
      if (key === 'borderRadius') {
        const num = parseInt(value, 10);
        if (!isNaN(num)) borderRadii.push(num);
      }
      if (key.startsWith('margin') || key.startsWith('padding')) {
        const num = parseInt(value, 10);
        if (!isNaN(num)) spacingValues.push(num);
      }
    }
  }

  return { colors, fonts, fontSizes, borderRadii, spacingValues };
}

function buildThemeConfig(extracted: ExtractedTheme): ThemeConfig {
  const colorFreq = frequency(extracted.colors);
  const sortedColors = Object.entries(colorFreq).sort((a, b) => b[1] - a[1]);

  // Pick most common colors for theme slots
  const pick = (index: number, fallback: string) =>
    sortedColors[index]?.[0] ?? fallback;

  const primaryFont = extracted.fonts[0] || 'System';
  const medianFontSize = median(extracted.fontSizes) || 14;
  const medianRadius = median(extracted.borderRadii) || 8;
  const medianSpacing = median(extracted.spacingValues) || 16;

  return {
    colors: {
      primary: pick(0, '#6366f1'),
      secondary: pick(1, '#8b5cf6'),
      accent: pick(2, '#f59e0b'),
      background: pick(3, '#ffffff'),
      text: pick(4, '#1f2937'),
    },
    typography: {
      fontFamily: primaryFont,
      fontSize: `${medianFontSize}px`,
      fontWeight: '400',
    },
    layout: {
      borderRadius: `${medianRadius}px`,
      spacing: `${medianSpacing}px`,
    },
  };
}

function frequency(arr: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const item of arr) {
    const normalized = item.toLowerCase();
    freq[normalized] = (freq[normalized] || 0) + 1;
  }
  return freq;
}

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}
