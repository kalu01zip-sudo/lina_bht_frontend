// // components/CustomSplashScreen.tsx
// import React, { useEffect, useRef } from 'react';
// import { View, Image, Animated, Easing, Dimensions } from 'react-native';
// import * as SplashScreen from 'expo-splash-screen';
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

//   // Responsive sizing based on screen width
//   const getLogoSize = () => {
//     // Base size: 147x214, but scale based on screen width
//     const baseWidth = 147;
//     const baseHeight = 214;
//     const screenWidth = width;

//     // For smaller screens (under 380px), use 80% of base size
//     if (screenWidth < 380) {
//       return { width: baseWidth * 0.8, height: baseHeight * 0.8 };
//     }
//     // For medium screens (380-600px), use base size
//     if (screenWidth < 600) {
//       return { width: baseWidth, height: baseHeight };
//     }
//     // For larger screens, use 110% of base size
//     return { width: baseWidth * 1.1, height: baseHeight * 1.1 };
//   };

//   const logoSize = getLogoSize();
//   // Reduced animation scale (1.2 instead of 1.4)
//   const maxScale = 1.2;
//   // Reduced exit scale (1.3 instead of 1.6)
//   const exitScale = 1.3;

//   useEffect(() => {
//     // Hide the native splash screen immediately
//     SplashScreen.hideAsync();

//     // More subtle breathing animation
//     const breathingAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.parallel([
//           Animated.timing(scaleAnim, {
//             toValue: maxScale,
//             duration: 1200,
//             easing: Easing.inOut(Easing.cubic),
//             useNativeDriver: true,
//           }),
//           Animated.timing(opacityAnim, {
//             toValue: 0.85,
//             duration: 1200,
//             easing: Easing.inOut(Easing.cubic),
//             useNativeDriver: true,
//           }),
//         ]),
//         Animated.parallel([
//           Animated.timing(scaleAnim, {
//             toValue: 1,
//             duration: 1200,
//             easing: Easing.inOut(Easing.cubic),
//             useNativeDriver: true,
//           }),
//           Animated.timing(opacityAnim, {
//             toValue: 1,
//             duration: 1200,
//             easing: Easing.inOut(Easing.cubic),
//             useNativeDriver: true,
//           }),
//         ]),
//       ])
//     );

//     breathingAnimation.start();

//     const timer = setTimeout(() => {
//       breathingAnimation.stop();
//       Animated.parallel([
//         Animated.timing(scaleAnim, {
//           toValue: exitScale,
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
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Animated.Image
//           source={require('@/assets/images/splash_screen_logo.png')}
//           style={{
//             width: logoSize.width,
//             height: logoSize.height,
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

  // Responsive sizing based on screen width - SMALLER VERSION
  const getLogoSize = () => {
    // Reduced base sizes
    const baseWidth = 100; // Was 147
    const baseHeight = 145; // Was 214
    const screenWidth = width;

    // For smaller screens (under 380px), use 70% of base size
    if (screenWidth < 380) {
      return { width: baseWidth * 0.7, height: baseHeight * 0.7 };
    }
    // For medium screens (380-600px), use 85% of base size
    if (screenWidth < 600) {
      return { width: baseWidth * 0.85, height: baseHeight * 0.85 };
    }
    // For larger screens, use base size
    return { width: baseWidth, height: baseHeight };
  };

  const logoSize = getLogoSize();
  // Even more subtle animation scale
  const maxScale = 1.1; // Was 1.2
  const exitScale = 1.15; // Was 1.3

  useEffect(() => {
    // Hide the native splash screen immediately
    SplashScreen.hideAsync();

    // Very subtle breathing animation
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: maxScale,
            duration: 1500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.9,
            duration: 1500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1500,
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
          toValue: exitScale,
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
            width: logoSize.width,
            height: logoSize.height,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
