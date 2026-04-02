// // components/buttons/ToggleSwitch.tsx
// import React from 'react';
// import { TouchableOpacity, View } from 'react-native';
// import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

// interface ToggleSwitchProps {
//   value: boolean;
//   onValueChange: (value: boolean) => void;
//   activeColor?: string;
//   inactiveColor?: string;
//   size?: { width: number; height: number };
//   circleSize?: number;
// }

// export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
//   value,
//   onValueChange,
//   activeColor = '#7A8B6A',
//   inactiveColor = '#2A211833',
//   size = { width: 48, height: 28 },
//   circleSize = 20,
// }) => {
//   const translateX = useSharedValue(value ? size.width - circleSize - 4 : 4);

//   const handlePress = () => {
//     const newValue = !value;
//     translateX.value = withSpring(newValue ? size.width - circleSize - 4 : 4);
//     onValueChange(newValue);
//   };

//   const circleStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: translateX.value }],
//   }));

//   return (
//     <TouchableOpacity
//       onPress={handlePress}
//       activeOpacity={0.8}
//       style={{
//         width: size.width,
//         height: size.height,
//         borderRadius: size.height / 2,
//         backgroundColor: value ? activeColor : inactiveColor,
//         justifyContent: 'center',
//         paddingHorizontal: 4,
//       }}>
//       <Animated.View
//         style={[
//           {
//             width: circleSize,
//             height: circleSize,
//             borderRadius: circleSize / 2,
//             backgroundColor: 'white',
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 4,
//             elevation: 2,
//           },
//           circleStyle,
//         ]}
//       />
//     </TouchableOpacity>
//   );
// };

// components/buttons/ToggleSwitch.tsx
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  size?: { width: number; height: number };
  circleSize?: number;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  activeColor = '#7A8B6A',
  inactiveColor = '#2A211833',
  size = { width: 48, height: 28 },
  circleSize = 20,
}) => {
  const translateX = useSharedValue(value ? size.width - circleSize - 4 : 4);

  // Update the position when value prop changes from parent
  useEffect(() => {
    translateX.value = withSpring(value ? size.width - circleSize - 4 : 4);
  }, [value, size.width, circleSize, translateX]);

  const handlePress = () => {
    const newValue = !value;
    onValueChange(newValue);
  };

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={{
        width: size.width,
        height: size.height,
        borderRadius: size.height / 2,
        backgroundColor: value ? activeColor : inactiveColor,
        justifyContent: 'center',
        paddingHorizontal: 4,
      }}>
      <Animated.View
        style={[
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          },
          circleStyle,
        ]}
      />
    </TouchableOpacity>
  );
};
