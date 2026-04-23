// components/scans/ProductAttentionPoints.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { CrossInCircleIcon } from '@/components/icons/CrossInCircleIcon';

export interface AttentionPoint {
  id: string;
  title: string;
  description?: string;
}

interface ProductAttentionPointsProps {
  title?: string;
  points: AttentionPoint[];
  showIcon?: boolean;
}

export const ProductAttentionPoints: React.FC<ProductAttentionPointsProps> = ({
  title = 'Points of Attention — What to Stop',
  points,
  showIcon = true,
}) => {
  if (!points || points.length === 0) {
    return null;
  }

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row items-center gap-3">
        {showIcon && <CrossInCircleIcon size={24} color="#DC2626" />}
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
        {points.map((point, index) => (
          <View key={point.id} className="flex-row items-start">
            {/* Dot */}
            <View
              style={{
                backgroundColor: '#F87171',
                width: 10,
                height: 10,
                borderRadius: 999,
                borderTopWidth: 0,
                borderWidth: 0.5,
                borderBottomWidth: 1.5,
                borderLeftColor: '#ffffff',
                borderRightColor: '#ffffff',
                borderBottomColor: '#FFFFFF',
                marginRight: 12,
                marginTop: 6,
              }}
            />

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
