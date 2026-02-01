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
import { useLogin, useGoogleLogin } from '../../hooks/useAuth';
import Colors from '../../constants/Colors';
import { GoogleSignin, statusCodes } from '../../utils/googleSigninSafe';
import { Mail, Phone, ArrowRight } from 'lucide-react-native';

// Configure Google Sign-In moved inside component to prevent Expo Go crashes


const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();

  React.useEffect(() => {
    try {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
        scopes: ['profile', 'email'],
      });
    } catch (e) {
      // Ignore error likely due to running in Expo Go
      console.log('GoogleSignin configure failed (expected in Expo Go):', e);
    }
  }, []);

  const validateInput = (): boolean => {
    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return false;
    }

    // Check if it's email or phone
    const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(identifier);
    const isPhone = /^[6-9]\d{9}$/.test(identifier);

    if (!isEmail && !isPhone) {
      setError('Please enter a valid email or phone number');
      return false;
    }

    setError('');
    return true;
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.idToken) {
        // Send idToken to backend for verification and login
        // Send idToken to backend for verification and login
        const response = await googleLoginMutation.mutateAsync(userInfo.idToken);

        if (response.success) {
          Toast.show({
            type: 'success',
            text1: 'Google Login Success',
            text2: `Welcome ${userInfo.user.name}!`,
          });

          // Navigate to Home or wherever
          router.replace('/(tabs)/home');
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } else {
        throw new Error('No ID token present');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Toast.show({
          type: 'error',
          text1: 'Google Login Error',
          text2: 'Google Play Services are not available',
        });
      } else {
        // some other error happened
        Toast.show({
          type: 'error',
          text1: 'Google Login Failed',
          text2: error.message || 'Something went wrong',
        });
      }
    }
  };

  // Previous handleLogin continues below...
  const handleLogin = async () => {
    if (!validateInput()) return;

    try {
      const response = await loginMutation.mutateAsync({ identifier });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent! 📩',
          text2: 'Please check your email for the verification code.',
        });

        // Navigate to Verify OTP screen
        router.push({
          pathname: '/auth/verify-otp',
          params: { identifier, type: 'login' }
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response.message || 'Please check your credentials.',
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: errorMessage,
      });
    }
  };

  const handleInputChange = (text: string) => {
    setIdentifier(text.trim());
    if (error) setError('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <View style={[styles.logoContainer, { shadowColor: theme.tint }]}>
              <Image
                source={require('../../assets/images/reveda_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Sign in to continue your wellness journey with ReVeda
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Email or Phone Number</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.cardBackground, borderColor: error ? theme.badgeText : theme.borderColor }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="name@example.com"
                  placeholderTextColor={theme.textSecondary}
                  value={identifier}
                  onChangeText={handleInputChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="username"
                />
              </View>
              {error ? (
                <Text style={[styles.errorText, { color: theme.badgeText }]}>{error}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.tint, shadowColor: theme.tint },
                loginMutation.isPending && styles.buttonDisabled
              ]}
              onPress={handleLogin}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Send OTP</Text>
                  <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: theme.borderColor }]} />
              <Text style={[styles.dividerText, { color: theme.textSecondary }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.borderColor }]} />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity
              style={[
                styles.googleButton,
                { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }
              ]}
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }}
                  style={styles.googleIcon}
                />
                <Text style={[styles.googleButtonText, { color: '#374151' }]}>Continue with Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/auth/signup')}
              style={styles.linkButton}
            >
              <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                Don't have an account? <Text style={[styles.linkTextBold, { color: theme.tint }]}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/doctor-recruitment')}
              style={styles.doctorLinkButton}
            >
              <Text style={[styles.doctorLinkText, { color: theme.textSecondary }]}>
                Are you a Doctor? <Text style={[styles.linkTextBold, { color: theme.tint }]}>Join ReVeda</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
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
    flex: 1,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 90,
    height: 90,
    marginBottom: 20,
    borderRadius: 45,
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
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    height: 50,
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },
  errorText: {
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
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
    fontSize: 18,
    fontWeight: '700',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
    padding: 8,
  },
  doctorLinkButton: {
    marginTop: 8,
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    fontSize: 15,
  },
  doctorLinkText: {
    fontSize: 14,
    marginTop: 4,
  },
  linkTextBold: {
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    borderRadius: 14,
    padding: 16, // Slightly reduced padding to match standard
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    // Color handled inline or here, user liked previous which was specific
  },
});

export default LoginScreen;