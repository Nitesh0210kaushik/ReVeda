import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useSignup } from '../../hooks/useAuth';
import { SignupData } from '../../services/api';
import Colors from '../../constants/Colors';
import { ArrowRight } from 'lucide-react-native';

const SignupScreen: React.FC = () => {
  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Partial<SignupData>>({});

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as typeof Colors.light;

  const signupMutation = useSignup();

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Indian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      const response = await signupMutation.mutateAsync(formData);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Account Created! 🎉',
          text2: 'Please check your email for the verification OTP.',
          visibilityTime: 4000,
        });

        // Navigate to Verify OTP screen
        router.push({
          pathname: '/auth/verify-otp',
          params: { identifier: formData.email, type: 'signup' }
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: response.message || 'Please check your details and try again.',
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: errorMessage,
      });
    }
  };

  const updateFormData = (field: keyof SignupData, value: string) => {
    setFormData((prev: SignupData) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Partial<SignupData>) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <View style={[styles.logoContainer, { shadowColor: theme.tint }]}>
              <Image
                source={require('../../assets/icon.png')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Join ReVeda and start your wellness journey
            </Text>
          </View>

          <View style={styles.form}>
            {/* First Name */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>First Name</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.cardBackground, borderColor: errors.firstName ? theme.badgeText : theme.borderColor }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your first name"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.firstName}
                  onChangeText={(text: string) => updateFormData('firstName', text)}
                  autoCapitalize="words"
                />
              </View>
              {errors.firstName && <Text style={[styles.errorText, { color: theme.badgeText }]}>{errors.firstName}</Text>}
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Last Name</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.cardBackground, borderColor: errors.lastName ? theme.badgeText : theme.borderColor }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your last name"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.lastName}
                  onChangeText={(text: string) => updateFormData('lastName', text)}
                  autoCapitalize="words"
                />
              </View>
              {errors.lastName && <Text style={[styles.errorText, { color: theme.badgeText }]}>{errors.lastName}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.cardBackground, borderColor: errors.email ? theme.badgeText : theme.borderColor }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.email}
                  onChangeText={(text: string) => updateFormData('email', text.toLowerCase())}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && <Text style={[styles.errorText, { color: theme.badgeText }]}>{errors.email}</Text>}
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Phone Number</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.cardBackground, borderColor: errors.phoneNumber ? theme.badgeText : theme.borderColor }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.phoneNumber}
                  onChangeText={(text: string) => updateFormData('phoneNumber', text.replace(/[^0-9]/g, ''))}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {errors.phoneNumber && <Text style={[styles.errorText, { color: theme.badgeText }]}>{errors.phoneNumber}</Text>}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.tint, shadowColor: theme.tint },
                signupMutation.isPending && styles.buttonDisabled
              ]}
              onPress={handleSignup}
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Create Account</Text>
                  <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/auth/login')}
              style={styles.linkButton}
            >
              <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                Already have an account? <Text style={[styles.linkTextBold, { color: theme.tint }]}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 4,
  },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    height: 46,
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    height: '100%',
  },
  errorText: {
    fontSize: 11,
    marginTop: 2,
    marginLeft: 4,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    marginTop: 8,
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: '700',
  },
});

export default SignupScreen;