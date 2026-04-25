// app/(flow)/hair-scan/_layout.tsx
import { Stack } from 'expo-router';

export default function HairScanLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#E8DDD0',
        },
      }}>
      <Stack.Screen name="camera-scan" />
      <Stack.Screen name="loading-screen" />
      <Stack.Screen name="analysis-complete" />
    </Stack>
  );
}
