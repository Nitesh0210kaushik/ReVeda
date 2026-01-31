import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../constants/Colors';
import FindDoctorView from '../teleconsultation/FindDoctorView';
import HealthVaultView from '../teleconsultation/HealthVaultView';
import HealthExplainedView from '../teleconsultation/HealthExplainedView';

interface TeleConsultationViewProps {
    theme: Theme;
}

export default function TeleConsultationView({ theme }: TeleConsultationViewProps) {
    const [activeTab, setActiveTab] = useState<'find' | 'vault' | 'insights'>('find');

    return (
        <View style={styles.container}>

            {/* Sub-Tabs Header */}
            <View style={[styles.tabContainer, { borderBottomColor: theme.borderColor }]}>
                <TouchableOpacity
                    onPress={() => setActiveTab('find')}
                    style={[styles.tab, activeTab === 'find' && { borderBottomColor: theme.text }]}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'find' ? theme.text : theme.textSecondary }]}>Find Doctor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('vault')}
                    style={[styles.tab, activeTab === 'vault' && { borderBottomColor: theme.text }]}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'vault' ? theme.text : theme.textSecondary }]}>Health Vault</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('insights')}
                    style={[styles.tab, activeTab === 'insights' && { borderBottomColor: theme.text }]}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'insights' ? theme.text : theme.textSecondary }]}>AI Insights</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
                {activeTab === 'find' && <FindDoctorView theme={theme} />}
                {activeTab === 'vault' && <HealthVaultView theme={theme} />}
                {activeTab === 'insights' && <HealthExplainedView theme={theme} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    tabContainer: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1 },
    tab: { marginRight: 24, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabText: { fontSize: 14, fontWeight: '600' },
});
