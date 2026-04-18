// // app/(onboarding)/screen1.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   ImageBackground,
//   LayoutAnimation,
//   Platform,
//   UIManager,
//   Dimensions,
//   StyleSheet,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import OnboardingButton from '@/components/buttons/OnboardingButton';
// import OnboardingCard from '@/components/onboarding/OnboardingCard';
// import { ONBOARDING_DATA } from '@/constants/onboarding';

// const { height } = Dimensions.get('window');

// // Enable LayoutAnimation for Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// export default function OnboardingScreen1() {
//   const [isReady, setIsReady] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       LayoutAnimation.configureNext({
//         duration: 300,
//         create: {
//           type: LayoutAnimation.Types.easeInEaseOut,
//           property: LayoutAnimation.Properties.opacity,
//         },
//         update: {
//           type: LayoutAnimation.Types.easeInEaseOut,
//         },
//       });
//       setIsReady(true);
//     }, 50);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleNext = () => {
//     router.push('/(onboarding)/screen2');
//   };

//   const handleSkip = async () => {
//     await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//     router.replace('/(auth)/login');
//   };

//   const data = ONBOARDING_DATA[0];

//   return (
//     <View className="flex-1 bg-[#E8DDD0]">
//       <View
//         className="flex-1"
//         style={{
//           zIndex: 1,
//           opacity: isReady ? 1 : 0,
//         }}>
//         {/* Background Image */}
//         <ImageBackground
//           source={data.backgroundImage}
//           style={[
//             StyleSheet.absoluteFillObject,
//             {
//               height: height - 300,
//             },
//           ]}
//           resizeMode="stretch"
//         />

//         {/* Header */}
//         {/* <OnboardingHeader showBack={false} onSkip={handleSkip} /> */}

//         {/* Empty space for image area */}
//         <View className="flex-1" />

//         {/* Bottom Card Section */}
//         <SafeAreaView edges={['bottom']} className="gap-6 px-container pb-4">
//           <OnboardingCard
//             title={data.title}
//             description={data.description}
//             currentIndex={0}
//             totalScreens={ONBOARDING_DATA.length}
//           />

//           <OnboardingButton
//             title="Get Started"
//             onPress={handleNext}
//             style={{ marginVertical: 24 }}
//             height={64}
//           />
//         </SafeAreaView>
//       </View>
//     </View>
//   );
// }

