import type { AppLayout, ThemeConfig } from '@appkit/schema';

export interface ExpoProjectFile {
  path: string;
  content: string;
}

export function generateExpoProject(layout: AppLayout): ExpoProjectFile[] {
  const files: ExpoProjectFile[] = [];

  files.push({ path: 'src/data/layout.json', content: JSON.stringify(layout, null, 2) });
  files.push({ path: 'src/theme/theme.ts', content: generateThemeFile() });
  files.push({ path: 'package.json', content: generatePackageJson(layout.metadata.name) });
  files.push({ path: 'app.json', content: generateAppJson(layout.metadata) });
  files.push({ path: 'tsconfig.json', content: generateTsConfig() });
  files.push({ path: 'App.tsx', content: generateAppEntry() });
  files.push({ path: 'src/navigation/BottomTabs.tsx', content: generateBottomTabs() });
  files.push({ path: 'src/screens/HomeScreen.tsx', content: generatePageScreen('home') });
  files.push({ path: 'src/screens/ExploreScreen.tsx', content: generatePageScreen('explore') });
  files.push({ path: 'src/screens/SearchScreen.tsx', content: generateSearchScreen() });
  files.push({ path: 'src/screens/ProfileScreen.tsx', content: generateProfileScreen() });
  files.push({ path: 'src/sections/SectionRenderer.tsx', content: generateSectionRenderer() });
  files.push({ path: 'src/sections/custom-registry.ts', content: generateCustomRegistry() });
  files.push({ path: 'src/data/mock-data.ts', content: generateMockData() });
  files.push({ path: 'src/components/ProductCard.tsx', content: generateProductCard() });

  const sectionTypes = [
    'BannerSection', 'CategoriesSection', 'ProductsSection', 'CollectionsSection',
    'HeaderSection', 'VideoSection', 'FlashSaleSection', 'ReviewsSection',
    'OfferSection', 'HeroSection', 'TabsSection', 'MarqueeSection',
  ];
  for (const name of sectionTypes) {
    files.push({ path: `src/sections/${name}.tsx`, content: generateSectionStub(name) });
  }

  return files;
}

function generateThemeFile(): string {
  return `import layoutData from "../data/layout.json";

function parseNumeric(value: string | number): number {
  if (typeof value === "number") return value;
  return parseInt(value.replace(/[^0-9.]/g, ""), 10) || 0;
}

const rawTheme = layoutData.theme;

export const theme = {
  colors: {
    primary: rawTheme.colors.primary,
    secondary: rawTheme.colors.secondary,
    accent: rawTheme.colors.accent,
    background: rawTheme.colors.background,
    text: rawTheme.colors.text,
    lightGray: "#f5f5f5",
    mediumGray: "#cccccc",
    darkGray: "#666666",
    white: "#ffffff",
    black: "#000000",
    star: "#FFB800",
    error: "#ff4444",
    success: "#00C851",
  },
  typography: {
    fontFamily: rawTheme.typography.fontFamily,
    fontSize: parseNumeric(rawTheme.typography.fontSize),
    fontWeight: rawTheme.typography.fontWeight as "400" | "500" | "600" | "700",
  },
  layout: {
    borderRadius: parseNumeric(rawTheme.layout.borderRadius),
    spacing: parseNumeric(rawTheme.layout.spacing),
  },
};

export type Theme = typeof theme;
export default theme;
`;
}

function generatePackageJson(name: string): string {
  return JSON.stringify({
    name: name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    main: 'App.tsx',
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
      build: 'eas build',
    },
    dependencies: {
      'expo': '~52.0.0',
      'react': '18.3.1',
      'react-native': '0.76.0',
      '@react-navigation/bottom-tabs': '^7.0.0',
      '@react-navigation/native': '^7.0.0',
      'react-native-screens': '~4.4.0',
      'react-native-safe-area-context': '~5.0.0',
      '@expo/vector-icons': '^14.0.0',
    },
    devDependencies: {
      'typescript': '^5.8.0',
      '@types/react': '^18.2.0',
    },
  }, null, 2);
}

