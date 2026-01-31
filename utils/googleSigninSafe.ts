import { Platform } from 'react-native';

let GoogleSignin: any;
let statusCodes: any = {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
};

try {
    // Attempt to load the module. If the native module is missing (Expo Go), this might succeed in loading JS 
    // but fail later, OR fail immediately if the JS side eagerly calls NativeModules.
    // The official library usually eagerly checks NativeModules.
    const googleSigninModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleSigninModule.GoogleSignin;
    statusCodes = googleSigninModule.statusCodes || statusCodes;
} catch (e) {
    console.warn('GoogleSignin not available (likely running in Expo Go or without dev client). Mocking implementation.');
}

// Additional safety check: even if require works, the native module might be null.
// The library might throw when calling methods if not initialized properly.
// However, the crash reported was in the constructor/global scope.
if (!GoogleSignin) {
    GoogleSignin = {
        configure: (_params?: any) => { console.log('GoogleSignin.configure mock called'); },
        hasPlayServices: async (_params?: any) => {
            console.log('GoogleSignin.hasPlayServices mock called');
            // We return false or throw to indicate it's not available
            return false;
        },
        signIn: async () => {
            console.log('GoogleSignin.signIn mock called');
            throw new Error('Google Sign-In is not available in Expo Go. Please stick to development build.');
        },
        signOut: async () => { },
        isSignedIn: async () => false,
        getCurrentUser: async () => null,
    };
}

export { GoogleSignin, statusCodes };
