// // app/(onboarding)/index.tsx (New main onboarding carousel)
// import React, { useState, useRef } from 'react';
// import {
//   View,
//   ImageBackground,
//   FlatList,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import OnboardingButton from '@/components/buttons/OnboardingButton';
// import OnboardingCard from '@/components/onboarding/OnboardingCard';
// import { ONBOARDING_DATA } from '@/constants/onboarding';

// const { width, height } = Dimensions.get('window');

// export default function OnboardingCarousel() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef<FlatList>(null);
//   const router = useRouter();

//   const handleNext = () => {
//     if (currentIndex < ONBOARDING_DATA.length - 1) {
//       flatListRef.current?.scrollToIndex({
//         index: currentIndex + 1,
//         animated: true,
//       });
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       handleComplete();
//     }
//   };

//   const handleSkip = async () => {
//     await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//     router.replace('/(auth)/login');
//   };

//   const handleComplete = async () => {
//     await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//     router.replace('/(auth)/login');
//   };

//   const onScroll = (event: any) => {
//     const index = Math.round(event.nativeEvent.contentOffset.x / width);
//     setCurrentIndex(index);
//   };

//   const renderItem = ({ item, index }: { item: any; index: number }) => {
//     const isLast = index === ONBOARDING_DATA.length - 1;

//     return (
//       <View style={styles.slide}>
//         <ImageBackground
//           source={item.backgroundImage}
//           style={styles.backgroundImage}
//           resizeMode="stretch"
//         />

//         <View style={styles.overlay}>
//           <View style={styles.spacer} />

//           <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
//             <OnboardingCard
//               title={item.title}
//               description={item.description}
//               currentIndex={index}
//               totalScreens={ONBOARDING_DATA.length}
//             />

//             {!isLast && (
//               <OnboardingButton
//                 title="Continue"
//                 onPress={handleNext}
//                 style={styles.button}
//                 height={64}
//               />
//             )}

//             {isLast && (
//               <OnboardingButton
//                 title="Get Started"
//                 onPress={handleComplete}
//                 style={styles.button}
//                 height={64}
//               />
//             )}
//           </SafeAreaView>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Skip button */}
//       <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
//         <Text style={styles.skipText}>Skip</Text>
//       </TouchableOpacity>

//       <FlatList
//         ref={flatListRef}
//         data={ONBOARDING_DATA}
//         renderItem={renderItem}
//         keyExtractor={(_, index) => index.toString()}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={onScroll}
//         scrollEventThrottle={16}
//         bounces={false}
//       />
//     </View>
//   );
// }

// // Add Text import
// import { Text } from 'react-native';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E8DDD0',
//   },
//   slide: {
//     width: width,
//     flex: 1,
//   },
//   backgroundImage: {
//     position: 'absolute',
//     width: width,
//     height: height - 400,
//     top: 0,
//   },
//   overlay: {
//     flex: 1,
//   },
//   spacer: {
//     flex: 1,
//   },
//   bottomContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   button: {
//     marginVertical: 24,
//   },
//   skipButton: {
//     position: 'absolute',
//     top: 60,
//     right: 20,
//     zIndex: 10,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: 'rgba(0,0,0,0.1)',
//     borderRadius: 20,
//   },
//   skipText: {
//     color: '#361A0D',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });

// app/(onboarding)/index.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  ImageBackground,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingButton from '@/components/buttons/OnboardingButton';
import OnboardingCard from '@/components/onboarding/OnboardingCard';
import { ONBOARDING_DATA } from '@/constants/onboarding';

const { width, height } = Dimensions.get('window');

// Calculate background height based on screen ratio
const getBackgroundHeight = () => {
  const screenRatio = height / width;
  // For taller screens (like iPhone 14 Pro Max), use slightly less height
  if (screenRatio > 2.0) {
    return height - 350;
  }
  // For standard screens
  return height - 400;
};

export default function OnboardingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(auth)/login');
  };

  const handleComplete = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(auth)/login');
  };

  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isLast = index === ONBOARDING_DATA.length - 1;
    const backgroundHeight = getBackgroundHeight();

    return (
      <View style={styles.slide}>
        {/* Background Image with improved props */}
        <ImageBackground
          source={item.backgroundImage}
          style={[styles.backgroundImage, { height: backgroundHeight }]}
          resizeMode="cover" // Changed from "stretch" to "cover" for better quality
          fadeDuration={0} // Prevents fade-in flicker
        >
          {/* Optional: Add a subtle gradient overlay for better text readability */}
          <View style={styles.imageOverlay} />
        </ImageBackground>

        <View style={styles.overlay}>
          <View style={styles.spacer} />

          <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
            <OnboardingCard
              title={item.title}
              description={item.description}
              currentIndex={index}
              totalScreens={ONBOARDING_DATA.length}
            />

            {!isLast && (
              <OnboardingButton
                title="Continue"
                onPress={handleNext}
                style={styles.button}
                height={64}
              />
            )}

            {isLast && (
              <OnboardingButton
                title="Get Started"
                onPress={handleComplete}
                style={styles.button}
                height={64}
              />
            )}
          </SafeAreaView>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Skip button - improved positioning */}
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
        removeClippedSubviews={Platform.OS === 'android'} // Better performance on Android
        maxToRenderPerBatch={3}
        windowSize={3}
      />
    </View>
  );
}

// Add Text import
import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8DDD0',
  },
  slide: {
    width: width,
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    top: 0,
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)', // Very subtle dark overlay for better text contrast
  },
  overlay: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    marginVertical: 24,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  skipText: {
    // color: '#361A0D',
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '500',
  },
});
