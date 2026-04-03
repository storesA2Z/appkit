import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from "react-native";
import theme from "../theme/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface BannerItem {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

interface BannerSectionProps {
  config: {
    bannerConfig?: {
      items?: BannerItem[];
      autoplay?: boolean;
      height?: number;
    };
    items?: BannerItem[];
    height?: number;
  };
}

export default function BannerSection({ config }: BannerSectionProps) {
  const bannerConfig = config.bannerConfig || config;
  const items: BannerItem[] = bannerConfig.items || [
    {
      id: "b1",
      imageUrl: "https://images.unsplash.com/photo-1558171813-01eda6b4be21?w=800",
      title: "New Season",
      subtitle: "Discover the latest trends",
      ctaText: "Shop Now",
    },
    {
      id: "b2",
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
      title: "Summer Sale",
      subtitle: "Up to 50% off selected items",
      ctaText: "View Deals",
    },
    {
      id: "b3",
      imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
      title: "Exclusive Collection",
      subtitle: "Limited edition pieces",
      ctaText: "Explore",
    },
  ];
  const height = bannerConfig.height || 200;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const renderItem = ({ item }: { item: BannerItem }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH, height }]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {item.title && <Text style={styles.title}>{item.title}</Text>}
        {item.subtitle && (
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        )}
        {item.ctaText && (
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>{item.ctaText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <View style={styles.dotsContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.layout.spacing,
  },
  slide: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.white,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: theme.layout.borderRadius,
  },
  ctaText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.accent,
    width: 20,
  },
  inactiveDot: {
    backgroundColor: theme.colors.mediumGray,
  },
});
