import { View, Text, TextInput, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const ALL_PRODUCTS = [
  { id: '1', name: 'Cashmere Sweater', price: 89, category: 'Women', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400' },
  { id: '2', name: 'Leather Tote Bag', price: 145, category: 'Bags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400' },
  { id: '3', name: 'Silk Wrap Dress', price: 195, category: 'Women', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
  { id: '4', name: 'White Sneakers', price: 75, category: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  { id: '5', name: 'Denim Jacket', price: 110, category: 'Men', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
  { id: '6', name: 'Gold Earrings', price: 42, category: 'Jewelry', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400' },
];

export default function ShopScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Shop</Text>
      <View style={styles.searchBar}>
        <Search size={18} color={theme.colors.textMuted} />
        <TextInput placeholder="Search products..." placeholderTextColor={theme.colors.textMuted} style={styles.searchInput} />
      </View>
      <View style={styles.grid}>
        {ALL_PRODUCTS.map((p) => (
          <TouchableOpacity key={p.id} style={styles.card}>
            <Image source={{ uri: p.image }} style={styles.cardImage} />
            <Text style={styles.cardCategory}>{p.category}</Text>
            <Text style={styles.cardName} numberOfLines={1}>{p.name}</Text>
            <Text style={styles.cardPrice}>${p.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, paddingHorizontal: 16, paddingTop: 60 },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 14, height: 44, backgroundColor: theme.colors.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: theme.colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 32 },
  card: { width: '47%', marginHorizontal: '1.5%', marginBottom: 16 },
  cardImage: { width: '100%', height: 180, borderRadius: 12, backgroundColor: theme.colors.surface },
  cardCategory: { fontSize: 10, fontWeight: '600', color: theme.colors.accent, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardName: { fontSize: 13, fontWeight: '500', color: theme.colors.text, marginTop: 2 },
  cardPrice: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginTop: 4 },
});
