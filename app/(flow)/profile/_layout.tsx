// // app/(flow)/face-scan/_layout.tsx
// import { Stack } from 'expo-router';

// export default function FaceScanLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,

//         contentStyle: {
//           backgroundColor: '#E8DDD0', // Use your theme color here
//         },
//       }}>
//       <Stack.Screen name="AskingUpgradeToPremiumScreen" />
//       <Stack.Screen name="PremiumPlanScreen" />
//       <Stack.Screen name="loading-screen" />

//       {/*
//       <Stack.Screen name="analysis-complete" />
//       <Stack.Screen name="analysis-compatibility-check" /> */}
//     </Stack>
//   );
// }

// app/(flow)/profile/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileFlowLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#E8DDD0' },
      }}>
      <Stack.Screen name="asking-upgrage-to-premium-screen" />
      <Stack.Screen name="premium-plan-screen" />
      <Stack.Screen name="loading-screen" />
    </Stack>
  );
}
