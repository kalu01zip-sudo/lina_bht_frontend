
// // components/onboarding/SwipeableContainer.tsx
// import React from 'react';
// import { Dimensions, PanResponder, Animated } from 'react-native';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// interface SwipeableContainerProps {
//   children: React.ReactNode;
//   onSwipeLeft?: () => void;
//   onSwipeRight?: () => void;
//   canSwipeLeft?: boolean;
//   canSwipeRight?: boolean;
// }

// export const SwipeableContainer: React.FC<SwipeableContainerProps> = ({
//   children,
//   onSwipeLeft,
//   onSwipeRight,
//   canSwipeLeft = true,
//   canSwipeRight = true,
// }) => {
//   const pan = new Animated.ValueXY();

//   const panResponder = PanResponder.create({
//     onMoveShouldSetPanResponder: (_, gestureState) => {
//       return Math.abs(gestureState.dx) > 20;
//     },
//     onPanResponderMove: (_, gestureState) => {
//       if (gestureState.dx < 0 && !canSwipeLeft) return;
//       if (gestureState.dx > 0 && !canSwipeRight) return;
//       pan.setValue({ x: gestureState.dx, y: 0 });
//     },
//     onPanResponderRelease: (_, gestureState) => {
//       const swipeThreshold = SCREEN_WIDTH * 0.3;

//       if (gestureState.dx < -swipeThreshold && canSwipeLeft) {
//         Animated.timing(pan, {
//           toValue: { x: -SCREEN_WIDTH, y: 0 },
//           duration: 200,
//           useNativeDriver: false,
//         }).start(() => {
//           onSwipeLeft?.();
//           pan.setValue({ x: 0, y: 0 });
//         });
//       } else if (gestureState.dx > swipeThreshold && canSwipeRight) {
//         Animated.timing(pan, {
//           toValue: { x: SCREEN_WIDTH, y: 0 },
//           duration: 200,
//           useNativeDriver: false,
//         }).start(() => {
//           onSwipeRight?.();
//           pan.setValue({ x: 0, y: 0 });
//         });
//       } else {
//         Animated.spring(pan, {
//           toValue: { x: 0, y: 0 },
//           friction: 5,
//           useNativeDriver: false,
//         }).start();
//       }
//     },
//   });

//   return (
//     <Animated.View
//       style={{
//         flex: 1,
//         transform: [{ translateX: pan.x }],
//       }}
//       {...panResponder.panHandlers}>
//       {children}
//     </Animated.View>
//   );
// };



// components/onboarding/SwipeableContainer.tsx
import React, { useRef } from 'react';
import { Dimensions, Animated, PanResponder } from 'react-native';

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
  const pan = useRef(new Animated.ValueXY()).current;
  const isSwiping = useRef(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderGrant: () => {
      isSwiping.current = true;
    },
    onPanResponderMove: (_, gestureState) => {
      if (!isSwiping.current) return;
      
      // Only allow swipe in allowed directions
      if (gestureState.dx < 0 && !canSwipeLeft) return;
      if (gestureState.dx > 0 && !canSwipeRight) return;
      
      pan.setValue({ x: gestureState.dx, y: 0 });
    },
    onPanResponderRelease: (_, gestureState) => {
      isSwiping.current = false;
      const swipeThreshold = SCREEN_WIDTH * 0.25;
      
      if (gestureState.dx < -swipeThreshold && canSwipeLeft) {
        // Swipe left - go to next
        Animated.timing(pan, {
          toValue: { x: -SCREEN_WIDTH, y: 0 },
          duration: 250,
          useNativeDriver: false,
        }).start(() => {
          onSwipeLeft?.();
          pan.setValue({ x: 0, y: 0 });
        });
      } 
      else if (gestureState.dx > swipeThreshold && canSwipeRight) {
        // Swipe right - go back
        Animated.timing(pan, {
          toValue: { x: SCREEN_WIDTH, y: 0 },
          duration: 250,
          useNativeDriver: false,
        }).start(() => {
          onSwipeRight?.();
          pan.setValue({ x: 0, y: 0 });
        });
      } 
      else {
        // Reset position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          tension: 40,
          useNativeDriver: false,
        }).start();
      }
    },
    onPanResponderTerminate: () => {
      isSwiping.current = false;
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        friction: 5,
        tension: 40,
        useNativeDriver: false,
      }).start();
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