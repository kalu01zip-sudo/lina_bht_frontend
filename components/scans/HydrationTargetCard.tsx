// components/scans/HydrationTargetCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { FlameIcon } from '@/components/icons';

export interface HydrationTargetCardProps {
  goal: string;
  description: string;
  title?: string;
  iconSize?: number;
  iconColor?: string;
  targetText?: string;
  style?: object;
}

export const HydrationTargetCard: React.FC<HydrationTargetCardProps> = ({
  goal,
  description,
  title = 'Hydration Target',
  iconSize = 20,
  iconColor = '#A68A61',
  targetText,
  style,
}) => {
  return (
    <View
      className="mt-6 px-[12px] py-[12px]"
      style={[
        {
          backgroundColor: '#9778571A',
          borderWidth: 1,
          borderColor: '#97785733',
          borderRadius: 16,
        },
        style,
      ]}>
      {/* Header Row */}
      <View className="mb-2 flex-row items-center gap-2">
        <FlameIcon
          size={iconSize}
          color={iconColor}
          style={{
            marginBottom: 3,
          }}
        />
        <Text className="font-OutfitBold text-[13px] text-[#7A5D3E]">{title}</Text>
      </View>

      {/* Main Content */}
      <View>
        <Text
          className="font-OutfitBold text-[15px] text-[#1A1A1A]"
          style={{
            textShadowColor: '#FFFFFF99',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}>
          {targetText ? targetText : `Goal: ${goal} for peak skin clarity`}
        </Text>

        <Text
          className="mt-1 font-outfit text-[12px] leading-4 text-[#7A5D3E]"
          style={{
            textShadowColor: '#FFFFFF99',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}>
          {description}
        </Text>
      </View>
    </View>
  );
};
