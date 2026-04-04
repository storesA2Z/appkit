import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Send } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function ContactScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Get in Touch</Text>
      <Text style={styles.subtitle}>Have a project in mind? Let's talk.</Text>
      <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={theme.colors.textMuted} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={theme.colors.textMuted} keyboardType="email-address" />
      <TextInput style={[styles.input, styles.textarea]} placeholder="Message" placeholderTextColor={theme.colors.textMuted} multiline numberOfLines={5} textAlignVertical="top" />
      <TouchableOpacity style={styles.btn}>
        <Send size={16} color="#fff" />
        <Text style={styles.btnText}>Send Message</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  subtitle: { fontSize: 15, color: theme.colors.textMuted, marginTop: 4, marginBottom: 24 },
  input: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: theme.colors.text, marginBottom: 12 },
  textarea: { height: 120 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.accent, paddingVertical: 14, borderRadius: 10, marginTop: 8 },
  btnText: { fontSize: 15, fontWeight: '600', color: '#fff', marginLeft: 8 },
});
