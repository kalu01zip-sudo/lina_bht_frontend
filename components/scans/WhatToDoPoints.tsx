// components/scans/WhatToDoPoints.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SignInCuttedCircleIcon } from '../icons';

export interface WhatToDoPoint {
  id: string;
  title: string;
  description?: string;
}

interface WhatToDoPointsProps {
  title?: string;
  points: WhatToDoPoint[];
  showIcon?: boolean;
}

export const WhatToDoPoints: React.FC<WhatToDoPointsProps> = ({
  title = 'Points of Attention — What to Stop',
  points,
  showIcon = true,
}) => {
  if (!points || points.length === 0) {
    return null;
  }

  const iconSize = 14;
  const iconColor = '#7A8B6A';
  const shadowColor = '#FFFFFF';
  const shadowOffset = 1.6; // Offset for shadow effect

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row items-center gap-3">
        {showIcon && (
          <View style={{ position: 'relative', width: 24, height: 24 }}>
            {/* Main icon */}
            <SignInCuttedCircleIcon size={24} color={iconColor} />
          </View>
        )}
        <Text className="text-start font-OutfitBold text-[14px] text-[#2A2118]">{title}</Text>
      </View>

      {/* Points Container */}
      <View
        className="mt-3 gap-3 bg-transparent p-3"
        style={{
          borderWidth: 1,
          borderColor: '#FFFFFF99',
          borderRadius: 24,
          borderTopWidth: 2,
          borderBottomWidth: 2,
        }}>
        {points.map((point) => (
          <View key={point.id} className="flex-row items-start gap-3">
            {/* Icon with white shadow below */}
            <View style={{ position: 'relative', width: iconSize, height: iconSize, marginTop: 3 }}>
              {/* Shadow icon (white, offset below) */}
              <SignInCuttedCircleIcon
                size={iconSize}
                color={shadowColor}
                style={{
                  position: 'absolute',
                  top: shadowOffset,
                  left: 0,
                  opacity: 1,
                }}
              />
              {/* Main icon */}
              <SignInCuttedCircleIcon
                size={iconSize}
                color={iconColor}
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
            </View>

            {/* Point Content */}
            <View className="flex-1">
              <Text
                className="font-outfitMedium text-[14px]"
                style={{
                  color: '#2E2117',
                  textShadowColor: '#FFFFFF',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                {point.title}
              </Text>
              {point.description && (
                <Text
                  className="mt-1 font-outfit text-[12px]"
                  style={{
                    color: '#2E211799',
                    textShadowColor: '#FFFFFF',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}>
                  {point.description}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
