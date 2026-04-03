import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme/theme";

interface HeaderSectionProps {
  config: {
    headerConfig?: {
      title: string;
      subtitle?: string;
      showUnderline?: boolean;
      alignment?: "left" | "center" | "right";
    };
    title?: string;
    subtitle?: string;
    showUnderline?: boolean;
    alignment?: "left" | "center" | "right";
  };
}

export default function HeaderSection({ config }: HeaderSectionProps) {
  const headerConfig = config.headerConfig || config;
  const title = headerConfig.title || "Section Title";
  const subtitle = headerConfig.subtitle;
  const showUnderline = headerConfig.showUnderline !== false;
  const alignment = headerConfig.alignment || "left";

  const textAlign = alignment;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { textAlign }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { textAlign }]}>{subtitle}</Text>
      )}
      {showUnderline && (
        <View
          style={[
            styles.underline,
            alignment === "center" && styles.underlineCenter,
            alignment === "right" && styles.underlineRight,
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.layout.spacing,
    paddingVertical: theme.layout.spacing * 0.75,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.darkGray,
    marginBottom: 8,
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
    marginTop: 8,
  },
  underlineCenter: {
    alignSelf: "center",
  },
  underlineRight: {
    alignSelf: "flex-end",
  },
});
