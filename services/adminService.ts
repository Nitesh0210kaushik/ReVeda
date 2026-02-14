import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/Config';
import { STORAGE_KEYS, ApiResponse, Doctor } from './api';

const BASE_URL = `${API_URL}/api/v1/admin`;

class AdminService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.api.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    async getStats(): Promise<ApiResponse> {
        const response: AxiosResponse<ApiResponse> = await this.api.get('/stats');
        return response.data;
    }

    async getDoctors(page: number = 1, limit: number = 10): Promise<ApiResponse<{ doctors: Doctor[], totalPages: number, currentPage: number, totalDoctors: number }>> {
        const response = await this.api.get(`/doctors?page=${page}&limit=${limit}`);
        return response.data;
    }

    async verifyDoctor(doctorId: string, isVerified: boolean): Promise<ApiResponse> {
        const response = await this.api.patch(`/doctors/${doctorId}/verify`, { isVerified });
        return response.data;
    }

    async getAnalytics(): Promise<ApiResponse<{ revenue: any, userGrowth: any }>> {
        const response = await this.api.get('/analytics');
        return response.data;
    }
}

export default new AdminService();
