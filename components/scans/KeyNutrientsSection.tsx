// components/scans/KeyNutrientsSection.tsx
import React from 'react';
import { View, Text, Image, ScrollView, Dimensions, ImageSourcePropType } from 'react-native';
import { NutritionIcon } from '@/components/icons/NutritionIcon';

export interface Nutrient {
  id: string;
  name: string;
  description: string;
  imageUrl: string | number; // Can be URL string or require() number
}

interface KeyNutrientsSectionProps {
  nutrients: Nutrient[];
  title?: string;
  showIcon?: boolean;
  containerWidth?: number; // Optional: for custom width calculations
}

export const KeyNutrientsSection: React.FC<KeyNutrientsSectionProps> = ({
  nutrients,
  title = 'Key Nutrients for Your Skin',
  showIcon = true,
  containerWidth,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const paddingHorizontal = 32; // Adjust based on your container padding (px-container = 16px each side)
  const availableWidth = (containerWidth || screenWidth) - paddingHorizontal;
  const cardWidth = Math.min(availableWidth / 2.3, 155);

  // Helper to get image source (supports both URL strings and require() numbers)
  const getImageSource = (source: string | number): ImageSourcePropType | undefined => {
    if (typeof source === 'number') {
      return source;
    }
    if (typeof source === 'string') {
      // Check if it's a remote URL
      if (source.startsWith('http://') || source.startsWith('https://')) {
        return { uri: source } as ImageSourcePropType;
      }
      // For local assets passed as string paths
      return { uri: source } as ImageSourcePropType;
    }
    return undefined;
  };

  if (!nutrients || nutrients.length === 0) {
    return (
      <View className="mt-6">
        {/* Header */}
        <View className="flex-row items-center gap-3">
          {showIcon && <NutritionIcon size={32} />}
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
            No nutrients available
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row items-center gap-3">
        {showIcon && <NutritionIcon size={32} />}
        <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
          {title}
        </Text>
      </View>

      {/* Horizontal Scrollable Nutrients List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{
          paddingRight: 16,
          gap: 12,
        }}>
        {nutrients.map((nutrient) => {
          const imageSource = getImageSource(nutrient.imageUrl);

          return (
            <View
              key={nutrient.id}
              style={{
                width: cardWidth,
                alignItems: 'center',
                padding: 12,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: '#FFFFFF99',
                borderLeftWidth: 1,
                borderRightWidth: 1,
                backgroundColor: 'transparent',
              }}>
              {/* Nutrient Image */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 100,
                  overflow: 'hidden',
                  marginBottom: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#E8DDD0',
                }}>
                {imageSource ? (
                  <Image
                    source={imageSource}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 100,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={{ fontSize: 20, color: '#977857' }}>🍃</Text>
                )}
              </View>

              {/* Nutrient Name */}
              <Text
                className="text-center font-outfit text-[14px]"
                style={{
                  color: '#1A1A1A',
                  textShadowColor: '#FFFFFF',
                  textShadowOffset: { width: 1, height: 2 },
                  textShadowRadius: 2,
                  marginBottom: 4,
                }}>
                {nutrient.name}
              </Text>

              {/* Nutrient Description */}
              <Text
                className="text-center font-outfit text-[10px]"
                style={{
                  color: '#666666',
                  textShadowColor: '#FFFFFF',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                  lineHeight: 14,
                }}>
                {nutrient.description}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
