// // app/(onboarding)/screen3.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   ImageBackground,
//   LayoutAnimation,
//   Platform,
//   UIManager,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import OnboardingCard from '@/components/onboarding/OnboardingCard';
// import { ONBOARDING_DATA } from '@/constants/onboarding';
// import OnboardingButton from '@/components/buttons/OnboardingButton';
// const { height } = Dimensions.get('window');
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// export default function OnboardingScreen3() {
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

//   const handleNext = async () => {
//     await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//     router.replace('/(auth)/login');
//   };

//   const handleBack = () => {
//     router.back();
//   };

//   const handleSkip = async () => {
//     await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//     router.replace('/(auth)/login');
//   };

//   const data = ONBOARDING_DATA[2];

//   return (
//     <View className="flex-1 bg-[#E8DDD0]">
//       <View
//         className="flex-1"
//         style={{
//           zIndex: 1,
//           opacity: isReady ? 1 : 0,
//         }}>
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

//         {/* <OnboardingHeader showBack={true} onBack={handleBack} onSkip={handleSkip} /> */}

//         <View className="flex-1" />

//         <SafeAreaView edges={['bottom']} className="px-container pb-4">
//           <OnboardingCard
//             title={data.title}
//             description={data.description}
//             currentIndex={2}
//             totalScreens={ONBOARDING_DATA.length}
//           />

//           {/* <PrimaryButton
//             title={data.buttonText}
//             onPress={handleNext}
//             rightIcon={<IconBadge icon={<ArrowRightIcon size={24} color="#FFFFFF" />} />}
//             style={{ marginVertical: 24 }}
//           /> */}

//           <OnboardingButton
//             title={data.buttonText}
//             onPress={handleNext}
//             style={{ marginVertical: 24 }}
//             height={64}
//           />
//         </SafeAreaView>
//       </View>
//     </View>
//   );
// }
