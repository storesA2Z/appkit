import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import layoutData from "../data/layout.json";
import SectionRenderer, { SectionData } from "../sections/SectionRenderer";
import theme from "../theme/theme";

const homeSections: SectionData[] = (layoutData.pages.home || []) as SectionData[];

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {homeSections.map((section) => (
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
  },
});
