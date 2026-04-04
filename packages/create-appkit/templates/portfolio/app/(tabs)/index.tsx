import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const PROJECTS = [
  { id: '1', title: 'E-Commerce Redesign', tag: 'Mobile App', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600', desc: 'Complete redesign of a fashion shopping experience for iOS and Android.' },
  { id: '2', title: 'Finance Dashboard', tag: 'Web App', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', desc: 'Real-time analytics dashboard for a fintech startup.' },
  { id: '3', title: 'Travel Companion', tag: 'Mobile App', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600', desc: 'AI-powered travel planning app with offline maps.' },
  { id: '4', title: 'Health & Fitness', tag: 'Mobile App', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600', desc: 'Workout tracker with social features and progress analytics.' },
];

export default function WorkScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.greeting}>Hi, I'm Alex</Text>
      <Text style={styles.subtitle}>Mobile & Web Developer</Text>

      {PROJECTS.map((p) => (
        <TouchableOpacity key={p.id} style={styles.card}>
          <Image source={{ uri: p.image }} style={styles.cardImage} />
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTag}>{p.tag}</Text>
              <ArrowUpRight size={16} color={theme.colors.accent} />
            </View>
            <Text style={styles.cardTitle}>{p.title}</Text>
            <Text style={styles.cardDesc}>{p.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  greeting: { fontSize: 32, fontWeight: '700', color: theme.colors.text, paddingHorizontal: 16, paddingTop: 60 },
  subtitle: { fontSize: 16, color: theme.colors.textMuted, paddingHorizontal: 16, marginTop: 4, marginBottom: 24 },
  card: { marginHorizontal: 16, marginBottom: 20, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
  cardImage: { width: '100%', height: 180 },
  cardBody: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTag: { fontSize: 11, fontWeight: '600', color: theme.colors.accent, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginTop: 6 },
  cardDesc: { fontSize: 13, color: theme.colors.textMuted, marginTop: 4, lineHeight: 18 },
});
