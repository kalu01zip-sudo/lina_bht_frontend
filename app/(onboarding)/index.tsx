// import { useEffect } from 'react';
// import { useRouter } from 'expo-router';

// export default function OnboardingIndex() {
//   const router = useRouter();

//   useEffect(() => {
//     router.replace('/(onboarding)/screen1');
//   }, []);

//   return null;
// }

// app/(onboarding)/index.tsx (New main onboarding carousel)
import React, { useState, useRef } from 'react';
import {
  View,
  ImageBackground,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingButton from '@/components/buttons/OnboardingButton';
import OnboardingCard from '@/components/onboarding/OnboardingCard';
import { ONBOARDING_DATA } from '@/constants/onboarding';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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

    return (
      <View style={styles.slide}>
        <ImageBackground
          source={item.backgroundImage}
          style={styles.backgroundImage}
          resizeMode="stretch"
        />

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
      {/* Skip button */}
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
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
    height: height - 400,
    top: 0,
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
  },
  skipText: {
    color: '#361A0D',
    fontSize: 14,
    fontWeight: '500',
  },
});
