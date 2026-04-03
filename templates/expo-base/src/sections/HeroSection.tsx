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

interface HeroSectionProps {
  config: {
    heroConfig?: {
      imageUrl?: string;
      title?: string;
      subtitle?: string;
      ctaText?: string;
      textPosition?: "left" | "center" | "right";
      overlayOpacity?: number;
      height?: number;
    };
  };
}

export default function HeroSection({ config }: HeroSectionProps) {
  const heroConfig = config.heroConfig || {};
  const imageUrl =
    heroConfig.imageUrl ||
    "https://images.unsplash.com/photo-1558171813-01eda6b4be21?w=800";
  const title = heroConfig.title || "Welcome";
  const subtitle = heroConfig.subtitle || "";
  const ctaText = heroConfig.ctaText || "";
  const textPosition = heroConfig.textPosition || "center";
  const overlayOpacity = heroConfig.overlayOpacity ?? 0.4;
  const height = heroConfig.height || 280;

  const alignItems =
    textPosition === "left"
      ? "flex-start"
      : textPosition === "right"
        ? "flex-end"
        : "center";

  const textAlign = textPosition;

  return (
    <View style={[styles.container, { height }]}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View
        style={[
          styles.overlay,
          { backgroundColor: `rgba(0,0,0,${overlayOpacity})` },
          { alignItems },
        ]}
      >
        <Text style={[styles.title, { textAlign }]}>{title}</Text>
        {subtitle !== "" && (
          <Text style={[styles.subtitle, { textAlign }]}>{subtitle}</Text>
        )}
        {ctaText !== "" && (
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
            <Text style={styles.ctaText}>{ctaText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    marginBottom: theme.layout.spacing,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: theme.colors.white,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.white,
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: theme.layout.borderRadius,
  },
  ctaText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
