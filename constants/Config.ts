import { Platform } from 'react-native';

declare const __DEV__: boolean;

const PROD_URL = 'https://reveda-backend.onrender.com';
const DEV_ANDROID_URL = 'http://10.0.2.2:5000';
const DEV_DEFAULT_URL = 'http://localhost:5000';

export const getBaseUrl = () => {
    // 1. If EXPO_PUBLIC_API_URL is set in .env, USE IT (Highest Priority)
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // 2. Production Fallback
    if (!__DEV__) {
        return PROD_URL;
    }

    // 3. Android Emulator Fallback
    if (Platform.OS === 'android') {
        return DEV_ANDROID_URL;
    }

    // 4. Web Fallback (localhost)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return `http://${window.location.hostname}:5000`;
    }

    // 5. iOS/Default Fallback
    return DEV_DEFAULT_URL;
};

export const API_URL = getBaseUrl();

export const getImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('https')) return path;
    // Handle backslashes from Windows paths
    const cleanPath = path.replace(/\\/g, '/');
    return `${API_URL}/${cleanPath}`;
};
