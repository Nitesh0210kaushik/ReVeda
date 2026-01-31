import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const insets = useSafeAreaInsets();

    const chats = [
        { id: 1, name: 'Dr. Amit Vyas', message: 'Please continue the medication for 3 more days.', time: '10:30 AM', unread: 2 },
        { id: 2, name: 'ReVeda Support', message: 'Your lab report has been verified.', time: 'Yesterday', unread: 0 },
        { id: 3, name: 'Dr. Ananya Sharma', message: 'Ok, see you on Monday.', time: '15 Jan', unread: 0 },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={{ padding: 20 }}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Messages</Text>
                <View style={[styles.searchBar, { backgroundColor: theme.cardBackground, marginTop: 16 }]}>
                    <Search size={20} color={theme.textSecondary} />
                    <Text style={{ color: theme.textSecondary, marginLeft: 10 }}>Search messages</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                {chats.map((chat) => (
                    <TouchableOpacity
                        key={chat.id}
                        style={[styles.chatItem, { borderBottomColor: theme.borderColor }]}
                        onPress={() => router.push({ pathname: '/chat-detail', params: { name: chat.name } })}
                    >
                        <View style={[styles.avatar, { backgroundColor: theme.borderColor }]}>
                            <Text style={{ fontSize: 16 }}>👤</Text>
                        </View>
                        <View style={styles.chatContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[styles.name, { color: theme.text }]}>{chat.name}</Text>
                                <Text style={[styles.time, { color: theme.textSecondary }]}>{chat.time}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text numberOfLines={1} style={[styles.lastMsg, { color: theme.textSecondary, flex: 1 }]}>{chat.message}</Text>
                                {chat.unread > 0 && (
                                    <View style={[styles.badge, { backgroundColor: theme.tint }]}>
                                        <Text style={styles.badgeText}>{chat.unread}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    searchBar: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12 },
    chatItem: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1 },
    avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    chatContent: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    name: { fontSize: 16, fontWeight: 'bold' },
    time: { fontSize: 12 },
    lastMsg: { fontSize: 14 },
    badge: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});
