import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useVerifyOTP, useResendOTP } from '../../hooks/useAuth';
import { useAuthContext } from '../../context/AuthContext';

const VerifyOTPScreen: React.FC = () => {
  const params = useLocalSearchParams<{ identifier: string; type: 'login' | 'signup' }>();
  const { identifier, type } = params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { refreshAuth, isAuthenticated } = useAuthContext();

  const verifyOTPMutation = useVerifyOTP();
  const resendOTPMutation = useResendOTP();

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Redirect to tabs when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleOTPChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join('');

    if (otpToVerify.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await verifyOTPMutation.mutateAsync({
        identifier: identifier!,
        otp: otpToVerify,
      });

      if (response.success) {
        // Refresh auth context - this will trigger the useEffect above once completed
        refreshAuth();

        Toast.show({
          type: 'success',
          text1: type === 'signup' ? 'Welcome to ReVeda! 🌱' : 'Welcome Back! 👋',
          text2: 'Verification Successful',
        });

        // Navigation is handled by useEffect on isAuthenticated change
      } else {
        setError(response.message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: response.message || 'Invalid OTP',
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      setError(errorMessage);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: errorMessage,
      });
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const response = await resendOTPMutation.mutateAsync({
        identifier: identifier!,
      });

      if (response.success) {
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setError('');

        Toast.show({
          type: 'success',
          text1: 'OTP Resent 📨',
          text2: 'Please check your email for the new code.',
        });

        inputRefs.current[0]?.focus();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Resend Failed',
          text2: response.message || 'Failed to resend OTP',
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      Toast.show({
        type: 'error',
        text1: 'Resend Error',
        text2: errorMessage,
      });
    }
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.identifierText}>{identifier}</Text>
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <View style={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  error ? styles.otpInputError : null,
                ]}
                value={digit}
                onChangeText={(value) => handleOTPChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (verifyOTPMutation.isPending || otp.join('').length !== 6) && styles.buttonDisabled
          ]}
          onPress={() => handleVerifyOTP()}
          disabled={verifyOTPMutation.isPending || otp.join('').length !== 6}
        >
          {verifyOTPMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {!canResend ? (
            <Text style={styles.timerText}>
              Resend OTP in {formatTimer(timer)}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={resendOTPMutation.isPending}
              style={styles.resendButton}
            >
              {resendOTPMutation.isPending ? (
                <ActivityIndicator size="small" color="#4CAF50" />
              ) : (
                <Text style={styles.resendText}>Resend OTP</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back to {type === 'signup' ? 'Sign Up' : 'Login'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  identifierText: {
    fontWeight: '600',
    color: '#4CAF50',
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  otpInputFilled: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0fff0',
  },
  otpInputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 16,
    color: '#666',
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
  },
  backText: {
    fontSize: 16,
    color: '#666',
  },
});

export default VerifyOTPScreen;