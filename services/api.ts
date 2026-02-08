import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/Config';

// API Configuration
declare const __DEV__: boolean;

const API_CONFIG = {
  BASE_URL: API_URL,
  TIMEOUT: 10000,
};

console.log('🚀 API Config:', {
  BASE_URL: API_CONFIG.BASE_URL,
  IS_DEV: __DEV__,
  PLATFORM: Platform.OS
});

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'Patient' | 'Doctor' | 'Admin' | 'Marketing';
  isVerified: boolean;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  experience: string;
  fee: string;
  bio?: string;
  image?: string;
  rating: number;
  isVerified: boolean;
  gender: 'Male' | 'Female' | 'Other';
  registrationNumber: string;
  kycVerify: boolean;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface LoginData {
  identifier: string; // email or phone
}

export interface VerifyOTPData {
  identifier: string;
  otp: string;
}

export interface ResendOTPData {
  identifier: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              if (response.data?.tokens) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

                await this.storeTokens({ accessToken, refreshToken: newRefreshToken });

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return this.api(originalRequest);
              }
            }
          } catch (refreshError) {
            await this.clearStorage();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Storage methods
  private async storeTokens(tokens: AuthTokens): Promise<void> {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken],
    ]);
  }

  private async storeUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  async clearStorage(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
    ]);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  }

  // Auth API methods
  async signup(data: SignupData): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/auth/signup', data);
    return response.data || { success: false, message: 'No response data' };
  }

  async login(data: LoginData): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/auth/login', data);
    return response.data || { success: false, message: 'No response data' };
  }

  async verifyOTP(data: VerifyOTPData): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response: AxiosResponse<ApiResponse<{ user: User; tokens: AuthTokens }>> =
      await this.api.post('/auth/verify-otp', data);

    if (response.data?.success && response.data?.data) {
      const { user, tokens } = response.data.data;
      await this.storeTokens(tokens);
      await this.storeUser(user);
    }

    return response.data || { success: false, message: 'No response data' };
  }

  async loginWithGoogle(idToken: string): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response: AxiosResponse<ApiResponse<{ user: User; tokens: AuthTokens }>> =
      await this.api.post('/auth/google-login', { idToken });

    if (response.data?.success && response.data?.data) {
      const { user, tokens } = response.data.data;
      await this.storeTokens(tokens);
      await this.storeUser(user);
    }

    return response.data || { success: false, message: 'No response data' };
  }

  async resendOTP(data: ResendOTPData): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/auth/resend-otp', data);
    return response.data || { success: false, message: 'No response data' };
  }

  private async refreshToken(refreshToken: string): Promise<ApiResponse<{ tokens: AuthTokens }>> {
    const response: AxiosResponse<ApiResponse<{ tokens: AuthTokens }>> =
      await this.api.post('/auth/refresh-token', { refreshToken });
    return response.data || { success: false, message: 'No response data' };
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.get('/auth/profile');
    return response.data || { success: false, message: 'No response data' };
  }

  async logout(): Promise<void> {
    await this.clearStorage();
  }

  async uploadProfilePicture(formData: FormData): Promise<ApiResponse<{ user: User; profilePicture: string }>> {
    const response: AxiosResponse<ApiResponse<{ user: User; profilePicture: string }>> = await this.api.post(
      '/auth/profile-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data?.success && response.data?.data) {
      await this.storeUser(response.data.data.user);
    }

    return response.data || { success: false, message: 'No response data' };
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/health');
    return response.data || { success: false, message: 'No response data' };
  }

  // Doctor API methods
  async getDoctors(): Promise<ApiResponse<Doctor[]>> {
    const response: AxiosResponse<ApiResponse<Doctor[]>> = await this.api.get('/doctors');
    return response.data || { success: false, message: 'No response data' };
  }
}

export default new ApiService();