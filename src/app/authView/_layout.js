import { Stack, router } from 'expo-router';
import { useAuth } from '../auth/authContext';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import LoadingScreen from '../../components/LoadingScreen';

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth();

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [isLoading, user, router]);

  // Show loading while checking auth state
  if (isLoading || !user) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'AuraMove',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={28} color="#007aff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="fitnessView" options={{ title: 'Fitness' }} />
      <Stack.Screen name="foodView" options={{ title: 'Food' }} />
    </Stack>
  );
}
