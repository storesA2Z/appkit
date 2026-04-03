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
import { categories, getCategoriesByIds } from "../data/mock-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface CategoriesSectionProps {
  config: {
    collectionIds?: string[];
    variant?: "circular" | "square";
    title?: string;
  };
}

export default function CategoriesSection({ config }: CategoriesSectionProps) {
  const variant = config.variant || "circular";
  const displayCategories = config.collectionIds
    ? getCategoriesByIds(config.collectionIds).length > 0
      ? getCategoriesByIds(config.collectionIds)
      : categories
    : categories;

  const itemSize =
    (SCREEN_WIDTH - theme.layout.spacing * 2 - 12 * (displayCategories.length - 1)) /
    Math.min(displayCategories.length, 5);

  const clampedSize = Math.min(Math.max(itemSize, 56), 80);

  return (
    <View style={styles.container}>
      {config.title && <Text style={styles.sectionTitle}>{config.title}</Text>}
      <View style={styles.grid}>
        {displayCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.item}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.imageWrapper,
                {
                  width: clampedSize,
                  height: clampedSize,
                  borderRadius: variant === "circular" ? clampedSize / 2 : theme.layout.borderRadius,
                },
              ]}
            >
              <Image
                source={{ uri: cat.image }}
                style={[
                  styles.image,
                  {
                    borderRadius: variant === "circular" ? clampedSize / 2 : theme.layout.borderRadius,
                  },
                ]}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.layout.spacing,
    paddingVertical: theme.layout.spacing,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  item: {
    alignItems: "center",
  },
  imageWrapper: {
    overflow: "hidden",
    backgroundColor: theme.colors.lightGray,
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.text,
    textAlign: "center",
    maxWidth: 80,
  },
});
