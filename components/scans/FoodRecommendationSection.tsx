// components/scans/FoodRecommendationSection.tsx
import React from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { FoodRecommendationIcon } from '../icons/FoodRecommendationIcon';

export interface RecommendedFood {
  id: string;
  name: string;
  description: string;
  imageUrl: any; // Can be require() result or URL string
}

interface FoodRecommendationSectionProps {
  recommendedFoods: RecommendedFood[];
  title?: string;
  showIcon?: boolean;
  containerWidth?: number;
}

export const FoodRecommendationSection: React.FC<FoodRecommendationSectionProps> = ({
  recommendedFoods,
  title = 'Your Food Recommendations',
  showIcon = true,
  containerWidth,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const paddingHorizontal = 32;
  const availableWidth = (containerWidth || screenWidth) - paddingHorizontal;
  const circleSize = Math.min(availableWidth / 2.5, 140); // Size of the circle card

  if (!recommendedFoods || recommendedFoods.length === 0) {
    return (
      <View className="mt-6">
        <View className="flex-row items-center gap-3">
          {showIcon && <FoodRecommendationIcon size={32} />}
          <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
            {title}
          </Text>
        </View>
        <View
          className="mt-3 p-4"
          style={{
            borderRadius: 24,
            borderWidth: 1,
            borderColor: '#FFFFFF99',
            alignItems: 'center',
          }}>
          <Text className="text-center font-outfit text-[14px]" style={{ color: '#977857' }}>
            No food recommendations available
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row items-center gap-3">
        {showIcon && <FoodRecommendationIcon size={32} />}
        <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
          {title}
        </Text>
      </View>

      {/* Horizontal Scrollable Food List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{
          paddingRight: 16,
          gap: 12,
        }}>
        {recommendedFoods.map((food) => (
          <View
            key={food.id}
            style={{
              width: circleSize,
              height: circleSize, // Same as width to make it a perfect circle
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              borderRadius: circleSize / 2, // Half of width/height makes it perfectly round
              borderWidth: 2,
              borderColor: '#FFFFFF99',
              borderLeftWidth: 1,
              borderRightWidth: 1,
              backgroundColor: 'transparent',
              overflow: 'hidden',
            }}>
            {/* Food Image - Fully Rounded */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24, // Perfect circle
                overflow: 'hidden',
                marginBottom: 8,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#E8DDD0',
              }}>
              <Image
                source={food.imageUrl}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
              />
            </View>

            {/* Food Name */}
            <Text
              className="text-center font-outfit text-[12px]"
              style={{
                color: '#1A1A1A',
                textShadowColor: '#FFFFFF',
                textShadowOffset: { width: 1, height: 2 },
                textShadowRadius: 2,
                marginBottom: 2,
              }}>
              {food.name}
            </Text>

            {/* Food Description */}
            <Text
              className="text-center font-outfit text-[9px]"
              style={{
                color: '#666666',
                textShadowColor: '#FFFFFF',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
                lineHeight: 11,
              }}>
              {food.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
