import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import theme from "../theme/theme";
import ProductCard from "../components/ProductCard";
import { products, getProductsByCollection } from "../data/mock-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ProductsSectionProps {
  config: {
    collectionId?: string;
    title?: string;
    showSeeAll?: boolean;
    sortBy?: string;
    variant?: "grid" | "horizontal";
    cardSize?: "small" | "medium" | "large";
    limit?: number;
  };
}

export default function ProductsSection({ config }: ProductsSectionProps) {
  const variant = config.variant || "horizontal";
  const cardSize = config.cardSize || "medium";
  const limit = config.limit || 6;

  let displayProducts = config.collectionId
    ? getProductsByCollection(config.collectionId)
    : products;

  if (displayProducts.length === 0) {
    displayProducts = products;
  }

  if (config.sortBy === "newest") {
    displayProducts = [...displayProducts].reverse();
  } else if (config.sortBy === "price-asc") {
    displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
  } else if (config.sortBy === "price-desc") {
    displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
  }

  displayProducts = displayProducts.slice(0, limit);

  if (variant === "grid") {
    const numColumns = 2;
    const cardWidth =
      (SCREEN_WIDTH - theme.layout.spacing * 2 - theme.layout.spacing * 0.75) / numColumns;

    return (
      <View style={styles.container}>
        {renderHeader(config)}
        <FlatList
          data={displayProducts}
          renderItem={({ item }) => (
            <ProductCard product={item} size={cardSize} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader(config)}
      <FlatList
        data={displayProducts}
        renderItem={({ item }) => (
          <ProductCard product={item} size={cardSize} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContent}
      />
    </View>
  );
}

function renderHeader(config: ProductsSectionProps["config"]) {
  if (!config.title) return null;

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{config.title}</Text>
      {config.showSeeAll && (
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      )}
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: "600",
  },
  horizontalContent: {
    paddingHorizontal: theme.layout.spacing,
  },
  gridContent: {
    paddingHorizontal: theme.layout.spacing,
  },
  gridRow: {
    justifyContent: "space-between",
  },
});
