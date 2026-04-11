// components/FloatingAIAssistant.tsx
import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Image, Dimensions, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FloatingAIAssistantProps {
  bottomOffset?: number;
  rightOffset?: number;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  bottomOffset = 100,
  rightOffset = 20,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Responsive sizing based on screen width
  const getButtonSize = () => {
    const baseWidth = 50;
    const baseHeight = 58;
    const screenWidth = Dimensions.get('window').width;

    // For smaller screens (under 380px), use 85% of base size
    if (screenWidth < 380) {
      return { width: baseWidth * 0.85, height: baseHeight * 0.85 };
    }
    // For medium screens (380-600px), use base size
    if (screenWidth < 600) {
      return { width: baseWidth, height: baseHeight };
    }
    // For larger screens, use 110% of base size
    return { width: baseWidth * 1.1, height: baseHeight * 1.1 };
  };

  const buttonSize = getButtonSize();

  // Pulse animation for attention
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePress = () => {
    router.push('/(flow)/ai-assistant');
  };

  // Calculate bottom position with safe area
  const bottomPosition = bottomOffset + insets.bottom;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: bottomPosition,
        right: rightOffset,
        transform: [{ scale: scaleAnim }],
        zIndex: 999,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
          },
          android: {
            elevation: 8,
          },
        }),
      }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{
          width: buttonSize.width,
          height: buttonSize.height,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.Image
          source={require('@/assets/images/ai_floating_logo.png')}
          style={{
            width: buttonSize.width,
            height: buttonSize.height,
            transform: [{ scale: pulseAnim }],
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
