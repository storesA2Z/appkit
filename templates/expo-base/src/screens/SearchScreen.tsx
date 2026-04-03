import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import layoutData from "../data/layout.json";
import SectionRenderer, { SectionData } from "../sections/SectionRenderer";
import ProductCard from "../components/ProductCard";
import theme from "../theme/theme";
import { products, categories } from "../data/mock-data";

const searchSections: SectionData[] = (layoutData.pages.search || []) as SectionData[];

const recentSearches = [
  "Summer dresses",
  "Leather bags",
  "White sneakers",
  "Silk blouse",
];

const trendingTags = [
  "New Arrivals",
  "Sale",
  "Bestsellers",
  "Dresses",
  "Shoes",
  "Accessories",
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (query.trim().length === 0) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q)
    );
  }, [query]);

  const isSearching = query.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>{"\u{1F50D}"}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, categories..."
          placeholderTextColor={theme.colors.darkGray}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Text style={styles.clearButton}>{"\u2715"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsContent}
          columnWrapperStyle={styles.resultsRow}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <Text style={styles.emptyText}>
                No products found for "{query}"
              </Text>
            </View>
          }
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {filteredProducts.length} result
              {filteredProducts.length !== 1 ? "s" : ""}
            </Text>
          }
          renderItem={({ item }) => (
            <ProductCard product={item} size="medium" />
          )}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.browseContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => setQuery(term)}
              >
                <Text style={styles.recentIcon}>{"\u{1F552}"}</Text>
                <Text style={styles.recentText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <View style={styles.tagContainer}>
              {trendingTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => setQuery(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => setQuery(cat.title)}
              >
                <Text style={styles.categoryText}>{cat.title}</Text>
                <Text style={styles.categoryArrow}>{"\u203A"}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {searchSections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: theme.layout.spacing,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.layout.borderRadius,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    fontSize: 16,
    color: theme.colors.darkGray,
    padding: 4,
  },
  resultsContent: {
    paddingHorizontal: theme.layout.spacing,
    paddingBottom: 24,
  },
  resultsRow: {
    justifyContent: "space-between",
  },
  resultsCount: {
    fontSize: 13,
    color: theme.colors.darkGray,
    marginBottom: 12,
    marginTop: 8,
  },
  emptyResults: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.darkGray,
  },
  browseContent: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: theme.layout.spacing,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.lightGray,
  },
  recentIcon: {
    fontSize: 14,
    marginRight: 12,
  },
  recentText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: theme.colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "500",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.lightGray,
  },
  categoryText: {
    fontSize: 15,
    color: theme.colors.text,
  },
  categoryArrow: {
    fontSize: 22,
    color: theme.colors.mediumGray,
  },
});
