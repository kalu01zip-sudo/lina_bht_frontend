// // components/buttons/RadioButton.tsx
// import React, { useEffect } from 'react';
// import { TouchableOpacity, View } from 'react-native';
// import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

// interface RadioButtonProps {
//   value: boolean;
//   onValueChange: (value: boolean) => void;
//   activeColor?: string;
//   inactiveColor?: string;
//   size?: number;
//   innerCircleSize?: number;
// }

// export const RadioButton: React.FC<RadioButtonProps> = ({
//   value,
//   onValueChange,
//   activeColor = '#7A5D3E',
//   inactiveColor = '#FFFFFF80',
//   size = 34,
//   innerCircleSize = 20,
// }) => {
//   const scale = useSharedValue(value ? 1 : 0);

//   // Update the scale when value prop changes
//   useEffect(() => {
//     scale.value = withSpring(value ? 1 : 0, {
//       damping: 15,
//       stiffness: 300,
//     });
//   }, [value, scale]);

//   const handlePress = () => {
//     onValueChange(!value);
//   };

//   const innerCircleStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   return (
//     <TouchableOpacity
//       onPress={handlePress}
//       activeOpacity={0.7}
//       style={{
//         width: size,
//         height: size,
//         borderRadius: size / 2,
//         borderWidth: 2,
//         borderColor: '#361A0D',
//         backgroundColor: inactiveColor,
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}>
//       <Animated.View
//         style={[
//           {
//             width: innerCircleSize,
//             height: innerCircleSize,
//             borderRadius: innerCircleSize / 2,
//             backgroundColor: activeColor,
//           },
//           innerCircleStyle,
//         ]}
//       />
//     </TouchableOpacity>
//   );
// };

// components/buttons/RadioButton.tsx

import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

interface RadioButtonProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  size?: number;
  innerCircleSize?: number;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  onValueChange,
  activeColor = '#7A5D3E',
  inactiveColor = '#FFFFFF80',
  size = 34,
  innerCircleSize = 20,
}) => {
  const scale = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 300,
    });
  }, [value]);

  const innerCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={10}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: '#361A0D',
        backgroundColor: inactiveColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Animated.View
        style={[
          {
            width: innerCircleSize,
            height: innerCircleSize,
            borderRadius: innerCircleSize / 2,
            backgroundColor: activeColor,
          },
          innerCircleStyle,
        ]}
      />
    </Pressable>
  );
};
