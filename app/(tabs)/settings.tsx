import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { router } from 'expo-router';
import { useAuthContext } from '../../context/AuthContext';
import { LogOut } from 'lucide-react-native';
import { useLogout } from '../../hooks/useAuth';
import Toast from 'react-native-toast-message';

// Backend URL
const API_URL = 'http://localhost:5000';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { user, refreshAuth } = useAuthContext();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      refreshAuth(); // Update context state

      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'Come back soon! 👋',
      });

      // Navigate to login
      router.replace('/auth/login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Please try again.',
      });
    }
  };

  // Group settings for better structure
  const accountSettings = [
    { label: 'Account', action: () => router.push('/(tabs)/profile-details') },
    { label: 'Privacy', action: () => { } },
    { label: 'Avatar', action: () => { } },
    { label: 'Chats', action: () => { } },
  ];

  // Add Doctor Recruitment for Marketing and Admin roles
  if (user?.role === 'Marketing' || user?.role === 'Admin') {
    accountSettings.push({ label: 'Doctor Recruitment', action: () => router.push('/doctor-recruitment') });
  }
  const appSettings = ['Notifications', 'Storage and Data', 'App Language', 'Help'];

  // Construct full image URL
  const profileImageUrl = user?.profilePicture
    ? `${API_URL}/${user.profilePicture.replace(/\\/g, '/')}`
    : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Profile Header Block */}
      <TouchableOpacity
        style={[styles.profileHeader, { backgroundColor: theme.cardBackground, borderBottomColor: theme.borderColor, marginTop: insets.top }]}
        onPress={() => router.push('/(tabs)/profile-details')}
      >
        <View style={styles.avatarContainer}>
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>{user?.firstName?.[0] || '?'}{user?.lastName?.[0] || '?'}</Text>
          )}
        </View>
        <View>
          <Text style={[styles.profileName, { color: theme.text }]}>{user?.firstName} {user?.lastName}</Text>
          <Text style={[styles.profileSubtitle, { color: theme.textSecondary }]}>Hey there! I am using ReVeda.</Text>
        </View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Section 1 */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor, borderTopColor: theme.borderColor }]}>
          {accountSettings.map((option, index) => (
            <View key={option.label}>
              <TouchableOpacity style={styles.optionRow} onPress={option.action}>
                <Text style={[styles.optionText, { color: theme.text }]}>{option.label}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 16 }}>›</Text>
              </TouchableOpacity>
              {index < accountSettings.length - 1 && <View style={[styles.separator, { backgroundColor: theme.borderColor }]} />}
            </View>
          ))}
        </View>

        {/* Section 2 */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor, borderTopColor: theme.borderColor }]}>
          {appSettings.map((option, index) => (
            <View key={option}>
              <TouchableOpacity style={styles.optionRow}>
                <Text style={[styles.optionText, { color: theme.text }]}>{option}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 16 }}>›</Text>
              </TouchableOpacity>
              {index < appSettings.length - 1 && <View style={[styles.separator, { backgroundColor: theme.borderColor }]} />}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.cardBackground, flexDirection: 'row', justifyContent: 'center' }]}
          onPress={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <ActivityIndicator color="#e74c3c" />
          ) : (
            <>
              <LogOut size={20} color="#e74c3c" style={{ marginRight: 8 }} />
              <Text style={styles.logoutText}>Log Out</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.versionText}>ReVeda v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSpace: { height: 20 },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
  },
  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 30,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 20,
  },
  logoutButton: {
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: '#999',
  },
});
