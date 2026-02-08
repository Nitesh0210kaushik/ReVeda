import { Platform } from 'react-native';

declare const __DEV__: boolean;

const PROD_URL = 'https://reveda-backend.onrender.com';
const DEV_ANDROID_URL = 'http://10.0.2.2:5000';
const DEV_DEFAULT_URL = 'http://localhost:5000';

export const getBaseUrl = () => {
    // If enabled via env var, use it
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    if (!__DEV__) {
        return PROD_URL;
    }

    if (Platform.OS === 'android') {
        return DEV_ANDROID_URL;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return `http://${window.location.hostname}:5000`;
    }

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
