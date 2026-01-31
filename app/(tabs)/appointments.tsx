import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { Calendar, Clock, Video, MoreHorizontal, MapPin } from 'lucide-react-native';

export default function AppointmentsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const insets = useSafeAreaInsets();

    const appointments = [
        { id: 1, doctor: 'Dr. Amit Vyas', type: 'Video Consult', date: 'Today, 17 Jan', time: '10:00 AM', status: 'Upcoming', image: 'https://i.pravatar.cc/100?img=11' },
        { id: 2, doctor: 'Dr. Ananya Sharma', type: 'Clinic Visit', date: '20 Jan 2024', time: '04:00 PM', status: 'Confirmed', image: 'https://i.pravatar.cc/100?img=5' },
        { id: 3, doctor: 'Dr. Rajesh Kumar', type: 'Follow-up', date: '12 Jan 2024', time: 'Completed', status: 'Completed', image: 'https://i.pravatar.cc/100?img=13' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming': return '#2196F3';
            case 'Confirmed': return theme.tint; // Primary Green
            case 'Completed': return theme.textSecondary;
            default: return theme.textSecondary;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={{ padding: 20, paddingBottom: 10 }}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>My Appointments</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                {appointments.map((appt) => (
                    <View key={appt.id} style={[styles.card, { backgroundColor: theme.cardBackground }]}>

                        {/* Header: Date & Status */}
                        <View style={[styles.cardHeader, { borderBottomColor: theme.borderColor }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Calendar size={14} color={theme.textSecondary} />
                                <Text style={[styles.dateText, { color: theme.textSecondary }]}>{appt.date} • {appt.time}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appt.status) + '20' }]}>
                                <Text style={[styles.statusText, { color: getStatusColor(appt.status) }]}>{appt.status}</Text>
                            </View>
                        </View>

                        {/* Body: Doctor Info */}
                        <View style={styles.cardBody}>
                            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.borderColor }]}>
                                {/* Placeholder for Avatar */}
                                <Text style={{ fontSize: 18 }}>👨‍⚕️</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[styles.docName, { color: theme.text }]}>{appt.doctor}</Text>
                                <Text style={[styles.docType, { color: theme.textSecondary }]}>{appt.type}</Text>
                            </View>
                            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.borderColor }]}>
                                <Video size={18} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        {/* Footer: Actions */}
                        <View style={{ flexDirection: 'row', marginTop: 16 }}>
                            <TouchableOpacity style={[styles.actionButton, { borderColor: theme.borderColor, marginRight: 10 }]}>
                                <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>Reschedule</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.tint, borderColor: theme.tint }]}>
                                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>View Details</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    card: { borderRadius: 16, marginBottom: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, marginBottom: 12 },
    dateText: { marginLeft: 6, fontSize: 12, fontWeight: '500' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    cardBody: { flexDirection: 'row', alignItems: 'center' },
    avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    docName: { fontSize: 16, fontWeight: 'bold' },
    docType: { fontSize: 13 },
    iconButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    actionButton: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
});
