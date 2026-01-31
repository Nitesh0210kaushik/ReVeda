# ReVeda React Native Authentication Implementation

Complete authentication system with React Query hooks, services, and components.

## 🏗️ Architecture Overview

```
frontend/
├── services/
│   └── api.ts                 # API service with axios & interceptors
├── hooks/
│   ├── useAuth.ts            # React Query auth hooks
│   └── useApi.ts             # API utility hooks
├── providers/
│   └── QueryProvider.tsx    # React Query client provider
├── context/
│   └── AuthContext.tsx      # Authentication context
├── components/
│   ├── auth/
│   │   ├── SignupScreen.tsx  # User registration
│   │   ├── LoginScreen.tsx   # User login
│   │   ├── VerifyOTPScreen.tsx # OTP verification
│   │   └── AuthGuard.tsx     # Protected route wrapper
│   ├── profile/
│   │   └── ProfileScreen.tsx # User profile management
│   └── common/
│       └── LoadingScreen.tsx # Loading indicator
└── app/
    ├── index.tsx             # App entry point
    ├── auth/                 # Auth screens
    └── (tabs)/               # Protected app screens
```

## 🔧 Services Layer

### API Service (`services/api.ts`)
- **Axios Configuration**: Base URL, timeout, headers
- **Token Management**: Automatic token attachment and refresh
- **Storage Integration**: AsyncStorage for persistence
- **Error Handling**: Comprehensive error responses
- **Type Safety**: Full TypeScript support

**Key Features:**
```typescript
// Automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Auto-refresh tokens
    }
  }
);

// Storage methods
await storeTokens({ accessToken, refreshToken });
await getCurrentUser();
await isAuthenticated();
```

## 🎣 React Query Hooks

### Authentication Hooks (`hooks/useAuth.ts`)

#### `useSignup()`
```typescript
const signupMutation = useSignup();

await signupMutation.mutateAsync({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '9876543210'
});
```

#### `useLogin()`
```typescript
const loginMutation = useLogin();

await loginMutation.mutateAsync({
  identifier: 'john@example.com' // email or phone
});
```

#### `useVerifyOTP()`
```typescript
const verifyOTPMutation = useVerifyOTP();

await verifyOTPMutation.mutateAsync({
  identifier: 'john@example.com',
  otp: '123456'
});
```

#### `useResendOTP()`
```typescript
const resendOTPMutation = useResendOTP();

await resendOTPMutation.mutateAsync({
  identifier: 'john@example.com'
});
```

#### `useCurrentUser()`
```typescript
const { data: user, isLoading } = useCurrentUser();
```

#### `useAuthStatus()`
```typescript
const { data: isAuthenticated } = useAuthStatus();
```

#### `useLogout()`
```typescript
const logoutMutation = useLogout();
await logoutMutation.mutateAsync();
```

## 🎯 Context & Providers

### AuthContext (`context/AuthContext.tsx`)
Provides global authentication state:

```typescript
const { user, isAuthenticated, isLoading, refreshAuth } = useAuthContext();
```

### QueryProvider (`providers/QueryProvider.tsx`)
React Query configuration with:
- **Retry Logic**: Smart retry for network errors
- **Stale Time**: 5-minute cache duration
- **Error Handling**: No retry on 4xx errors

## 📱 Components

### SignupScreen
- **Form Validation**: Real-time validation with error display
- **Input Handling**: Auto-formatting for phone numbers
- **Loading States**: Mutation loading indicators
- **Navigation**: Auto-redirect to OTP verification

**Features:**
- First name & last name required
- Email validation
- Indian phone number validation (10 digits, starts with 6-9)
- Real-time error clearing

### LoginScreen
- **Flexible Input**: Email or phone number login
- **Validation**: Format checking for email/phone
- **OTP Flow**: Automatic navigation to verification

### VerifyOTPScreen
- **6-Digit Input**: Individual input fields with auto-focus
- **Auto-Submit**: Submits when all digits entered
- **Resend Logic**: 60-second countdown timer
- **Error Handling**: Clear OTP on error, refocus first input

