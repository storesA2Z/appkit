import type { ComponentType } from "react";

/**
 * Custom Section Registry
 *
 * Register your own React Native components here to use them as
 * custom sections in your appkit layout. The key must match the
 * `componentName` you set in the builder's custom section config.
 *
 * Example:
 *
 *   import BrandStory from '../components/BrandStory';
 *   import LoyaltyBanner from '../components/LoyaltyBanner';
 *
 *   export const customSectionRegistry: Record<string, ComponentType<any>> = {
 *     BrandStory,
 *     LoyaltyBanner,
 *   };
 *
 * Props configured in the builder are passed directly to your component.
 */
export const customSectionRegistry: Record<string, ComponentType<any>> = {
  // Add your custom components here:
  // MyComponent: require('../components/MyComponent').default,
};
