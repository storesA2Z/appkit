import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import theme from "../theme/theme";
import { collections, getCollectionsByIds } from "../data/mock-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.6;

interface CollectionsSectionProps {
  config: {
    collectionIds?: string[];
    title?: string;
    showSeeAll?: boolean;
  };
}

export default function CollectionsSection({ config }: CollectionsSectionProps) {
  const displayCollections = config.collectionIds
    ? getCollectionsByIds(config.collectionIds).length > 0
      ? getCollectionsByIds(config.collectionIds)
      : collections
    : collections;

  return (
    <View style={styles.container}>
      {config.title && (
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>{config.title}</Text>
          {config.showSeeAll && (
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayCollections.map((collection) => (
          <TouchableOpacity
            key={collection.id}
            style={styles.card}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: collection.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardOverlay}>
              <Text style={styles.cardTitle}>{collection.title}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {collection.description}
              </Text>
              <Text style={styles.productCount}>
                {collection.productCount} items
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.layout.spacing,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.layout.spacing,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: theme.layout.spacing,
  },
  card: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: theme.layout.borderRadius,
    overflow: "hidden",
    marginRight: 12,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    padding: 16,
  },
  cardTitle: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardDescription: {
    color: theme.colors.white,
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 4,
  },
  productCount: {
    color: theme.colors.white,
    fontSize: 11,
    opacity: 0.7,
  },
});
