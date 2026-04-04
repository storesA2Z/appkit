import { View, Text, StyleSheet } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <View style={styles.empty}>
        <ClipboardList size={48} color={theme.colors.border} />
        <Text style={styles.emptyText}>No orders yet</Text>
        <Text style={styles.emptySub}>Your order history will appear here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, paddingHorizontal: 16, paddingTop: 60 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyText: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginTop: 16 },
  emptySub: { fontSize: 13, color: theme.colors.textMuted, marginTop: 4 },
});
