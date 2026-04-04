import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
});
