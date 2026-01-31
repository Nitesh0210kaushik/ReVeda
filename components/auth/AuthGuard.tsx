import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import LoadingScreen from '../common/LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated || !user) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default AuthGuard;