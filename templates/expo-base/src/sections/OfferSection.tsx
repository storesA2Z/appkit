import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import theme from "../theme/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OfferSectionProps {
  config: {
    offerConfig?: {
      imageUrl?: string;
      title?: string;
      subtitle?: string;
      ctaText?: string;
      backgroundColor?: string;
      discount?: string;
    };
    imageUrl?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    backgroundColor?: string;
    discount?: string;
  };
}

export default function OfferSection({ config }: OfferSectionProps) {
  const offerConfig = config.offerConfig || config;
  const imageUrl =
    offerConfig.imageUrl ||
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600";
  const title = offerConfig.title || "Special Offer";
  const subtitle = offerConfig.subtitle || "Use code SAVE20 at checkout";
  const ctaText = offerConfig.ctaText || "Claim Offer";
  const discount = offerConfig.discount || "20% OFF";
  const bgColor = offerConfig.backgroundColor || theme.colors.secondary;

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: bgColor }]}>
        <View style={styles.contentRow}>
          <View style={styles.textContent}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>{ctaText}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.layout.spacing,
    marginBottom: theme.layout.spacing,
  },
  card: {
    borderRadius: theme.layout.borderRadius,
    overflow: "hidden",
    padding: 20,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContent: {
    flex: 1,
    paddingRight: 12,
  },
  discountBadge: {
    backgroundColor: theme.colors.accent,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  discountText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: theme.colors.white,
    fontSize: 13,
    opacity: 0.85,
    marginBottom: 14,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: theme.colors.white,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.layout.borderRadius,
  },
  ctaText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: theme.layout.borderRadius,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
