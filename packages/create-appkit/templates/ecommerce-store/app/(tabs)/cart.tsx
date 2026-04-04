import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const CART_ITEMS = [
  { id: '1', name: 'Cashmere Sweater', price: 89, qty: 1, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200' },
  { id: '3', name: 'Silk Wrap Dress', price: 195, qty: 2, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200' },
];

const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <ScrollView style={styles.list}>
        {CART_ITEMS.map((item) => (
          <View key={item.id} style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn}><Minus size={14} color={theme.colors.text} /></TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity style={styles.qtyBtn}><Plus size={14} color={theme.colors.text} /></TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn}><Trash2 size={14} color={theme.colors.error} /></TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>${subtotal}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, paddingHorizontal: 16, paddingTop: 60 },
  list: { flex: 1, paddingHorizontal: 16, marginTop: 16 },
  item: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  itemImage: { width: 72, height: 72, borderRadius: 8, backgroundColor: theme.colors.surface },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '500', color: theme.colors.text },
  itemPrice: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },
  qtyText: { fontSize: 14, fontWeight: '600', marginHorizontal: 12, color: theme.colors.text },
  deleteBtn: { marginLeft: 'auto' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: theme.colors.border },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 16, color: theme.colors.textMuted },
  totalValue: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  checkoutBtn: { backgroundColor: theme.colors.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  checkoutText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
