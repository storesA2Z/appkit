import { Tabs } from 'expo-router';
import { Briefcase, UserCircle, Mail } from 'lucide-react-native';
import { theme } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Work', tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} /> }} />
      <Tabs.Screen name="about" options={{ title: 'About', tabBarIcon: ({ color, size }) => <UserCircle color={color} size={size} /> }} />
      <Tabs.Screen name="contact" options={{ title: 'Contact', tabBarIcon: ({ color, size }) => <Mail color={color} size={size} /> }} />
    </Tabs>
  );
}
