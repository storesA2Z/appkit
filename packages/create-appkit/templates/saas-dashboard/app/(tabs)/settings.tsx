import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Bell, Moon, Shield, Globe, ChevronRight } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const TOGGLES = [
  { icon: Bell, label: 'Push Notifications', defaultValue: true },
  { icon: Moon, label: 'Dark Mode', defaultValue: false },
  { icon: Shield, label: 'Two-Factor Auth', defaultValue: true },
];

const LINKS = [
  { icon: Globe, label: 'Language' },
];

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {TOGGLES.map((item) => (
        <View key={item.label} style={styles.row}>
          <item.icon size={20} color={theme.colors.textMuted} />
          <Text style={styles.rowLabel}>{item.label}</Text>
          <Switch value={item.defaultValue} trackColor={{ true: theme.colors.accent }} />
        </View>
      ))}
      {LINKS.map((item) => (
        <TouchableOpacity key={item.label} style={styles.row}>
          <item.icon size={20} color={theme.colors.textMuted} />
          <Text style={styles.rowLabel}>{item.label}</Text>
          <ChevronRight size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, paddingHorizontal: 16, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface },
  rowLabel: { flex: 1, fontSize: 15, color: theme.colors.text, marginLeft: 12 },
});