function generateAppJson(metadata: { name: string; description: string; version: string; icon?: string; splash?: string }): string {
  const slug = metadata.name.toLowerCase().replace(/\s+/g, '-');
  return JSON.stringify({
    expo: {
      name: metadata.name,
      slug,
      version: metadata.version,
      orientation: 'portrait',
      icon: metadata.icon || './assets/icon.png',
      splash: { image: metadata.splash || './assets/splash.png', resizeMode: 'contain', backgroundColor: '#ffffff' },
      ios: { supportsTablet: true, bundleIdentifier: `com.appkit.${slug.replace(/-/g, '')}` },
      android: { adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' }, package: `com.appkit.${slug.replace(/-/g, '')}` },
    },
  }, null, 2);
}

function generateTsConfig(): string {
  return JSON.stringify({
    extends: 'expo/tsconfig.base',
    compilerOptions: { strict: true, resolveJsonModule: true },
  }, null, 2);
}

function generateAppEntry(): string {
  return `import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomTabs from "./src/navigation/BottomTabs";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <BottomTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
`;
}

function generateBottomTabs(): string {
  return `import React from "react";
import { StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";
import theme from "../theme/theme";

const Tab = createBottomTabNavigator();

type IoniconsName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { focused: IoniconsName; default: IoniconsName }> = {
  Home: { focused: "home", default: "home-outline" },
  Explore: { focused: "compass", default: "compass-outline" },
  Search: { focused: "search", default: "search-outline" },
  Profile: { focused: "person", default: "person-outline" },
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name] || TAB_ICONS.Home;
          const iconName = focused ? icons.focused : icons.default;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.darkGray,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: "Explore" }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: "Search" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.lightGray,
    paddingTop: 4,
    height: Platform.OS === "ios" ? 88 : 64,
  },
  tabLabel: { fontSize: 11, fontWeight: "600", marginBottom: Platform.OS === "ios" ? 0 : 8 },
  header: {
    backgroundColor: theme.colors.white,
    shadowColor: "transparent",
    elevation: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.lightGray,
  },
  headerTitle: { fontWeight: "700", fontSize: 17, color: theme.colors.text },
});
`;
}

function generatePageScreen(page: string): string {
  const capitalized = page.charAt(0).toUpperCase() + page.slice(1);
  return `import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import layoutData from "../data/layout.json";
import SectionRenderer, { SectionData } from "../sections/SectionRenderer";
import theme from "../theme/theme";

const sections: SectionData[] = ((layoutData.pages as any).${page}?.sections || []) as SectionData[];

export default function ${capitalized}Screen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 24 },
});
`;
}

function generateSearchScreen(): string {
  return `import React, { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import layoutData from "../data/layout.json";
import SectionRenderer, { SectionData } from "../sections/SectionRenderer";
import ProductCard from "../components/ProductCard";
import theme from "../theme/theme";
import { products, categories } from "../data/mock-data";

const searchSections: SectionData[] = ((layoutData.pages as any).search?.sections || []) as SectionData[];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (query.trim().length === 0) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) || p.collection.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          placeholderTextColor={theme.colors.darkGray}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Text style={styles.clearButton}>\\u2715</Text>
          </TouchableOpacity>
        )}
      </View>
      {query.trim().length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsContent}
          columnWrapperStyle={styles.resultsRow}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <Text style={styles.emptyText}>No products found for "{query}"</Text>
            </View>
          }
          renderItem={({ item }) => <ProductCard product={item} size="medium" />}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.browseContent} showsVerticalScrollIndicator={false}>
          {searchSections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: theme.layout.spacing, marginTop: 12, marginBottom: 8,
    backgroundColor: theme.colors.lightGray, borderRadius: theme.layout.borderRadius,
    paddingHorizontal: 14, height: 46,
  },
  input: { flex: 1, fontSize: 15, color: theme.colors.text, paddingVertical: 0 },
  clearButton: { fontSize: 16, color: theme.colors.darkGray, padding: 4 },
  resultsContent: { paddingHorizontal: theme.layout.spacing, paddingBottom: 24 },
  resultsRow: { justifyContent: "space-between" },
  emptyResults: { paddingVertical: 48, alignItems: "center" },
  emptyText: { fontSize: 15, color: theme.colors.darkGray },
  browseContent: { paddingBottom: 24 },
});
`;
}

function generateProfileScreen(): string {
  return `import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import layoutData from "../data/layout.json";
import SectionRenderer, { SectionData } from "../sections/SectionRenderer";
import theme from "../theme/theme";

const profileSections: SectionData[] = ((layoutData.pages as any).profile?.sections || []) as SectionData[];

const menuItems = [
  { label: "My Orders", icon: "\\u{1F4E6}" },
  { label: "Wishlist", icon: "\\u2764\\uFE0F" },
  { label: "Addresses", icon: "\\u{1F4CD}" },
  { label: "Settings", icon: "\\u2699\\uFE0F" },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>G</Text>
        </View>
        <Text style={styles.name}>Guest User</Text>
        <Text style={styles.email}>Sign in for a personalized experience</Text>
      </View>
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>\\u203A</Text>
          </TouchableOpacity>
        ))}
      </View>
      {profileSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 24 },
  header: { alignItems: "center", paddingVertical: 32, backgroundColor: theme.colors.white, borderBottomWidth: 1, borderBottomColor: theme.colors.lightGray },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  avatarText: { color: theme.colors.white, fontSize: 28, fontWeight: "700" },
  name: { fontSize: 18, fontWeight: "600", color: theme.colors.text, marginBottom: 4 },
  email: { fontSize: 13, color: theme.colors.darkGray },
  menu: { backgroundColor: theme.colors.white, marginTop: 12, marginBottom: 12 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.lightGray },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, color: theme.colors.text },
  menuArrow: { fontSize: 22, color: theme.colors.darkGray },
});
`;
}

function generateSectionRenderer(): string {
  return `import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme/theme";

import BannerSection from "./BannerSection";
import CategoriesSection from "./CategoriesSection";
import ProductsSection from "./ProductsSection";
import CollectionsSection from "./CollectionsSection";
import HeaderSection from "./HeaderSection";
import VideoSection from "./VideoSection";
import FlashSaleSection from "./FlashSaleSection";
import ReviewsSection from "./ReviewsSection";
import OfferSection from "./OfferSection";
import HeroSection from "./HeroSection";
import TabsSection from "./TabsSection";
import MarqueeSection from "./MarqueeSection";
import { customSectionRegistry } from "./custom-registry";

export interface SectionData {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

const builtInSections: Record<string, React.ComponentType<{ config: any }>> = {
  banner: BannerSection,
  categories: CategoriesSection,
  products: ProductsSection,
  collections: CollectionsSection,
  header: HeaderSection,
  video: VideoSection,
  flash_sale: FlashSaleSection,
  reviews: ReviewsSection,
  offer: OfferSection,
  hero: HeroSection,
  tabs: TabsSection,
  marquee: MarqueeSection,
};

export default function SectionRenderer({ section }: { section: SectionData }) {
  const { type, config } = section;

  if (type === "custom") {
    const customConfig = (config as any).customConfig;
    const componentName = customConfig?.componentName;
    const CustomComponent = componentName ? customSectionRegistry[componentName] : null;
    if (CustomComponent) return <CustomComponent {...(customConfig?.props || {})} />;
    return (
      <View style={styles.customFallback}>
        <Text style={styles.customText}>{customConfig?.fallbackText || \`Custom: \${componentName || "unset"}\`}</Text>
      </View>
    );
  }

  const BuiltIn = builtInSections[type];
  if (BuiltIn) return <BuiltIn config={config as any} />;

  return (
    <View style={styles.unknown}>
      <Text style={styles.unknownText}>Unknown section type: {type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  unknown: { padding: theme.layout.spacing, marginHorizontal: theme.layout.spacing, marginBottom: theme.layout.spacing, backgroundColor: theme.colors.lightGray, borderRadius: theme.layout.borderRadius, alignItems: "center" },
  unknownText: { color: theme.colors.darkGray, fontSize: 13, fontStyle: "italic" },
  customFallback: { padding: theme.layout.spacing, marginHorizontal: theme.layout.spacing, marginBottom: theme.layout.spacing, backgroundColor: theme.colors.lightGray, borderRadius: theme.layout.borderRadius, borderWidth: 1, borderColor: theme.colors.mediumGray, borderStyle: "dashed", alignItems: "center" },
  customText: { color: theme.colors.darkGray, fontSize: 13 },
});
`;
}

function generateCustomRegistry(): string {
  return `import type { ComponentType } from "react";

/**
 * Custom Section Registry
 *
 * Register your own React Native components here to use them as
 * custom sections in your appkit layout. The key must match the
 * componentName you set in the builder's custom section config.
 *
 * Props configured in the builder are passed directly to your component.
 */
export const customSectionRegistry: Record<string, ComponentType<any>> = {};
`;
}

function generateMockData(): string {
  return `export interface Product {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  collection: string;
}

export interface Category {
  id: string;
  title: string;
  image: string;
}

export const products: Product[] = [
  { id: "p1", title: "Cashmere Sweater", price: 89, compareAtPrice: 120, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", rating: 4.8, reviewCount: 124, collection: "women" },
  { id: "p2", title: "Leather Tote Bag", price: 145, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400", rating: 4.6, reviewCount: 89, collection: "bags" },
  { id: "p3", title: "Silk Wrap Dress", price: 195, compareAtPrice: 260, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", rating: 4.9, reviewCount: 67, collection: "women" },
  { id: "p4", title: "White Sneakers", price: 75, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400", rating: 4.7, reviewCount: 203, collection: "shoes" },
  { id: "p5", title: "Denim Jacket", price: 110, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", rating: 4.5, reviewCount: 156, collection: "men" },
  { id: "p6", title: "Gold Hoop Earrings", price: 42, compareAtPrice: 58, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400", rating: 4.9, reviewCount: 312, collection: "jewelry" },
];

export const categories: Category[] = [
  { id: "women", title: "Women", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200" },
  { id: "men", title: "Men", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
  { id: "shoes", title: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" },
  { id: "bags", title: "Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200" },
  { id: "jewelry", title: "Jewelry", image: "https://images.unsplash.com/photo-1515562141589-67f0d569b610?w=200" },
];
`;
}

function generateProductCard(): string {
  return `import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import theme from "../theme/theme";
import { Product } from "../data/mock-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ProductCardProps {
  product: Product;
  size?: "small" | "medium" | "large";
  onPress?: () => void;
}

export default function ProductCard({ product, size = "medium", onPress }: ProductCardProps) {
  const cardWidth = size === "small" ? SCREEN_WIDTH * 0.35 : size === "large" ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.44;
  const imageHeight = size === "small" ? 120 : size === "large" ? 240 : 180;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0;

  return (
    <TouchableOpacity style={[styles.container, { width: cardWidth }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercent}%</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>\${product.price.toFixed(2)}</Text>
          {hasDiscount && <Text style={styles.comparePrice}>\${product.compareAtPrice!.toFixed(2)}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { marginRight: theme.layout.spacing * 0.75, marginBottom: theme.layout.spacing },
  imageContainer: { borderRadius: theme.layout.borderRadius, overflow: "hidden", backgroundColor: theme.colors.lightGray },
  image: { width: "100%", height: "100%" },
  discountBadge: { position: "absolute", top: 8, left: 8, backgroundColor: theme.colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  discountText: { color: theme.colors.white, fontSize: 11, fontWeight: "700" },
  info: { paddingTop: 8 },
  title: { fontSize: theme.typography.fontSize, fontWeight: "500", color: theme.colors.text, marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { fontSize: theme.typography.fontSize + 2, fontWeight: "700", color: theme.colors.text },
  comparePrice: { fontSize: theme.typography.fontSize - 1, color: theme.colors.darkGray, textDecorationLine: "line-through", marginLeft: 8 },
});
`;
}

function generateSectionStub(name: string): string {
  return `import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme/theme";

export default function ${name}({ config }: { config: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${name.replace('Section', '')} Section</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.layout.spacing,
    marginBottom: theme.layout.spacing * 0.5,
  },
  text: {
    fontSize: theme.typography.fontSize,
    color: theme.colors.text,
    fontWeight: "600",
  },
});
`;
}
