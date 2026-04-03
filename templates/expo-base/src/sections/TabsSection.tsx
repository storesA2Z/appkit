import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import theme from "../theme/theme";
import ProductCard from "../components/ProductCard";
import { products, getProductsByCollection } from "../data/mock-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Tab {
  id: string;
  title: string;
  collectionIds?: string[];
}

interface TabsSectionProps {
  config: {
    tabsConfig?: {
      tabs: Tab[];
      variant?: "grid" | "horizontal";
    };
  };
}

export default function TabsSection({ config }: TabsSectionProps) {
  const tabsConfig = config.tabsConfig || {
    tabs: [{ id: "all", title: "All", collectionIds: [] }],
    variant: "grid",
  };
  const tabs = tabsConfig.tabs;
  const variant = tabsConfig.variant || "grid";
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const activeTab = tabs[activeTabIndex];
  let tabProducts = activeTab.collectionIds
    ? activeTab.collectionIds.flatMap((cid) => getProductsByCollection(cid))
    : [];

  if (tabProducts.length === 0) {
    tabProducts = products.slice(0, 6);
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabItem,
              index === activeTabIndex && styles.activeTabItem,
            ]}
            onPress={() => setActiveTabIndex(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                index === activeTabIndex && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {variant === "grid" ? (
        <FlatList
          data={tabProducts}
          renderItem={({ item }) => <ProductCard product={item} size="medium" />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
        />
      ) : (
        <FlatList
          data={tabProducts}
          renderItem={({ item }) => <ProductCard product={item} size="medium" />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.layout.spacing,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: theme.layout.spacing,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabItem: {
    borderBottomColor: theme.colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.darkGray,
  },
  activeTabText: {
    color: theme.colors.accent,
    fontWeight: "700",
  },
  gridContent: {
    paddingHorizontal: theme.layout.spacing,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  horizontalContent: {
    paddingHorizontal: theme.layout.spacing,
  },
});
