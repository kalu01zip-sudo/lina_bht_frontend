// app/(onboarding)/index.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingButton from '@/components/buttons/OnboardingButton';
import OnboardingCard from '@/components/onboarding/OnboardingCard';
import { ONBOARDING_DATA, GRADIENT_CONFIG } from '@/constants/onboarding';

const { width, height } = Dimensions.get('window');

// Calculate background height based on screen ratio
const getBackgroundHeight = () => {
  const screenRatio = height / width;
  if (screenRatio > 2.0) {
    return height - 350;
  }
  return height - 400;
};

export default function OnboardingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

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

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    useNativeDriver: false,
  });

  const onMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isLast = index === ONBOARDING_DATA.length - 1;
    const backgroundHeight = getBackgroundHeight();

    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    // Background animations with cross-fade
    const backgroundOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const backgroundScale = scrollX.interpolate({
      inputRange,
      outputRange: [1.3, 1, 1.3],
      extrapolate: 'clamp',
    });

    // Content animations
    const contentScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const contentTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, 50],
      extrapolate: 'clamp',
    });

    const contentOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [1, 1, 1],
      extrapolate: 'clamp',
    });

    // 3D rotation - reduced for smoother effect
    const rotateY = scrollX.interpolate({
      inputRange,
      outputRange: ['-35deg', '0deg', '35deg'],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.slide}>
        {/* Background Image Container with clipping */}
        <View style={[styles.backgroundContainer, { height: backgroundHeight }]}>
          <Animated.Image
            source={item.backgroundImage}
            style={[
              styles.backgroundImage,
              {
                opacity: backgroundOpacity,
                transform: [{ scale: backgroundScale }],
              },
            ]}
            resizeMode="cover"
          />
        </View>

        {/* Gradient Overlay */}
        <LinearGradient
          colors={GRADIENT_CONFIG.colors}
          locations={GRADIENT_CONFIG.locations}
          start={GRADIENT_CONFIG.start}
          end={GRADIENT_CONFIG.end}
          style={styles.gradientOverlay}
        />

        <View style={styles.overlay}>
          <View style={styles.spacer} />

          <Animated.View
            style={[
              styles.animatedContent,
              {
                opacity: contentOpacity,
                transform: [
                  { scale: contentScale },
                  { translateY: contentTranslateY },
                  { rotateY: rotateY },
                ],
              },
            ]}>
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
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={3}
        windowSize={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8DDD0',
  },
  slide: {
    width: width,
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    width: width,
    top: 0,
    overflow: 'hidden', // This prevents overlapping
  },
  backgroundImage: {
    width: width,
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.6,
  },
  overlay: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  animatedContent: {
    flex: 1,
    justifyContent: 'flex-end',
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
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '500',
  },
});
