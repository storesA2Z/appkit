import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

const SKILLS = ['React Native', 'Expo', 'TypeScript', 'Node.js', 'GraphQL', 'Figma', 'Swift', 'Kotlin'];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.bio}>
        I'm a mobile developer with 5+ years building apps for startups and enterprises.
        I focus on React Native and Expo to ship cross-platform apps fast without sacrificing quality.
      </Text>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.skills}>
        {SKILLS.map((s) => (
          <View key={s} style={styles.skillChip}><Text style={styles.skillText}>{s}</Text></View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  bio: { fontSize: 15, lineHeight: 22, color: theme.colors.textMuted, marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginTop: 32, marginBottom: 12 },
  skills: { flexDirection: 'row', flexWrap: 'wrap' },
  skillChip: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: theme.colors.surface, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, marginRight: 8, marginBottom: 8 },
  skillText: { fontSize: 13, color: theme.colors.text, fontWeight: '500' },
});
