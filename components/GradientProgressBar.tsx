// components/ui/GradientProgressBar.tsx
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: string;
  gradientColors?: readonly [string, string, ...string[]];
  gradientLocations?: readonly [number, number, ...number[]];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  borderRadius?: number;
  style?: StyleProp<ViewStyle>; // Style for the parent container
  containerClassName?: string; // Optional className for Tailwind
}

export const GradientProgressBar: React.FC<GradientProgressBarProps> = ({
  progress,
  height = 6,
  backgroundColor = '#2A21180D',
  gradientColors = ['#977857', '#B89474', '#7A5D3E'],
  gradientLocations = [0.25, 0.6036, 0.9571], // 25%, 60.36%, 95.71%
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 }, // Changed to 1,1 for 135deg effect
  borderRadius = 100,
  style,
  containerClassName = '',
}) => {
  return (
    <View
      className={containerClassName}
      style={[
        {
          height,
          backgroundColor,
          borderRadius,
          overflow: 'hidden',
          flex: 1,
        },
        style,
      ]}>
      {progress > 0 && (
        <LinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          start={gradientStart}
          end={gradientEnd}
          style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius,
          }}
        />
      )}
    </View>
  );
};
