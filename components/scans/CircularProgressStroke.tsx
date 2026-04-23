// components/scans/faceScan/CircularProgressStroke.tsx
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CircularProgressStrokeProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  trackColor?: string;
  showPercentage?: boolean;
  gradientColors?: string[];
}

const CircularProgressStroke: React.FC<CircularProgressStrokeProps> = ({
  progress,
  size = 140,
  strokeWidth = 10,
  progressColor = '#60A5FA',
  trackColor = '#E8DDD0',
  showPercentage = true,
  gradientColors,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressValue = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (circumference * progressValue) / 100;

  // Default gradient colors if not provided
  const defaultGradients = ['#60A5FA', '#3B82F6'];
  const colors = gradientColors || defaultGradients;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          {/* Progress stroke gradient */}
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors[0]} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors[1]} stopOpacity="1" />
          </LinearGradient>

          {/* White border lighting effect on the stroke - Top/Left edge */}
          <LinearGradient id="strokeWhiteLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <Stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <Stop offset="30%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </LinearGradient>

          {/* White border lighting effect on the stroke - Bottom/Right edge */}
          <LinearGradient id="strokeWhiteLightBottom" x1="100%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <Stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* ========== BACKGROUND TRACK ========== */}
        {/* Base track stroke */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.5}
        />

        {/* White border lighting effect on track - Top/Left */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#strokeWhiteLight)"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.7}
        />

        {/* White border lighting effect on track - Bottom/Right subtle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#strokeWhiteLightBottom)"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.4}
        />

        {/* ========== PROGRESS STROKE ========== */}
        {/* Base progress stroke with gradient */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        {/* White border lighting effect on progress - Top/Left */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#strokeWhiteLight)"
          strokeWidth={strokeWidth - 1.5}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          opacity={0.8}
        />

        {/* White border lighting effect on progress - Bottom/Right subtle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#strokeWhiteLightBottom)"
          strokeWidth={strokeWidth - 1.5}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          opacity={0.4}
        />
      </Svg>

      {/* Percentage text */}
      {showPercentage && (
        <View
          style={{
            position: 'absolute',
            top: size * 0.32,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <Text
            className="font-outfitBold text-[28px]"
            style={{
              color: '#2E2117',
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            {progressValue}%
          </Text>
          <Text
            className="font-outfitMedium text-[12px]"
            style={{
              color: '#2E211799',
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            Hydration
          </Text>
        </View>
      )}
    </View>
  );
};

export default CircularProgressStroke;
