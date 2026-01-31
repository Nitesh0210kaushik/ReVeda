import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Theme } from '../../constants/Colors';
import { Search, FileText, Upload, ChevronRight, Stethoscope, Brain, Pill, Apple } from 'lucide-react-native';

interface HealthVaultViewProps {
    theme: Theme;
}

export default function HealthVaultView({ theme }: HealthVaultViewProps) {
    const records = [
        { id: 1, doctor: 'Dr. Arpan Sharma', title: 'Chronic Gastritis', date: '12 Oct 2023', icon: <Stethoscope size={20} color={theme.success} /> },
        { id: 2, doctor: 'Dr. Meera Iyer', title: 'Stress Management', date: '05 Sep 2023', icon: <Brain size={20} color={theme.success} /> },
        { id: 3, doctor: 'Dr. Rajesh Varma', title: 'Joint Pain (Vata)', date: '22 Aug 2023', icon: <Pill size={20} color={theme.success} /> },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

            {/* Search Bar Placeholder */}
            <View style={[styles.searchBar, { backgroundColor: theme.cardBackground }]}>
                <Search size={20} color={theme.textSecondary} />
                <Text style={[styles.searchText, { color: theme.textSecondary }]}>Search by condition or date</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsRow}>
                {['Consultations', 'Prescriptions', 'Lab Reports'].map((tab, index) => (
                    <Text key={tab} style={[styles.tab, { color: index === 0 ? theme.text : theme.textSecondary, borderBottomColor: index === 0 ? theme.success : 'transparent' }]}>
                        {tab}
                    </Text>
                ))}
            </View>

            <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>RECENT RECORDS</Text>

            {/* Record List */}
            {records.map((record) => (
                <View key={record.id} style={[styles.recordCard, { backgroundColor: theme.cardBackground }]}>
                    <View style={[styles.iconBox, { backgroundColor: theme.successLight }]}>
                        {record.icon}
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={[styles.docName, { color: theme.text }]}>{record.doctor}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <View style={{ backgroundColor: theme.successLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 }}>
                                <Text style={{ color: theme.success, fontSize: 10, fontWeight: '600' }}>{record.title}</Text>
                            </View>
                            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>• {record.date}</Text>
                        </View>
                    </View>
                    <View style={[styles.viewIcon, { backgroundColor: theme.successLight }]}>
                        <ChevronRight size={16} color={theme.success} />
                    </View>
                </View>
            ))}

            {/* AI Summary Card */}
            <View style={[styles.aiCard, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.aiTitle, { color: theme.text }]}>Smart AI Summary</Text>
                <Text style={[styles.aiText, { color: theme.text }]}>
                    ReVeda AI has analyzed your last 3 records. Your Dosha balance is improving with the current herbs.
                </Text>
                <TouchableOpacity style={[styles.aiButton, { backgroundColor: theme.success }]}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>View Insights ✨</Text>
                </TouchableOpacity>
            </View>

            {/* More Records */}
            <View style={[styles.recordCard, { backgroundColor: theme.cardBackground }]}>
                <View style={[styles.iconBox, { backgroundColor: theme.successLight }]}>
                    <Apple size={20} color={theme.success} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={[styles.docName, { color: theme.text }]}>Dr. Anjali Desai</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <View style={{ backgroundColor: theme.successLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 }}>
                            <Text style={{ color: theme.success, fontSize: 10, fontWeight: '600' }}>Digestive Health</Text>
                        </View>
                        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>• 15 Jul 2023</Text>
                    </View>
                </View>
                <View style={[styles.viewIcon, { backgroundColor: theme.successLight }]}>
                    <ChevronRight size={16} color={theme.success} />
                </View>
            </View>

            {/* Upload Button */}
            <TouchableOpacity style={[styles.uploadButton, { backgroundColor: '#1E1E1E' }]}>
                <Upload size={20} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 8 }}>Upload New Record</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 100 },
    searchBar: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 20 },
    searchText: { marginLeft: 10 },
    tabsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    tab: { fontSize: 14, fontWeight: '600', paddingBottom: 10, borderBottomWidth: 2 },
    sectionHeader: { fontSize: 12, fontWeight: 'bold', marginBottom: 16, letterSpacing: 1 },
    recordCard: { flexDirection: 'row', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
    iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    docName: { fontSize: 14, fontWeight: 'bold' },
    viewIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    aiCard: { padding: 20, borderRadius: 20, marginBottom: 12, marginVertical: 4 },
    aiTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    aiText: { fontSize: 13, lineHeight: 20, marginBottom: 16, opacity: 0.8 },
    aiButton: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, marginTop: 10 },
});
