import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import layoutData from "../data/layout.json";
import SectionRenderer, { SectionData } from "../sections/SectionRenderer";
import theme from "../theme/theme";

const profileSections: SectionData[] = (layoutData.pages.profile || []) as SectionData[];

const menuItems = [
  { id: "orders", title: "My Orders", icon: "\u{1F4E6}" },
  { id: "wishlist", title: "Wishlist", icon: "\u2665" },
  { id: "addresses", title: "Addresses", icon: "\u{1F4CD}" },
  { id: "payment", title: "Payment Methods", icon: "\u{1F4B3}" },
  { id: "notifications", title: "Notifications", icon: "\u{1F514}" },
  { id: "settings", title: "Settings", icon: "\u2699" },
  { id: "help", title: "Help & Support", icon: "\u2753" },
];

export default function ProfileScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Jane Doe</Text>
          <Text style={styles.profileEmail}>jane.doe@example.com</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.6}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuArrow}>{"\u203A"}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {profileSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.layout.spacing,
    paddingTop: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  profileEmail: {
    fontSize: 13,
    color: theme.colors.darkGray,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.layout.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.lightGray,
    marginHorizontal: theme.layout.spacing,
    borderRadius: theme.layout.borderRadius,
    paddingVertical: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.darkGray,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.mediumGray,
  },
  menuContainer: {
    marginHorizontal: theme.layout.spacing,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.lightGray,
  },
  menuIcon: {
    fontSize: 20,
    width: 32,
    textAlign: "center",
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: 12,
  },
  menuArrow: {
    fontSize: 22,
    color: theme.colors.mediumGray,
  },
  logoutButton: {
    marginHorizontal: theme.layout.spacing,
    paddingVertical: 14,
    borderRadius: theme.layout.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    alignItems: "center",
  },
  logoutText: {
    color: theme.colors.accent,
    fontSize: 15,
    fontWeight: "600",
  },
});
