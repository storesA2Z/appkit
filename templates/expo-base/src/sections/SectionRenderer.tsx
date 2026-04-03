import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme/theme";

import BannerSection from "./BannerSection";
import CategoriesSection from "./CategoriesSection";
import ProductsSection from "./ProductsSection";
import CollectionsSection from "./CollectionsSection";
import HeaderSection from "./HeaderSection";
import VideoSection from "./VideoSection";
import FlashSaleSection from "./FlashSaleSection";
import ReviewsSection from "./ReviewsSection";
import OfferSection from "./OfferSection";
import HeroSection from "./HeroSection";
import TabsSection from "./TabsSection";
import MarqueeSection from "./MarqueeSection";
import { customSectionRegistry } from "./custom-registry";

export interface SectionData {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

interface SectionRendererProps {
  section: SectionData;
}

const builtInSections: Record<string, React.ComponentType<{ config: any }>> = {
  banner: BannerSection,
  categories: CategoriesSection,
  products: ProductsSection,
  collections: CollectionsSection,
  header: HeaderSection,
  video: VideoSection,
  flash_sale: FlashSaleSection,
  reviews: ReviewsSection,
  offer: OfferSection,
  hero: HeroSection,
  tabs: TabsSection,
  marquee: MarqueeSection,
};

export default function SectionRenderer({ section }: SectionRendererProps) {
  const { type, config } = section;

  if (type === "custom") {
    const customConfig = (config as any).customConfig;
    const componentName = customConfig?.componentName;
    const CustomComponent = componentName
      ? customSectionRegistry[componentName]
      : null;

    if (CustomComponent) {
      return <CustomComponent {...(customConfig?.props || {})} />;
    }

    return (
      <View style={styles.customFallback}>
        <Text style={styles.customFallbackText}>
          {customConfig?.fallbackText || `Custom: ${componentName || "unset"}`}
        </Text>
      </View>
    );
  }

  const BuiltIn = builtInSections[type];
  if (BuiltIn) {
    return <BuiltIn config={config as any} />;
  }

  return (
    <View style={styles.unknown}>
      <Text style={styles.unknownText}>Unknown section type: {type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  unknown: {
    padding: theme.layout.spacing,
    marginHorizontal: theme.layout.spacing,
    marginBottom: theme.layout.spacing,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.layout.borderRadius,
    alignItems: "center",
  },
  unknownText: {
    color: theme.colors.darkGray,
    fontSize: 13,
    fontStyle: "italic",
  },
  customFallback: {
    padding: theme.layout.spacing,
    marginHorizontal: theme.layout.spacing,
    marginBottom: theme.layout.spacing,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.layout.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderStyle: "dashed",
    alignItems: "center",
  },
  customFallbackText: {
    color: theme.colors.darkGray,
    fontSize: 13,
  },
});
