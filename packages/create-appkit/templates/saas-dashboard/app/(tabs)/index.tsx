import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Users, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const STATS = [
  { label: 'Total Users', value: '12,847', change: '+12%', icon: Users, color: theme.colors.info },
  { label: 'Revenue', value: '$48,295', change: '+8%', icon: DollarSign, color: theme.colors.success },
  { label: 'Growth', value: '23.5%', change: '+2.1%', icon: TrendingUp, color: theme.colors.accent },
  { label: 'Orders', value: '1,249', change: '+18%', icon: ShoppingCart, color: theme.colors.warning },
];

const RECENT = [
  { id: '1', user: 'Sarah Chen', action: 'Upgraded to Pro', time: '2 min ago' },
  { id: '2', user: 'James Wilson', action: 'Completed onboarding', time: '15 min ago' },
  { id: '3', user: 'Maria Garcia', action: 'New subscription', time: '1 hr ago' },
  { id: '4', user: 'Alex Kim', action: 'Submitted feedback', time: '3 hrs ago' },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome back, here's your overview</Text>

      <View style={styles.statsGrid}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: s.color + '15' }]}>
              <s.icon size={20} color={s.color} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={[styles.statChange, { color: theme.colors.success }]}>{s.change}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {RECENT.map((item) => (
        <View key={item.id} style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={styles.activityInfo}>
            <Text style={styles.activityUser}>{item.user}</Text>
            <Text style={styles.activityAction}>{item.action}</Text>
          </View>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, paddingHorizontal: 16, paddingTop: 60 },
  subtitle: { fontSize: 14, color: theme.colors.textMuted, paddingHorizontal: 16, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginTop: 20 },
  statCard: { width: '46%', marginHorizontal: '2%', marginBottom: 12, padding: 16, backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
  statIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 22, fontWeight: '700', color: theme.colors.text },
  statLabel: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  statChange: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginHorizontal: 16, marginTop: 24, marginBottom: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.accent },
  activityInfo: { flex: 1, marginLeft: 12 },
  activityUser: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  activityAction: { fontSize: 12, color: theme.colors.textMuted, marginTop: 1 },
  activityTime: { fontSize: 11, color: theme.colors.textMuted },
});
