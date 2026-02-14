import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDoctors, useVerifyDoctor } from '../../hooks/useAdmin';
import { Doctor } from '../../services/api';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';

export default function DoctorsListScreen() {
    const [page, setPage] = useState(1);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const { data, isLoading, isRefetching, refetch } = useDoctors(page);
    const verifyMutation = useVerifyDoctor();

    const doctors = data?.doctors || [];
    const totalPages = data?.totalPages || 1;

    const onRefresh = () => {
        refetch();
    };

    const loadMore = () => {
        if (page < totalPages && !isLoading && !isRefetching) {
            setPage(prev => prev + 1);
        }
    };

    const toggleVerification = async (doctor: Doctor) => {
        const newStatus = !doctor.isVerified;

        verifyMutation.mutate({ doctorId: doctor._id, isVerified: newStatus }, {
            onSuccess: (response) => {
                if (response.success) {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: `Doctor ${newStatus ? 'Verified' : 'Unverified'}`
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: response.message || 'Update failed'
                    });
                }
            },
            onError: () => {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to update status'
                });
            }
        });
    };

    const renderDoctorItem = ({ item }: { item: Doctor }) => (
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.cardHeader}>
                <Image
                    source={{ uri: item.image || 'https://via.placeholder.com/50' }}
                    style={styles.avatar}
                />
                <View style={styles.infoContainer}>
                    <Text style={[styles.name, { color: theme.text }]}>Dr. {item.firstName} {item.lastName}</Text>
                    <Text style={[styles.specialization, { color: theme.textSecondary }]}>{item.specialization}</Text>
                    <Text style={[styles.details, { color: theme.textSecondary }]}>{item.email}</Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: theme.successLight }}
                    thumbColor={item.isVerified ? theme.success : "#f4f3f4"}
                    onValueChange={() => toggleVerification(item)}
                    value={item.isVerified}
                    disabled={verifyMutation.isPending}
                />
            </View>
            <View style={styles.cardFooter}>
                <Text style={[styles.status, { color: item.isVerified ? theme.success : theme.badgeText }]}>
                    {item.isVerified ? 'Verified' : 'Pending Verification'}
                </Text>
                <Text style={[styles.date, { color: theme.textSecondary }]}>
                    Reg: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.headerContainer}>
                <Text style={[styles.header, { color: theme.text }]}>Manage Doctors</Text>
            </View>

            {isLoading && page === 1 ? (
                <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={doctors}
                    renderItem={renderDoctorItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshing={isRefetching && page === 1}
                    onRefresh={onRefresh}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No doctors found.</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        padding: 20,
        paddingBottom: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#e0e0e0',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    specialization: {
        fontSize: 14,
        marginTop: 2,
    },
    details: {
        fontSize: 12,
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
    },
    date: {
        fontSize: 12,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    }
});
