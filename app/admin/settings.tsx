import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function AdminSettingsScreen() {
    const { user } = useAuthContext();
    const logoutMutation = useLogout();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logoutMutation.mutateAsync();
                            // Small delay to ensure state is cleared
                            setTimeout(() => {
                                router.replace('/auth/login');
                            }, 100);
                        } catch (error) {
                            console.error('Logout failed:', error);
                            // Fallback navigation
                            router.replace('/auth/login');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            </View>

            <View style={[styles.profileSection, { backgroundColor: theme.cardBackground }]}>
                <View style={styles.avatarContainer}>
                    {user?.profilePicture ? (
                        <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.tint }]}>
                            <Text style={styles.avatarText}>{user?.firstName?.charAt(0) || 'A'}</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.name, { color: theme.text }]}>{user?.firstName} {user?.lastName}</Text>
                <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email}</Text>
                <View style={[styles.roleBadge, { backgroundColor: theme.tint }]}>
                    <Text style={styles.roleText}>{user?.role}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>

                <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.cardBackground }]} onPress={handleLogout}>
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="log-out-outline" size={24} color={theme.badgeText} />
                        <Text style={[styles.menuItemText, { color: theme.badgeText }]}>Logout</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.version, { color: theme.textSecondary }]}>Version 1.0.0</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileSection: {
        alignItems: 'center',
        padding: 30,
        margin: 20,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarContainer: {
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        marginBottom: 10,
    },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    roleText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        marginHorizontal: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        marginLeft: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    version: {
        fontSize: 12,
    }
});
