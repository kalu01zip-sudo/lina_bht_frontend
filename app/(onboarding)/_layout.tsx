// // app/(onboarding)/_layout.tsx
// import { Stack } from 'expo-router';
// import { View } from 'react-native';

// export default function OnboardingLayout() {
//   return (
//     <View className="flex-1 bg-[#E8DDD0]">
//       <Stack
//         screenOptions={{
//           headerShown: false,
//           animation: 'slide_from_right',
//           contentStyle: { backgroundColor: '#E8DDD0' },
//           animationDuration: 300, // Smooth but fast animation
//         }}>
//         <Stack.Screen
//           name="screen1"
//           options={{
//             animation: 'slide_from_right',
//             contentStyle: { backgroundColor: '#E8DDD0' },
//           }}
//         />
//         <Stack.Screen
//           name="screen2"
//           options={{
//             animation: 'slide_from_right',
//             contentStyle: { backgroundColor: '#E8DDD0' },
//           }}
//         />
//         <Stack.Screen
//           name="screen3"
//           options={{
//             animation: 'slide_from_right',
//             contentStyle: { backgroundColor: '#E8DDD0' },
//           }}
//         />
//       </Stack>
//     </View>
//   );
// }

// app/(onboarding)/_layout.tsx
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#E8DDD0' },
      }}>
      <Stack.Screen name="index" />
      {/* Remove screen1, screen2, screen3 references */}
    </Stack>
  );
}
