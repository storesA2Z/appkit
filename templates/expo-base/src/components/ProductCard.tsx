import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import theme from "../theme/theme";
import { Product } from "../data/mock-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ProductCardProps {
  product: Product;
  size?: "small" | "medium" | "large";
  onPress?: () => void;
}

export default function ProductCard({
  product,
  size = "medium",
  onPress,
}: ProductCardProps) {
  const cardWidth =
    size === "small"
      ? SCREEN_WIDTH * 0.35
      : size === "large"
        ? SCREEN_WIDTH * 0.6
        : SCREEN_WIDTH * 0.44;

  const imageHeight =
    size === "small" ? 120 : size === "large" ? 240 : 180;

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercent}%</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.ratingRow}>
          {renderStars(product.rating)}
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {hasDiscount && (
            <Text style={styles.comparePrice}>
              ${product.compareAtPrice!.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const stars: React.ReactNode[] = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Text key={i} style={styles.starFilled}>
          {"\u2605"}
        </Text>
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <Text key={i} style={styles.starHalf}>
          {"\u2605"}
        </Text>
      );
    } else {
      stars.push(
        <Text key={i} style={styles.starEmpty}>
          {"\u2606"}
        </Text>
      );
    }
  }

  return <View style={styles.starsContainer}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    marginRight: theme.layout.spacing * 0.75,
    marginBottom: theme.layout.spacing,
  },
  imageContainer: {
    borderRadius: theme.layout.borderRadius,
    overflow: "hidden",
    backgroundColor: theme.colors.lightGray,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  info: {
    paddingTop: 8,
  },
  title: {
    fontSize: theme.typography.fontSize,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starFilled: {
    color: theme.colors.star,
    fontSize: 12,
  },
  starHalf: {
    color: theme.colors.star,
    fontSize: 12,
    opacity: 0.6,
  },
  starEmpty: {
    color: theme.colors.mediumGray,
    fontSize: 12,
  },
  reviewCount: {
    fontSize: 11,
    color: theme.colors.darkGray,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: theme.typography.fontSize + 2,
    fontWeight: "700",
    color: theme.colors.text,
  },
  comparePrice: {
    fontSize: theme.typography.fontSize - 1,
    color: theme.colors.darkGray,
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
});
