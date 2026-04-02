// components/buttons/CircularIconButton.tsx
import React from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type CircularIconButtonProps = {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  backgroundColor?: string;
  gradientColors?: readonly [string, string, ...string[]];
  withGradient?: boolean;
  withShadow?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const CircularIconButton: React.FC<CircularIconButtonProps> = ({
  icon,
  onPress,
  size = 40,
  backgroundColor = '#D9C9B9',
  gradientColors = ['#F0E6D8', '#F0E6D8', '#F0E6D8', '#F0E6D8'],
  withGradient = true,
  withShadow = true,
  disabled = false,
  style,
}) => {
  const buttonStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: '#FFFFFF99',
    borderLeftColor: '#FFFFFF99',
    borderBottomColor: '#FFFFFF62',
    borderRightColor: '#FFFFFF62',
    ...(withShadow && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    }),
  } as ViewStyle;

  const ButtonContent = (
    <View
      style={[
        buttonStyle,
        { backgroundColor: !withGradient ? backgroundColor : 'transparent' },
        style,
      ]}>
      {icon}
    </View>
  );

  if (!withGradient) {
    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7}>
          {ButtonContent}
        </TouchableOpacity>
      );
    }
    return ButtonContent;
  }

  const GradientButton = (
    <LinearGradient
      colors={gradientColors}
      locations={[0.03, 0.7, 1, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={buttonStyle}>
      {icon}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7}>
        {GradientButton}
      </TouchableOpacity>
    );
  }

  return GradientButton;
};
