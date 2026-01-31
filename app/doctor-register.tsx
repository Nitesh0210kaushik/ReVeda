import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Image, ActivityIndicator } from 'react-native';
import { CheckCircle, Briefcase, DollarSign, Clock, User, Phone, Mail, ChevronRight, FileText, Upload, Camera, ChevronDown } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

// Helper for web-friendly alerts
const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n${message}`);
    } else {
        Alert.alert(title, message);
    }
};

export default function DoctorRegisterScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        specialization: '',
        experience: '',
        fee: '',
        bio: '',
        registrationNumber: '',
        gender: ''
    });
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [profileImage, setProfileImage] = useState<any>(null);
    const [kycDocs, setKycDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const pickImage = async (type: 'profile' | 'kyc') => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: type === 'profile',
            aspect: type === 'profile' ? [1, 1] : undefined,
            quality: 0.5,
        });

        if (!result.canceled) {
            if (type === 'profile') {
                setProfileImage(result.assets[0]);
            } else {
                setKycDocs([...kycDocs, result.assets[0]]);
            }
        }
    };

    const handleSubmit = async () => {
        // Strict Validation
        if (!formData.firstName.trim() || !formData.lastName.trim()) return showAlert('Name Required', 'Please enter your full name.');
        if (!formData.email.trim() || !formData.email.includes('@')) return showAlert('Invalid Email', 'Please enter a valid email address.');
        if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) return showAlert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
        if (!formData.gender) return showAlert('Gender Required', 'Please select your gender.');
        if (!formData.registrationNumber.trim()) return showAlert('Reg. Number Required', 'Please enter your Medical Registration Number.');
        if (!formData.specialization.trim()) return showAlert('Specialization Required', 'Please specify your medical specialization.');
        if (!formData.experience.trim()) return showAlert('Experience Required', 'Please enter your years of experience.');
        if (!formData.fee.trim()) return showAlert('Consultation Fee Required', 'Please set your consultation fee.');

        setLoading(true);
        try {
            let API_BASE = 'http://localhost:5000';
            if (Platform.OS === 'web' && typeof window !== 'undefined') {
                const hostname = window.location.hostname;
                API_BASE = `http://${hostname}:5000`;
            } else if (Platform.OS === 'android') {
                API_BASE = 'http://10.0.2.2:5000';
            }

            const API_URL = `${API_BASE}/api/v1/doctors/register`;

            const data = new FormData();
            data.append('firstName', formData.firstName);
            data.append('lastName', formData.lastName);
            data.append('email', formData.email);
            data.append('phoneNumber', formData.phoneNumber);
            data.append('gender', formData.gender);
            data.append('registrationNumber', formData.registrationNumber);
            data.append('specialization', formData.specialization);
            data.append('experience', formData.experience);
            data.append('fee', formData.fee);
            data.append('bio', formData.bio);

            if (profileImage) {
                // @ts-ignore
                data.append('image', {
                    uri: profileImage.uri,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                });
            }

            kycDocs.forEach((doc, index) => {
                // @ts-ignore
                data.append('documents', {
                    uri: doc.uri,
                    name: `kyc_${index}.jpg`,
                    type: 'image/jpeg',
                });
            });

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    // Content-Type must be undefined so browser sets boundary
                },
                body: data,
            });

            const resData = await response.json();

            if (resData.success) {
                setSuccess(true);
            } else {
                showAlert('Registration Failed', resData.message || 'Something went wrong');
            }
        } catch (error) {
            console.error(error);
            showAlert('Connection Error', 'Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <View style={styles.successContainer}>
                <View style={styles.successCard}>
                    <CheckCircle size={80} color={Colors.light.success} />
                    <Text style={styles.successTitle}>Registration Submitted!</Text>
                    <Text style={styles.successText}>Dr. {formData.firstName} {formData.lastName}</Text>
                    <Text style={styles.successSubText}>Your profile and documents have been submitted for verification. We will notify you once approved.</Text>
                    <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
                        <Text style={styles.homeButtonText}>Go to App</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/icon.png')} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    <Text style={styles.headerTitle}>Partner Registration</Text>
                    <Text style={styles.headerSubtitle}>Join India's fastest growing holistic healthcare network.</Text>
                </View>

                <View style={styles.formContainer}>

                    <Text style={styles.sectionHeader}>Personal Information</Text>

                    {/* Profile Photo Upload */}
                    <View style={styles.uploadCenter}>
                        <TouchableOpacity style={styles.profileUpload} onPress={() => pickImage('profile')}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Camera size={30} color="#999" />
                                    <Text style={styles.uploadText}>Add Selfie</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>First Name</Text>
                        <View style={styles.inputContainer}>
                            <User size={18} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex. Amit"
                                value={formData.firstName}
                                onChangeText={(t) => setFormData({ ...formData, firstName: t })}
                                // @ts-ignore
                                outlineStyle='none'
                            />
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Last Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex. Sharma"
                                value={formData.lastName}
                                onChangeText={(t) => setFormData({ ...formData, lastName: t })}
                                // @ts-ignore
                                outlineStyle='none'
                            />
                        </View>
                    </View>

                    <View style={[styles.inputWrapper, { zIndex: 100 }]}>
                        <Text style={styles.inputLabel}>Gender</Text>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.inputText, !formData.gender && { color: '#A0AEC0' }]}>
                                {formData.gender || 'Select Gender'}
                            </Text>
                            <ChevronDown size={20} color="#666" />
                        </TouchableOpacity>

                        {showGenderDropdown && (
                            <View style={styles.dropdownList}>
                                {['Male', 'Female', 'Other'].map((g) => (
                                    <TouchableOpacity
                                        key={g}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFormData({ ...formData, gender: g });
                                            setShowGenderDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{g}</Text>
                                        {formData.gender === g && <CheckCircle size={16} color={Colors.light.tint} />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Mail size={18} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="doctor@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={(t) => setFormData({ ...formData, email: t })}
                                // @ts-ignore
                                outlineStyle='none'
                            />
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <Phone size={18} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="+91 98765 43210"
                                keyboardType="phone-pad"
                                value={formData.phoneNumber}
                                onChangeText={(t) => setFormData({ ...formData, phoneNumber: t })}
                                // @ts-ignore
                                outlineStyle='none'
                            />
                        </View>
                    </View>

                    <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Professional & KYC Details</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Registration Number (MCI/State)</Text>
                        <View style={styles.inputContainer}>
                            <FileText size={18} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex. MCI-12345-A"
                                value={formData.registrationNumber}
                                onChangeText={(t) => setFormData({ ...formData, registrationNumber: t })}
                                // @ts-ignore
                                outlineStyle='none'
                            />
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Specialization</Text>
                        <View style={styles.inputContainer}>
                            <Briefcase size={18} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex. Ayurveda, Cardiology"
                                value={formData.specialization}
                                onChangeText={(t) => setFormData({ ...formData, specialization: t })}
                                // @ts-ignore
                                outlineStyle='none'
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.inputLabel}>Experience</Text>
                            <View style={styles.inputContainer}>
                                <Clock size={18} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex. 5 Years"
                                    value={formData.experience}
                                    onChangeText={(t) => setFormData({ ...formData, experience: t })}
                                    // @ts-ignore
                                    outlineStyle='none'
                                />
                            </View>
                        </View>
                        <View style={[styles.inputWrapper, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Consultation Fee</Text>
                            <View style={styles.inputContainer}>
                                <DollarSign size={18} color="#999" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex. ₹500"
                                    value={formData.fee}
                                    onChangeText={(t) => setFormData({ ...formData, fee: t })}
                                    // @ts-ignore
                                    outlineStyle='none'
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>KYC Documents (Medical ID / Aadhar)</Text>
                        {kycDocs.map((doc, idx) => (
                            <View key={idx} style={styles.docItem}>
                                <FileText size={16} color={Colors.light.tint} />
                                <Text style={styles.docName} numberOfLines={1}>Document {idx + 1}</Text>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('kyc')}>
                            <Upload size={20} color="#666" />
                            <Text style={styles.uploadBtnText}>Upload Document</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Bio (Optional)</Text>
                        <View style={[styles.inputContainer, { alignItems: 'flex-start', height: 100 }]}>
                            <TextInput
                                style={[styles.input, { height: '100%', paddingTop: 10 }]}
                                placeholder="Tell us briefly about your practice..."
                                multiline
                                textAlignVertical="top"
                                value={formData.bio}
                                onChangeText={(t) => setFormData({ ...formData, bio: t })}
                                // @ts-ignore
                                outlineStyle='none'
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.disabledButton]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit for Verification</Text>
                        )}
                        {!loading && <ChevronRight size={20} color="#fff" style={{ marginLeft: 5 }} />}
                    </TouchableOpacity>

                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 ReVeda Healthcare</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
    scrollContent: { flexGrow: 1, alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
    header: { width: '100%', maxWidth: 480, marginBottom: 30, alignItems: 'center' },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.light.tint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    logoImage: {
        width: 60,
        height: 60,
    },
    logoText: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
    headerTitle: { fontSize: 26, fontWeight: '800', color: '#2D3748', marginBottom: 8, textAlign: 'center' },
    headerSubtitle: { fontSize: 15, color: '#718096', textAlign: 'center', lineHeight: 22 },
    formContainer: { width: '100%', maxWidth: 480, backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 10, borderWidth: 1, borderColor: '#E2E8F0' },
    sectionHeader: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#A0AEC0', marginBottom: 15 },
    row: { flexDirection: 'row' },
    inputWrapper: { marginBottom: 20 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#4A5568', marginBottom: 8 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 50 },
    input: { flex: 1, fontSize: 16, color: '#2D3748', marginLeft: 8, height: '100%', outlineStyle: 'none' as any },
    submitButton: { backgroundColor: Colors.light.tint, height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: Colors.light.tint, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
    disabledButton: { opacity: 0.7 },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    footer: { marginTop: 40, alignItems: 'center' },
    footerText: { color: '#A0AEC0', fontSize: 13 },
    successContainer: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', padding: 20 },
    successCard: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 30, padding: 40, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 20 },
    successTitle: { fontSize: 24, fontWeight: '800', color: '#2D3748', marginTop: 20, marginBottom: 5, textAlign: 'center' },
    successText: { fontSize: 18, fontWeight: '600', color: Colors.light.tint, marginBottom: 10 },
    successSubText: { fontSize: 15, color: '#718096', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
    homeButton: { backgroundColor: '#EDF2F7', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
    homeButtonText: { color: '#4A5568', fontWeight: '700', fontSize: 15 },
    genderRow: { flexDirection: 'row', justifyContent: 'space-between' },
    genderBtn: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', marginHorizontal: 4, backgroundColor: '#F7FAFC' },
    genderBtnActive: { backgroundColor: Colors.light.tint, borderColor: Colors.light.tint },
    genderText: { fontSize: 14, fontWeight: '600', color: '#4A5568' },
    genderTextActive: { color: '#fff' },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
    },
    dropdownList: {
        marginTop: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F7FAFC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#2D3748',
    },
    inputText: {
        fontSize: 16,
        color: '#2D3748',
    },
    uploadCenter: { alignItems: 'center', marginBottom: 20 },
    profileUpload: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F2F5', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
    profileImage: { width: '100%', height: '100%' },
    placeholderImage: { alignItems: 'center' },
    uploadText: { fontSize: 10, color: '#999', marginTop: 4 },
    docItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F8', padding: 10, borderRadius: 8, marginBottom: 8 },
    docName: { marginLeft: 10, color: '#4A5568', fontSize: 14, flex: 1 },
    uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#DAE1E7', borderRadius: 12, borderStyle: 'dashed', backgroundColor: '#F9FAFB' },
    uploadBtnText: { marginLeft: 8, color: '#666', fontWeight: '600' }
});
