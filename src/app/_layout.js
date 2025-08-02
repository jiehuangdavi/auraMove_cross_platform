import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="exercises" options={{ title: 'Exercises' }} />
      <Stack.Screen name="exercise" options={{ title: 'Exercise Details' }} />
    </Stack>
  );
}