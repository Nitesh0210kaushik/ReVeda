import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Theme } from '../../constants/Colors';
import { Play, Activity, AlertCircle, Leaf, Utensils, Ban, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HealthExplainedViewProps {
    theme: Theme;
}

export default function HealthExplainedView({ theme }: HealthExplainedViewProps) {
    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

            {/* Header Card */}
            <View style={[styles.headerCard, { backgroundColor: theme.successLight }]}>
                <View style={[styles.botIcon, { backgroundColor: theme.success }]}>
                    <View style={{ width: 8, height: 12, backgroundColor: '#000', borderRadius: 2 }} />
                    <View style={{ width: 8, height: 12, backgroundColor: '#000', borderRadius: 2, marginLeft: 4 }} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.headerTitle, { color: theme.success }]}>REVEDA AI INSIGHTS</Text>
                    <Text style={[styles.headerSub, { color: theme.text }]}>Personalized summary of your Ayurvedic consultation with Dr. Sharma.</Text>
                </View>
            </View>

            {/* Insight Section: What is happening */}
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                <View style={[styles.mediaPlaceholder, { backgroundColor: '#4DB6AC' }]}>
                    {/* Gradient placeholder */}
                    <LinearGradient colors={['#4DB6AC', '#80CBC4']} style={StyleSheet.absoluteFill} />
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Activity size={18} color={theme.success} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>What is happening</Text>
                        <View style={{ flex: 1 }} />
                        <View style={[styles.audioBtn, { backgroundColor: theme.success }]}>
                            <Play size={10} color="#fff" fill="#fff" />
                        </View>
                    </View>
                    <Text style={[styles.cardText, { color: theme.textSecondary }]}>
                        Your Vata dosha is imbalanced, causing dry skin and fatigue. AI is analyzing your pulse readings which show high rhythmic variability.
                    </Text>
                </View>
            </View>

            {/* Insight Section: Why this medicine */}
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                <View style={[styles.mediaPlaceholder, { backgroundColor: '#5D4037' }]}>
                    <LinearGradient colors={['#558B2F', '#7CB342']} style={StyleSheet.absoluteFill} />
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Leaf size={18} color={theme.success} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Why this medicine</Text>
                        <View style={{ flex: 1 }} />
                        <View style={[styles.audioBtn, { backgroundColor: theme.success }]}>
                            <Play size={10} color="#fff" fill="#fff" />
                        </View>
                    </View>
                    <Text style={[styles.cardText, { color: theme.textSecondary }]}>
                        Ashwagandha helps stabilize your energy levels and reduces the cortisol impact on your system.
                    </Text>
                </View>
            </View>

            {/* Button */}
            <View style={[styles.actionButton, { backgroundColor: theme.success }]}>
                <Text style={styles.actionButtonText}>View Prescription</Text>
            </View>
            <Text style={{ textAlign: 'center', fontSize: 10, color: theme.textSecondary, marginBottom: 20 }}>Verified by ReVeda Ayurvedic Panel</Text>

            {/* Dietary Advice */}
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                <View style={[styles.mediaPlaceholder, { backgroundColor: '#FFCC80', height: 100 }]}>
                    {/* Simulating food image placeholder */}
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Utensils size={18} color={theme.success} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Dietary Advice</Text>
                        <View style={{ flex: 1 }} />
                        <View style={[styles.audioBtn, { backgroundColor: theme.success }]}>
                            <Play size={10} color="#fff" fill="#fff" />
                        </View>
                    </View>
                    <Text style={[styles.cardText, { color: theme.textSecondary }]}>
                        Include warm soups and ghee; avoid cold salads and raw sprouts during this cycle to keep your digestive fire (Agni) strong.
                    </Text>
                </View>
            </View>

            {/* What to avoid */}
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                <View style={[styles.mediaPlaceholder, { backgroundColor: '#424242', height: 100 }]}>
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Ban size={18} color={theme.success} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>What to avoid</Text>
                        <View style={{ flex: 1 }} />
                        <View style={[styles.audioBtn, { backgroundColor: theme.success }]}>
                            <Play size={10} color="#fff" fill="#fff" />
                        </View>
                    </View>
                    <Text style={[styles.cardText, { color: theme.textSecondary }]}>
                        Avoid late-night screen time and excessive caffeine which further aggravates the Vata imbalance and disrupts sleep.
                    </Text>
                </View>
            </View>

            {/* Recovery Timeline */}
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                <View style={[styles.mediaPlaceholder, { backgroundColor: '#FF8A65', height: 80 }]}>
                    <LinearGradient colors={['#FFAB91', '#FFCCBC']} style={StyleSheet.absoluteFill} />
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Calendar size={18} color={theme.success} />
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Recovery Timeline</Text>
                        <View style={{ flex: 1 }} />
                        <View style={[styles.audioBtn, { backgroundColor: theme.success }]}>
                            <Play size={10} color="#fff" fill="#fff" />
                        </View>
                    </View>
                    <Text style={[styles.cardText, { color: theme.textSecondary }]}>
                        Expect to feel more energetic in 7-10 days. Full stabilization of Vata dosha usually takes 3-4 weeks of consistent routine.
                    </Text>
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 100 },
    headerCard: { flexDirection: 'row', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
    botIcon: { width: 40, height: 40, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' },
    headerSub: { fontSize: 12, lineHeight: 16 },
    card: { borderRadius: 16, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    mediaPlaceholder: { height: 120, width: '100%' },
    cardContent: { padding: 16 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    audioBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cardText: { fontSize: 13, lineHeight: 20 },
    actionButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
    actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
