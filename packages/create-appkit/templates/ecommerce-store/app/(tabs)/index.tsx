import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../../constants/theme';

const PROMO = { title: 'Summer Sale', subtitle: 'Up to 50% off everything', image: 'https://images.unsplash.com/photo-1558171813-01eda6b4be21?w=800' };

const CATEGORIES = [
  { id: 'women', label: 'Women', emoji: '👗' },
  { id: 'men', label: 'Men', emoji: '👔' },
  { id: 'shoes', label: 'Shoes', emoji: '👟' },
  { id: 'bags', label: 'Bags', emoji: '👜' },
  { id: 'jewelry', label: 'Jewelry', emoji: '💎' },
];

const PRODUCTS = [
  { id: '1', name: 'Cashmere Sweater', price: 89, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', rating: 4.8 },
  { id: '2', name: 'Leather Tote Bag', price: 145, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', rating: 4.6 },
  { id: '3', name: 'Silk Wrap Dress', price: 195, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', rating: 4.9 },
  { id: '4', name: 'White Sneakers', price: 75, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', rating: 4.7 },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Image source={{ uri: PROMO.image }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{PROMO.title}</Text>
          <Text style={styles.heroSub}>{PROMO.subtitle}</Text>
          <TouchableOpacity style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c.id} style={styles.catItem}>
            <View style={styles.catCircle}><Text style={styles.catEmoji}>{c.emoji}</Text></View>
            <Text style={styles.catLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Popular Products</Text>
      <View style={styles.productGrid}>
        {PRODUCTS.map((p) => (
          <TouchableOpacity key={p.id} style={styles.productCard}>
            <Image source={{ uri: p.image }} style={styles.productImage} />
            <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
            <View style={styles.productRow}>
              <Text style={styles.productPrice}>${p.price}</Text>
              <Text style={styles.productRating}>★ {p.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  hero: { height: 220, margin: 16, borderRadius: 16, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },
  heroSub: { fontSize: 14, color: '#ffffffcc', marginTop: 4 },
  heroBtn: { marginTop: 12, backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'flex-start' },
  heroBtnText: { fontSize: 13, fontWeight: '600', color: theme.colors.primary },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginHorizontal: 16, marginTop: 24, marginBottom: 12 },
  catRow: { paddingHorizontal: 12 },
  catItem: { alignItems: 'center', marginHorizontal: 8, width: 64 },
  catCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },
  catEmoji: { fontSize: 24 },
  catLabel: { fontSize: 11, color: theme.colors.textMuted, marginTop: 6 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 32 },
  productCard: { width: '47%', marginHorizontal: '1.5%', marginBottom: 16 },
  productImage: { width: '100%', height: 160, borderRadius: 12, backgroundColor: theme.colors.surface },
  productName: { fontSize: 13, fontWeight: '500', color: theme.colors.text, marginTop: 8 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  productPrice: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  productRating: { fontSize: 12, color: theme.colors.star },
});
