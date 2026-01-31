import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Theme } from '../../constants/Colors';
import { Search, Filter, Star, MapPin, Video, MessageSquare } from 'lucide-react-native';

interface FindDoctorViewProps {
    theme: Theme;
}

interface Doctor {
    _id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    experience: string;
    fee: string;
    image: string;
    rating: number;
}

import { useDoctors } from '../../hooks/useApi';

export default function FindDoctorView({ theme }: FindDoctorViewProps) {
    // Using React Query hook for data fetching
    const { data: doctors = [], isLoading: loading, error, refetch } = useDoctors();

    // React.useEffect removed as useQuery handles fetching automatically

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.cardBackground }]}>
                <Search size={20} color={theme.textSecondary} />
                <TextInput
                    placeholder="Search speciality, doctor, symptoms"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.searchInput, { color: theme.text }]}
                />
            </View>

            {/* Filter/Banner Area - Simplified for now */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Text style={[styles.heading, { color: theme.text }]}>Top Specialists</Text>
                <TouchableOpacity><Text style={{ color: theme.tint }}>View All</Text></TouchableOpacity>
            </View>

            {/* Doctor Cards */}
            {loading ? (
                <Text style={{ textAlign: 'center', marginTop: 20, color: theme.textSecondary }}>Loading specialists...</Text>
            ) : doctors.map((doctor) => (
                <View key={doctor._id} style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: doctor.image || 'https://i.pravatar.cc/100?img=11' }} style={styles.image} />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <View>
                                    <Text style={[styles.name, { color: theme.text }]}>{doctor.firstName} {doctor.lastName}</Text>
                                    <Text style={[styles.specialty, { color: theme.textSecondary }]}>{doctor.specialization}</Text>
                                </View>
                                <View style={[styles.ratingBadge, { backgroundColor: theme.successLight }]}>
                                    <Star size={12} color={theme.success} fill={theme.success} />
                                    <Text style={[styles.ratingText, { color: theme.success }]}>{doctor.rating}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, color: theme.textSecondary, marginRight: 16 }}>{doctor.experience} Exp.</Text>
                                <Text style={{ fontSize: 12, color: theme.textSecondary }}>English, Hindi</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={[styles.fee, { color: theme.text }]}>{doctor.fee}</Text>
                                <TouchableOpacity style={[styles.consultButton, { backgroundColor: theme.tint }]}>
                                    <Text style={styles.consultButtonText}>Consult Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            ))}

            {/* Floating Filter Button (Visual) */}
            <View style={[styles.floatingFilter, { backgroundColor: '#6C757D' }]}>
                <Filter size={16} color="#fff" />
                <Text style={{ color: '#fff', marginLeft: 8, fontWeight: '600' }}>Filters</Text>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 100 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 15 },
    heading: { fontSize: 18, fontWeight: 'bold' },
    card: { padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    image: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#eee' },
    name: { fontSize: 16, fontWeight: 'bold' },
    specialty: { fontSize: 12, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    ratingText: { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    fee: { fontSize: 16, fontWeight: 'bold' },
    consultButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    consultButtonText: { color: '#fff', fontWeight: '600', fontSize: 12 },
    floatingFilter: { position: 'absolute', bottom: 20, alignSelf: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
});
