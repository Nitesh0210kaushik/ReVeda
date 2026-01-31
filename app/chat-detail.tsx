import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { ArrowLeft, Video, Phone, Send, Paperclip, MoreVertical } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatDetailScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const params = useLocalSearchParams();
    const doctorName = params.name || 'Dr. Amit Vyas';
    const insets = useSafeAreaInsets();

    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello Doctor, I have been feeling better.', sender: 'me', time: '10:00 AM' },
        { id: 2, text: 'That is great news! Please continue the medication for 3 more days.', sender: 'them', time: '10:02 AM' },
        { id: 3, text: 'Sure, will do. Should I verify the reports again?', sender: 'me', time: '10:05 AM' },
        { id: 4, text: 'Yes, please upload them here when ready.', sender: 'them', time: '10:06 AM' },
    ]);

    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (inputText.trim()) {
            setMessages([...messages, { id: Date.now(), text: inputText, sender: 'me', time: 'Now' }]);
            setInputText('');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>

            {/* Header */}
            <View style={[styles.header, {
                backgroundColor: theme.cardBackground,
                borderBottomColor: theme.borderColor,
                paddingTop: insets.top + 10, // Add a little extra breathing room
                height: 60 + insets.top
            }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
                        <ArrowLeft size={24} color={theme.text} />
                    </TouchableOpacity>
                    <View style={[styles.avatar, { backgroundColor: theme.borderColor }]}>
                        <Text style={{ fontSize: 16 }}>👨‍⚕️</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>{doctorName}</Text>
                        <Text style={{ fontSize: 12, color: theme.success }}>Online</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                    <TouchableOpacity>
                        <Video size={24} color={theme.tint} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Phone size={22} color={theme.tint} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Messages */}
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10 }}>
                {messages.map((msg) => (
                    <View key={msg.id} style={[
                        styles.messageBubble,
                        msg.sender === 'me' ? styles.myMessage : styles.theirMessage,
                        { backgroundColor: msg.sender === 'me' ? theme.tint : theme.cardBackground }
                    ]}>
                        <Text style={[styles.messageText, { color: msg.sender === 'me' ? '#fff' : theme.text }]}>{msg.text}</Text>
                        <Text style={[styles.timeText, { color: msg.sender === 'me' ? 'rgba(255,255,255,0.7)' : theme.textSecondary }]}>{msg.time}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Input Area */}
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderTopColor: theme.borderColor }]}>
                <TouchableOpacity style={{ padding: 8 }}>
                    <Paperclip size={20} color={theme.textSecondary} />
                </TouchableOpacity>
                <TextInput
                    style={[styles.input, { color: theme.text, backgroundColor: theme.background }]}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity onPress={sendMessage} style={[styles.sendButton, { backgroundColor: theme.tint }]}>
                    <Send size={18} color="#fff" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        paddingTop: Platform.OS === 'android' ? 40 : 12
    },
    avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 16, fontWeight: 'bold' },
    messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
    myMessage: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    theirMessage: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 22 },
    timeText: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1 },
    input: { flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16, marginHorizontal: 8 },
    sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
