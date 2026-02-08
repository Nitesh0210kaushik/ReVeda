import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import AnimatedSplash from '../components/AnimatedSplash';
import { AppModeProvider } from '../context/AppModeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '../providers/QueryProvider';
import { AuthProvider } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      // This tells the native splash screen to hide immediately
      // We do this as soon as the app is ready, to show our AnimatedSplash
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AuthProvider>
          <AppModeProvider>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
              {!splashAnimationFinished && (
                <AnimatedSplash
                  onAnimationFinish={() => setSplashAnimationFinished(true)}
                />
              )}
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="auth/signup" />
                <Stack.Screen name="auth/verify-otp" />
                <Stack.Screen name="doctor-recruitment" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="doctor-register" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" />
              </Stack>
              <Toast />
            </View>
          </AppModeProvider>
        </AuthProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
