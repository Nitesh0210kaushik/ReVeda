import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthContext } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingScreen message="Initializing app..." />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth/login" />;
}