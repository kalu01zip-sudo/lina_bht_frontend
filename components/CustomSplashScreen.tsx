// // components/CustomSplashScreen.tsx (with breathing animation)
// import React, { useEffect, useRef } from 'react';
// import { View, Image, Animated, Easing, Dimensions } from 'react-native';
// import VectorBg from '@/components/VectorBg';

// const { width, height } = Dimensions.get('window');

// interface CustomSplashScreenProps {
//   onAnimationComplete: () => void;
//   minimumDisplayTime?: number;
// }

// export default function CustomSplashScreen({
//   onAnimationComplete,
//   minimumDisplayTime = 2500,
// }: CustomSplashScreenProps) {
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const opacityAnim = useRef(new Animated.Value(1)).current;
//   const startTime = useRef(Date.now());

//   useEffect(() => {
//     // Breathing animation: scale up and down
//     const breathingAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.parallel([
//           Animated.timing(scaleAnim, {
//             toValue: 1.4,
//             duration: 1000,
//             easing: Easing.inOut(Easing.cubic),
//             useNativeDriver: true,
//           }),
//           Animated.timing(opacityAnim, {
//             toValue: 0.7,
//             duration: 1000,
//             easing: Easing.inOut(Easing.cubic),
//             useNativeDriver: true,
//           }),
//         ]),
//         Animated.parallel([
//           Animated.timing(scaleAnim, {
//             toValue: 1,
//             duration: 1000,
//             easing: Easing.inOut(Easing.cubic),
//             useNativeDriver: true,
//           }),
//           Animated.timing(opacityAnim, {
//             toValue: 1,
//             duration: 1000,
//             easing: Easing.inOut(Easing.cubic),
//             useNativeDriver: true,
//           }),
//         ]),
//       ])
//     );

//     breathingAnimation.start();

//     // Ensure minimum display time
//     const timer = setTimeout(() => {
//       breathingAnimation.stop();

//       // Final scale up before exit
//       Animated.parallel([
//         Animated.timing(scaleAnim, {
//           toValue: 1.6,
//           duration: 300,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//         Animated.timing(opacityAnim, {
//           toValue: 0,
//           duration: 300,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//       ]).start(() => {
//         onAnimationComplete();
//       });
//     }, minimumDisplayTime);

//     return () => {
//       breathingAnimation.stop();
//       clearTimeout(timer);
//     };
//   }, []);

//   return (
//     <View style={{ flex: 1, backgroundColor: '#E8DDD0' }}>
//       <VectorBg />
//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         <Animated.Image
//           source={require('@/assets/images/splash_screen_logo.png')}
//           style={{
//             width: 147,
//             height: 214,
//             transform: [{ scale: scaleAnim }],
//             opacity: opacityAnim,
//           }}
//           resizeMode="contain"
//         />
//       </View>
//     </View>
//   );
// }

// components/CustomSplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import VectorBg from '@/components/VectorBg';

const { width, height } = Dimensions.get('window');

interface CustomSplashScreenProps {
  onAnimationComplete: () => void;
  minimumDisplayTime?: number;
}

export default function CustomSplashScreen({
  onAnimationComplete,
  minimumDisplayTime = 2500,
}: CustomSplashScreenProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Hide the native splash screen immediately
    SplashScreen.hideAsync();

    // Breathing animation
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    breathingAnimation.start();

    const timer = setTimeout(() => {
      breathingAnimation.stop();
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.6,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete();
      });
    }, minimumDisplayTime);

    return () => {
      breathingAnimation.stop();
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#E8DDD0' }}>
      <VectorBg />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.Image
          source={require('@/assets/images/splash_screen_logo.png')}
          style={{
            width: 147,
            height: 214,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
