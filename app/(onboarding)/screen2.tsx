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

// // Enable LayoutAnimation for Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// export default function OnboardingScreen2() {
//   const [isReady, setIsReady] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//       setIsReady(true);
//     }, 50);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleNext = () => {
//     router.push('/(onboarding)/screen3');
//   };

//   const handleBack = () => {
//     router.back();
//   };

//   const handleSkip = async () => {
//     await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//     router.replace('/(auth)/login');
//   };

//   const data = ONBOARDING_DATA[1];

//   return (
//     <View style={styles.root}>
//       {/* The ImageBackground is placed first.
//         StyleSheet.absoluteFillObject ensures it takes 100% width and height
//         of the root view, covering the status bar and bottom area.
//       */}
//       <ImageBackground
//         source={data.backgroundImage}
//         style={[
//           StyleSheet.absoluteFillObject,
//           {
//             height: height - 400,
//           },
//         ]}
//         resizeMode="stretch"
//       />

//       {/* This View wraps the content and handles the fade-in.
//         We use flex: 1 to ensure it overlays the background correctly.
//       */}
//       <View style={[styles.contentWrapper, { opacity: isReady ? 1 : 0 }]}>
//         {/* <OnboardingHeader showBack={true} onBack={handleBack} onSkip={handleSkip} /> */}

//         {/* This empty View pushes the card to the bottom */}
//         <View style={styles.spacer} />

//         <SafeAreaView edges={['bottom']} className="px-container pb-4">
//           <OnboardingCard
//             title={data.title}
//             description={data.description}
//             currentIndex={1}
//             totalScreens={ONBOARDING_DATA.length}
//           />

//           {/* <PrimaryButton
//             title={data.buttonText}
//             onPress={handleNext}
//             rightIcon={<IconBadge icon={<ArrowRightIcon size={24} color="#FFFFFF" />} />}
//             style={{ marginVertical: 24 }}
//             withShadow={false}
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

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: '#E8DDD0', // Fallback color while image loads
//   },
//   contentWrapper: {
//     flex: 1,
//     zIndex: 1,
//   },
//   spacer: {
//     flex: 1,
//   },
// });
