import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, ActivityIndicator, Image, Platform, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Mail, Phone, Calendar, User as UserIcon, CheckCircle, ArrowLeft, Camera } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import Colors from '../../constants/Colors';
import { useAuthContext } from '../../context/AuthContext';
import { useUploadProfilePicture } from '../../hooks/useAuth';

// Backend URL for images - assuming backend runs on port 5000
const API_URL = 'http://localhost:5000'; // Make sure this matches your API config

export default function ProfileDetailsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const insets = useSafeAreaInsets();
    const { user, isLoading, refreshAuth } = useAuthContext();
    const uploadMutation = useUploadProfilePicture();

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const pickImage = async () => {
        // Request permissions
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            handleUpload(result.assets[0]);
        }
    };

    const handleUpload = async (asset: ImagePicker.ImagePickerAsset) => {
        try {
            const formData = new FormData();

            if (Platform.OS === 'web') {
                // Convert Data URI to Blob for Web
                const res = await fetch(asset.uri);
                const blob = await res.blob();
                formData.append('profilePicture', blob, 'profile.jpg');
            } else {
                // Native File Object
                formData.append('profilePicture', {
                    uri: asset.uri,
                    name: 'profile.jpg',
                    type: asset.mimeType || 'image/jpeg',
                } as any);
            }

            await uploadMutation.mutateAsync(formData);
            refreshAuth();

            Toast.show({
                type: 'success',
                text1: 'Profile Picture Updated',
                text2: 'Looking good! 📸',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Upload Failed',
                text2: 'Please try again later.',
            });
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    // Construct full image URL
    // If running on device/emulator, using localhost might fail. Use IP if needed.
    // For now assuming localhost works with port forwarding or web.
    // Replace 'backslashes' with 'forwardslashes' just in case Windows paths mess up.
    const profileImageUrl = user?.profilePicture
        ? `${API_URL}/${user.profilePicture.replace(/\\/g, '/')}`
        : null;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.background }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Profile Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.text }]}>

                    <TouchableOpacity onPress={pickImage} disabled={uploadMutation.isPending}>
                        <View style={[styles.avatarContainer, { backgroundColor: theme.successLight }]}>
                            {uploadMutation.isPending ? (
                                <ActivityIndicator color={theme.tint} />
                            ) : profileImageUrl ? (
                                <Image
                                    source={{ uri: profileImageUrl }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <UserIcon size={40} color={theme.tint} />
                            )}

                            {/* Camera Icon Overlay */}
                            <View style={[styles.cameraIconContainer, { backgroundColor: theme.tint }]}>
                                <Camera size={14} color="#fff" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text style={[styles.userName, { color: theme.text }]}>
                        {user?.firstName} {user?.lastName}
                    </Text>

                    {user?.isVerified && (
                        <View style={[styles.verifiedBadge, { backgroundColor: theme.successLight }]}>
                            <CheckCircle size={14} color={theme.tint} style={{ marginRight: 4 }} />
                            <Text style={[styles.verifiedText, { color: theme.tint }]}>Verified Account</Text>
                        </View>
                    )}
                </View>

                {/* Account Info Card */}
                <View style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.text }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Information</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Mail size={20} color={theme.textSecondary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
                            <Text style={[styles.infoValue, { color: theme.text }]}>{user?.email}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Phone size={20} color={theme.textSecondary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone Number</Text>
                            <Text style={[styles.infoValue, { color: theme.text }]}>+91 {user?.phoneNumber}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Calendar size={20} color={theme.textSecondary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Member Since</Text>
                            <Text style={[styles.infoValue, { color: theme.text }]}>{formatDate(user?.createdAt)}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={[styles.refreshButton, { backgroundColor: theme.cardBackground, borderColor: theme.tint }]}>
                    <Text style={[styles.refreshButtonText, { color: theme.tint }]}>Refresh Profile</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    backButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    verifiedText: {
        fontSize: 12,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 12,
    },
    iconBox: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        width: '100%',
        marginLeft: 50, // Indent to match text
    },
    refreshButton: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    refreshButtonText: {
        fontSize: 16,
        fontWeight: '600',
    }
});
