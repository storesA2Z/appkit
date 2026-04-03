import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import theme from "../theme/theme";
import { reviews } from "../data/mock-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

interface ReviewsSectionProps {
  config: {
    reviewsConfig?: {
      displayMode?: string;
      productLimit?: number;
      showRatings?: boolean;
      title?: string;
    };
  };
}

function renderStars(rating: number) {
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Text
        key={i}
        style={i < Math.round(rating) ? styles.starFilled : styles.starEmpty}
      >
        {i < Math.round(rating) ? "\u2605" : "\u2606"}
      </Text>
    );
  }
  return <View style={styles.starsRow}>{stars}</View>;
}

export default function ReviewsSection({ config }: ReviewsSectionProps) {
  const reviewsConfig = config.reviewsConfig || {};
  const title = reviewsConfig.title || "Customer Reviews";
  const showRatings = reviewsConfig.showRatings !== false;
  const limit = reviewsConfig.productLimit || 6;

  const displayReviews = reviews.slice(0, limit);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={displayReviews}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.author.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{item.author}</Text>
                <Text style={styles.reviewDate}>{item.date}</Text>
              </View>
            </View>
            {showRatings && renderStars(item.rating)}
            <Text style={styles.productTitle}>{item.productTitle}</Text>
            <Text style={styles.reviewText} numberOfLines={3}>
              {item.text}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.layout.spacing,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    paddingHorizontal: theme.layout.spacing,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: theme.layout.spacing,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.layout.borderRadius,
    padding: 16,
    marginRight: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  reviewDate: {
    fontSize: 11,
    color: theme.colors.darkGray,
    marginTop: 2,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  starFilled: {
    color: theme.colors.star,
    fontSize: 16,
    marginRight: 2,
  },
  starEmpty: {
    color: theme.colors.mediumGray,
    fontSize: 16,
    marginRight: 2,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.accent,
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 13,
    color: theme.colors.darkGray,
    lineHeight: 18,
  },
});
