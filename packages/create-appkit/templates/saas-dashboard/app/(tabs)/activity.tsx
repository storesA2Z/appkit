import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

const EVENTS = [
  { id: '1', title: 'New user signup', detail: 'sarah@example.com joined via invite link', time: 'Today, 2:14 PM', dot: theme.colors.success },
  { id: '2', title: 'Payment received', detail: '$299 from James Wilson (Pro plan)', time: 'Today, 11:30 AM', dot: theme.colors.info },
  { id: '3', title: 'Support ticket', detail: 'Maria Garcia reported login issue #482', time: 'Yesterday, 4:55 PM', dot: theme.colors.warning },
  { id: '4', title: 'Deploy completed', detail: 'v2.4.1 deployed to production', time: 'Yesterday, 2:00 PM', dot: theme.colors.accent },
  { id: '5', title: 'API rate limit', detail: '3 endpoints exceeded 1000 req/min', time: 'Yesterday, 9:20 AM', dot: theme.colors.error },
];

export default function ActivityScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Activity</Text>
      {EVENTS.map((e) => (
        <View key={e.id} style={styles.event}>
          <View style={[styles.dot, { backgroundColor: e.dot }]} />
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{e.title}</Text>
            <Text style={styles.eventDetail}>{e.detail}</Text>
            <Text style={styles.eventTime}>{e.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text, paddingHorizontal: 16, marginBottom: 16 },
  event: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  eventContent: { flex: 1, marginLeft: 12 },
  eventTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  eventDetail: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  eventTime: { fontSize: 11, color: theme.colors.textMuted, marginTop: 4 },
});
