import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import layoutData from "../data/layout.json";
import SectionRenderer, { SectionData } from "../sections/SectionRenderer";
import theme from "../theme/theme";

const exploreSections: SectionData[] = (layoutData.pages.explore || []) as SectionData[];

export default function ExploreScreen() {
  if (exploreSections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Explore</Text>
        <Text style={styles.emptyText}>
          Browse categories and discover new products.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {exploreSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.darkGray,
    textAlign: "center",
  },
});
