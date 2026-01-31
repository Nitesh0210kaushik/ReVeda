import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService, { SignupData, LoginData, VerifyOTPData, ResendOTPData, User } from '../services/api';

// Query Keys
export const AUTH_QUERY_KEYS = {
  user: ['auth', 'user'] as const,
  profile: ['auth', 'profile'] as const,
} as const;

// Custom hook for signup
export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupData) => ApiService.signup(data),
    onError: (error: any) => {
      console.error('Signup error:', error);
    },
  });
};

// Custom hook for login
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginData) => ApiService.login(data),
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
};

// Custom hook for OTP verification
export const useVerifyOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyOTPData) => ApiService.verifyOTP(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user cache
        queryClient.setQueryData(AUTH_QUERY_KEYS.user, response.data.user);
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, response.data.user);
      }
    },
    onError: (error: any) => {
      console.error('Verify OTP error:', error);
    },
  });
};

// Custom hook for resending OTP
export const useResendOTP = () => {
  return useMutation({
    mutationFn: (data: ResendOTPData) => ApiService.resendOTP(data),
    onError: (error: any) => {
      console.error('Resend OTP error:', error);
    },
  });
};

// Custom hook for logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ApiService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
    },
  });
};

// Custom hook for getting user profile
export const useProfile = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: async () => {
      const response = await ApiService.getProfile();
      if (response.success && response.data) {
        return response.data.user;
      }
      throw new Error(response.message || 'Failed to fetch profile');
    },
    enabled: false, // Only fetch when explicitly called
    retry: 1,
  });
};

// Custom hook for getting current user from storage
export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: () => ApiService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Custom hook for uploading profile picture
export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => ApiService.uploadProfilePicture(formData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update user cache
        queryClient.setQueryData(AUTH_QUERY_KEYS.user, response.data.user);
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, response.data.user);
      }
    },
    onError: (error: any) => {
      console.error('Upload profile picture error:', error);
    },
  });
};

// Custom hook for checking authentication status
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['auth', 'status'],
    queryFn: () => ApiService.isAuthenticated(),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false,
  });
};