**UX Features:**
- Auto-focus next input on digit entry
- Backspace navigation between inputs
- Visual feedback for filled/error states
- Timer display for resend availability

### ProfileScreen
- **User Information**: Display all user details
- **Verification Badge**: Shows account verification status
- **Profile Refresh**: Manual profile data refresh
- **Logout**: Secure logout with confirmation

### AuthGuard
Protects routes requiring authentication:

```typescript
<AuthGuard fallback={<Redirect href="/auth/login" />}>
  <ProtectedContent />
</AuthGuard>
```

## 🔐 Security Features

### Token Management
- **Access Tokens**: 15-minute expiry
- **Refresh Tokens**: 7-day expiry
- **Automatic Refresh**: Seamless token renewal
- **Secure Storage**: AsyncStorage with proper cleanup

### Request Security
- **Automatic Headers**: Bearer token attachment
- **Retry Logic**: Smart retry on network failures
- **Error Boundaries**: Graceful error handling
- **Rate Limiting**: Respects backend rate limits

## 🚀 Usage Examples

### Basic Authentication Flow

```typescript
// 1. Signup
const signupMutation = useSignup();
const result = await signupMutation.mutateAsync(signupData);

// 2. Verify OTP
const verifyMutation = useVerifyOTP();
await verifyMutation.mutateAsync({ identifier, otp });

// 3. Access protected content
const { user, isAuthenticated } = useAuthContext();
if (isAuthenticated) {
  // User is logged in
}
```

### Protected Route Setup

```typescript
// App layout with providers
<QueryProvider>
  <AuthProvider>
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  </AuthProvider>
</QueryProvider>

// Protected tabs
<AuthGuard fallback={<Redirect href="/auth/login" />}>
  <Tabs>
    <Tabs.Screen name="profile" />
  </Tabs>
</AuthGuard>
```

### API Integration

```typescript
// Custom hook usage
const { data: user } = useCurrentUser();
const { mutateAsync: login } = useLogin();

// Direct API calls
const response = await ApiService.getProfile();
const isAuth = await ApiService.isAuthenticated();
```

## 🎨 Styling

### Design System
- **Colors**: Consistent green theme (#4CAF50)
- **Typography**: Clear hierarchy with proper weights
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle elevation for cards
- **Animations**: Loading states and transitions

### Responsive Design
- **KeyboardAvoidingView**: Proper keyboard handling
- **ScrollView**: Scrollable content on small screens
- **Safe Areas**: Proper safe area handling
- **Platform Specific**: iOS/Android optimizations

## 🔧 Configuration

### Environment Setup
Update API base URL in `services/api.ts`:

```typescript
const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:5000/api/v1' 
    : 'https://your-production-api.com/api/v1',
  TIMEOUT: 10000,
};
```

### React Query Configuration
Customize in `providers/QueryProvider.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});
```

## 🧪 Testing

### Manual Testing Flow
1. **Signup**: Create account with valid details
2. **OTP**: Verify email OTP (check backend logs for OTP)
3. **Login**: Login with email/phone
4. **Profile**: View and refresh profile
5. **Logout**: Secure logout and redirect

### Error Scenarios
- Invalid email/phone formats
- Expired OTP codes
- Network connectivity issues
- Token expiration handling

## 🚀 Production Checklist

- [ ] Update API base URL for production
- [ ] Configure proper error tracking
- [ ] Set up push notifications for OTP
- [ ] Add biometric authentication
- [ ] Implement offline support
- [ ] Add analytics tracking
- [ ] Security audit for token storage
- [ ] Performance optimization

## 📚 Dependencies

```json
{
  "@tanstack/react-query": "^5.0.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "axios": "^1.6.0",
  "expo-router": "~3.4.0",
  "lucide-react-native": "^0.300.0"
}
```

## 🔄 State Management Flow

```
User Action → Hook → API Service → Backend → Response → Hook → Context → UI Update
     ↓           ↓         ↓          ↓         ↓        ↓        ↓         ↓
  Signup    useSignup   axios    Express   Database  Response  AuthContext  UI
```

This implementation provides a complete, production-ready authentication system with excellent UX, proper error handling, and maintainable code structure.