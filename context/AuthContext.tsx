import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentUser, useAuthStatus } from '../hooks/useAuth';
import { User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: user, refetch: refetchUser, isLoading: userLoading } = useCurrentUser();
  const { data: isAuthenticated, refetch: refetchAuthStatus, isLoading: authLoading } = useAuthStatus();

  useEffect(() => {
    // Set loading to false when both queries have completed
    if (!userLoading && !authLoading) {
      setIsLoading(false);
    }
  }, [userLoading, authLoading]);

  const refreshAuth = () => {
    refetchUser();
    refetchAuthStatus();
  };

  const value: AuthContextType = {
    user: user || null,
    isAuthenticated: isAuthenticated || false,
    isLoading,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};