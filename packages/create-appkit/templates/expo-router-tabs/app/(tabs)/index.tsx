import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to your app</Text>
        <Text style={styles.subtitle}>Start building something amazing</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24 },
  header: { paddingTop: 60, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 16, color: theme.colors.textMuted, marginTop: 8 },
});
