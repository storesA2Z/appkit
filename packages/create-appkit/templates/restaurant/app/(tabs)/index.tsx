import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const HERO = { title: 'Fresh & Delicious', subtitle: 'Order your favorite meals', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800' };

const CATEGORIES = [
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'sushi', label: 'Sushi', emoji: '🍣' },
  { id: 'salads', label: 'Salads', emoji: '🥗' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
];

const FEATURED = [
  { id: '1', name: 'Classic Burger', price: 12.99, time: '15 min', rating: 4.8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { id: '2', name: 'Margherita Pizza', price: 14.99, time: '20 min', rating: 4.9, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
  { id: '3', name: 'Salmon Sushi Roll', price: 16.99, time: '25 min', rating: 4.7, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
  { id: '4', name: 'Caesar Salad', price: 9.99, time: '10 min', rating: 4.5, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
];

export default function MenuScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Image source={{ uri: HERO.image }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{HERO.title}</Text>
          <Text style={styles.heroSub}>{HERO.subtitle}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c.id} style={styles.catChip}>
            <Text style={styles.catEmoji}>{c.emoji}</Text>
            <Text style={styles.catLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Featured</Text>
      {FEATURED.map((item) => (
        <TouchableOpacity key={item.id} style={styles.foodCard}>
          <Image source={{ uri: item.image }} style={styles.foodImage} />
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{item.name}</Text>
            <View style={styles.foodMeta}>
              <Star size={12} color={theme.colors.star} fill={theme.colors.star} />
              <Text style={styles.foodRating}>{item.rating}</Text>
              <Text style={styles.foodTime}>{item.time}</Text>
            </View>
            <Text style={styles.foodPrice}>${item.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  hero: { height: 200, margin: 16, borderRadius: 16, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end', padding: 20 },
  heroTitle: { fontSize: 26, fontWeight: '700', color: '#fff' },
  heroSub: { fontSize: 13, color: '#ffffffcc', marginTop: 4 },
  catRow: { paddingHorizontal: 12, marginTop: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, marginHorizontal: 4, backgroundColor: theme.colors.surface, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border },
  catEmoji: { fontSize: 16, marginRight: 6 },
  catLabel: { fontSize: 13, fontWeight: '500', color: theme.colors.text },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginHorizontal: 16, marginTop: 24, marginBottom: 12 },
  foodCard: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, padding: 12, backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
  foodImage: { width: 80, height: 80, borderRadius: 10 },
  foodInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  foodName: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  foodMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  foodRating: { fontSize: 12, color: theme.colors.textMuted, marginLeft: 3, marginRight: 10 },
  foodTime: { fontSize: 12, color: theme.colors.textMuted },
  foodPrice: { fontSize: 16, fontWeight: '700', color: theme.colors.accent, marginTop: 4 },
});
