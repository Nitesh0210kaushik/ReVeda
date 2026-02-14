import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService from '../services/adminService';

// Query Keys
export const ADMIN_QUERY_KEYS = {
    stats: ['admin', 'stats'] as const,
    analytics: ['admin', 'analytics'] as const,
    doctors: (page: number, limit: number) => ['admin', 'doctors', page, limit] as const,
} as const;

// Hook for fetching Admin Dashboard Stats
export const useAdminStats = () => {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.stats,
        queryFn: async () => {
            const response = await AdminService.getStats();
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch stats');
        },
    });
};

// Hook for fetching Admin Analytics
export const useAdminAnalytics = () => {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.analytics,
        queryFn: async () => {
            const response = await AdminService.getAnalytics();
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch analytics');
        },
    });
};

// Hook for fetching Doctors with pagination
export const useDoctors = (page: number, limit: number = 10) => {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.doctors(page, limit),
        queryFn: async () => {
            const response = await AdminService.getDoctors(page, limit);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch doctors');
        },
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    });
};

// Hook for verifying/unverifying a doctor
export const useVerifyDoctor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ doctorId, isVerified }: { doctorId: string; isVerified: boolean }) =>
            AdminService.verifyDoctor(doctorId, isVerified),
        onSuccess: (response, variables) => {
            if (response.success) {
                // Invalidate doctors list to refetch
                queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
                // Also invalidate stats as counts might change
                queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
            }
        },
        onError: (error: any) => {
            console.error('Verify Doctor error:', error);
        },
    });
};
