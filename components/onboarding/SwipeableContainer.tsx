// // components/onboarding/SwipeableContainer.tsx
// import React from 'react';
// import { View, Dimensions } from 'react-native';
// import { GestureDetector, Gesture } from 'react-native-gesture-handler';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   runOnJS,
//   withTiming,
// } from 'react-native-reanimated';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

// interface SwipeableContainerProps {
//   children: React.ReactNode;
//   onSwipeLeft?: () => void;
//   onSwipeRight?: () => void;
//   canSwipeLeft?: boolean;
//   canSwipeRight?: boolean;
// }

// export default function SwipeableContainer({
//   children,
//   onSwipeLeft,
//   onSwipeRight,
//   canSwipeLeft = true,
//   canSwipeRight = true,
// }: SwipeableContainerProps) {
//   const translateX = useSharedValue(0);
//   const isSwiping = useSharedValue(false);

//   const panGesture = Gesture.Pan()
//     .onStart(() => {
//       isSwiping.value = true;
//     })
//     .onUpdate((event) => {
//       // Only allow left or right swipes based on props
//       if (event.translationX < 0 && !canSwipeLeft) return;
//       if (event.translationX > 0 && !canSwipeRight) return;

//       translateX.value = event.translationX;
//     })
//     .onEnd((event) => {
//       const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD && canSwipeLeft;
//       const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD && canSwipeRight;

//       if (shouldSwipeLeft && onSwipeLeft) {
//         // Animate out and call navigation
//         translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, () => {
//           runOnJS(onSwipeLeft)();
//           translateX.value = 0;
//         });
//       } else if (shouldSwipeRight && onSwipeRight) {
//         // Animate out and call navigation
//         translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
//           runOnJS(onSwipeRight)();
//           translateX.value = 0;
//         });
//       } else {
//         // Reset position with spring animation
//         translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
//       }

//       isSwiping.value = false;
//     });

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: translateX.value }],
//   }));

//   return (
//     <GestureDetector gesture={panGesture}>
//       <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>
//     </GestureDetector>
//   );
// }

// components/onboarding/SwipeableContainer.tsx
import React from 'react';
import { Dimensions, PanResponder, Animated } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SwipeableContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  canSwipeLeft?: boolean;
  canSwipeRight?: boolean;
}

export const SwipeableContainer: React.FC<SwipeableContainerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  canSwipeLeft = true,
  canSwipeRight = true,
}) => {
  const pan = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0 && !canSwipeLeft) return;
      if (gestureState.dx > 0 && !canSwipeRight) return;
      pan.setValue({ x: gestureState.dx, y: 0 });
    },
    onPanResponderRelease: (_, gestureState) => {
      const swipeThreshold = SCREEN_WIDTH * 0.3;

      if (gestureState.dx < -swipeThreshold && canSwipeLeft) {
        Animated.timing(pan, {
          toValue: { x: -SCREEN_WIDTH, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onSwipeLeft?.();
          pan.setValue({ x: 0, y: 0 });
        });
      } else if (gestureState.dx > swipeThreshold && canSwipeRight) {
        Animated.timing(pan, {
          toValue: { x: SCREEN_WIDTH, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onSwipeRight?.();
          pan.setValue({ x: 0, y: 0 });
        });
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX: pan.x }],
      }}
      {...panResponder.panHandlers}>
      {children}
    </Animated.View>
  );
};
