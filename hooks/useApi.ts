import { useQuery } from '@tanstack/react-query';
import ApiService from '../services/api';

// Custom hook for health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['api', 'health'],
    queryFn: async () => {
      const response = await ApiService.healthCheck();
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Health check failed');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Custom hook for checking API connectivity
export const useApiConnectivity = () => {
  const { data, isLoading, error, refetch } = useHealthCheck();

  return {
    isConnected: !!data?.success,
    isChecking: isLoading,
    error,
    checkConnection: refetch,
  };
};

// Custom hook to fetch doctors
export const useDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await ApiService.getDoctors();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch doctors');
    },
    staleTime: 60 * 1000, // 1 minute stale time
    refetchOnWindowFocus: true, // Refetch when app comes to foreground
  });
};