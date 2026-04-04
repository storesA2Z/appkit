import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Package, Heart, MapPin, Settings, ChevronRight } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const MENU = [
  { icon: Package, label: 'My Orders' },
  { icon: Heart, label: 'Wishlist' },
  { icon: MapPin, label: 'Addresses' },
  { icon: Settings, label: 'Settings' },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>G</Text></View>
        <Text style={styles.name}>Guest User</Text>
        <Text style={styles.email}>Sign in for a personalized experience</Text>
      </View>
      {MENU.map((item) => (
        <TouchableOpacity key={item.label} style={styles.menuItem}>
          <item.icon size={20} color={theme.colors.textMuted} />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <ChevronRight size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { alignItems: 'center', paddingTop: 80, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  name: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginTop: 12 },
  email: { fontSize: 13, color: theme.colors.textMuted, marginTop: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  menuLabel: { flex: 1, fontSize: 15, color: theme.colors.text, marginLeft: 12 },
});
