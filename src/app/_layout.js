import { Stack, useRouter, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from './auth/authContext';
import { useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';

// Prevent the splash screen from auto-hiding before the auth state is determined.
SplashScreen.preventAutoHideAsync();

function AuthLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 [_layout] useEffect triggered - user:', user ? 'authenticated' : 'null', 'isLoading:', isLoading);
    // Wait until the auth state is loaded before navigating.
    if (!isLoading) {
      if (user) {
        // User is signed in. Redirect to the main app.
        console.log('🔄 [_layout] User authenticated, redirecting to dashboard...');
        router.replace('/authView/dashboard');
        SplashScreen.hideAsync();
      } else {
        // User is not signed in. Show the welcome screen (index.js) instead of redirecting to login.
        // The welcome screen will handle navigation to login/register.
        console.log('🔄 [_layout] User not authenticated, showing welcome screen...');
        SplashScreen.hideAsync();
      }
    } else {
      console.log('🔄 [_layout] Still loading auth state...');
    }
  }, [user, isLoading, router]);

  // Show loading screen while determining auth state
  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // If user is not authenticated, show the welcome screen (index.js)
  if (!user) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  // If user is authenticated, show the main app stack
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}
