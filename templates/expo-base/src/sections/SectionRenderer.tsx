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

export interface SectionData {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

interface SectionRendererProps {
  section: SectionData;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const { type, config } = section;

  switch (type) {
    case "banner":
      return <BannerSection config={config as any} />;
    case "categories":
      return <CategoriesSection config={config as any} />;
    case "products":
      return <ProductsSection config={config as any} />;
    case "collections":
      return <CollectionsSection config={config as any} />;
    case "header":
      return <HeaderSection config={config as any} />;
    case "video":
      return <VideoSection config={config as any} />;
    case "flash_sale":
      return <FlashSaleSection config={config as any} />;
    case "reviews":
      return <ReviewsSection config={config as any} />;
    case "offer":
      return <OfferSection config={config as any} />;
    case "hero":
      return <HeroSection config={config as any} />;
    case "tabs":
      return <TabsSection config={config as any} />;
    case "marquee":
      return <MarqueeSection config={config as any} />;
    default:
      return (
        <View style={styles.unknown}>
          <Text style={styles.unknownText}>
            Unknown section type: {type}
          </Text>
        </View>
      );
  }
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
});
