import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useAdminStats, useDoctors, useAdminAnalytics } from '../../hooks/useAdmin';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: any }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={20} color={Colors.dark.tint} />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.cardValue}>{value}</Text>
    </View>
);

export default function AdminDashboard() {
    const insets = useSafeAreaInsets();
    const theme = Colors.dark;
    const router = useRouter();

    const { data: stats, isLoading: isLoadingStats, refetch: refetchStats, isRefetching: isRefetchingStats } = useAdminStats();
    const { data: analytics, isLoading: isLoadingAnalytics, refetch: refetchAnalytics } = useAdminAnalytics();
    const { data: doctorsData } = useDoctors(1);

    const recentDoctors = doctorsData?.doctors?.slice(0, 5) || [];

    const onRefresh = React.useCallback(() => {
        refetchStats();
        refetchAnalytics();
    }, [refetchStats, refetchAnalytics]);

    if (isLoadingStats || (isLoadingAnalytics && !analytics)) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    const chartConfig = {
        backgroundGradientFrom: "#1e1e1e",
        backgroundGradientTo: "#1e1e1e",
        color: (opacity = 1) => `rgba(67, 233, 123, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        decimalPlaces: 0,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#43e97b"
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: '#121212' }]}
            contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 20 }]}
            refreshControl={<RefreshControl refreshing={isRefetchingStats} onRefresh={onRefresh} tintColor={theme.tint} />}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.adminText}>System Admin</Text>
                </View>
                <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/admin/settings')}>
                    <Ionicons name="person-circle-outline" size={40} color={theme.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
                <StatCard title="Total Doctors" value={stats?.totalDoctors || 0} icon="medical" />
                <StatCard title="Verified" value={stats?.verifiedDoctors || 0} icon="checkmark-circle" />
                <StatCard title="Pending" value={stats?.pendingDoctors || 0} icon="time" />
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="people" />
            </View>

            {/* Revenue Chart */}
            {analytics?.revenue && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Revenue Trend (6 Months)</Text>
                    <View style={styles.chartContainer}>
                        <LineChart
                            data={analytics.revenue}
                            width={width - 40}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                    </View>
                </View>
            )}

            {/* User Growth Chart */}
            {analytics?.userGrowth && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Registrations (Last 7 Days)</Text>
                    <View style={styles.chartContainer}>
                        <BarChart
                            data={analytics.userGrowth}
                            width={width - 40}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) => `rgba(250, 112, 154, ${opacity})`,
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                    </View>
                </View>
            )}

            {/* Recent Doctors */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Registrations</Text>
                    <TouchableOpacity onPress={() => router.push('/admin/doctors')}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                {recentDoctors.map((doc: any, index: number) => (
                    <View key={doc._id || index} style={styles.doctorItem}>
                        <View style={styles.doctorInfo}>
                            <View style={[styles.avatarPlaceholder]}>
                                <Text style={styles.avatarText}>
                                    {doc.firstName?.[0]}{doc.lastName?.[0]}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.doctorName}>Dr. {doc.firstName} {doc.lastName}</Text>
                                <Text style={styles.doctorSpec}>{doc.specialization} • {doc.experience}</Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: doc.isVerified ? 'rgba(67, 233, 123, 0.1)' : 'rgba(250, 112, 154, 0.1)' }]}>
                            <Text style={[styles.statusText, { color: doc.isVerified ? '#43e97b' : '#fa709a' }]}>
                                {doc.isVerified ? 'Verified' : 'Pending'}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    welcomeText: {
        color: '#aaa',
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
    },
    adminText: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Outfit-Bold',
    },
    profileButton: {
        padding: 5,
    },
    card: {
        width: (width - 48) / 2,
        padding: 16,
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardTitle: {
        fontSize: 12,
        fontFamily: 'Outfit-Medium',
        color: '#888',
        flex: 1,
        textAlign: 'right',
        marginLeft: 8,
    },
    cardValue: {
        fontSize: 28,
        fontFamily: 'Outfit-Bold',
        color: '#FFF',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Outfit-Bold',
        marginBottom: 15,
    },
    viewAllText: {
        color: Colors.dark.tint,
        fontSize: 14,
        fontFamily: 'Outfit-Medium',
    },
    revenueCard: {
        padding: 20,
        backgroundColor: '#1e1e1e',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    revenueLabel: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Outfit-Medium',
    },
    revenueAmount: {
        color: '#fff',
        fontSize: 36,
        fontFamily: 'Outfit-Bold',
        marginVertical: 10,
    },
    revenueGrowth: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(67, 233, 123, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    growthText: {
        color: '#43e97b',
        fontSize: 12,
        marginLeft: 5,
        fontFamily: 'Outfit-Medium',
    },
    doctorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    doctorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 16,
        fontFamily: 'Outfit-Bold',
        color: '#fff',
    },
    doctorName: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Outfit-Medium',
    },
    doctorSpec: {
        color: '#666',
        fontSize: 12,
        fontFamily: 'Outfit-Regular',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Outfit-Bold',
        textTransform: 'uppercase',
    },
});
