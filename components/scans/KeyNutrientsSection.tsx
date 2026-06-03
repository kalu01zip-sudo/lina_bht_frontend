// components/scans/KeyNutrientsSection.tsx
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Dimensions, ImageSourcePropType } from 'react-native';
import { NutritionIcon } from '@/components/icons/NutritionIcon';

export interface Nutrient {
  id: string;
  name: string;
  description: string;
  imageUrl: ImageSourcePropType;
}

interface KeyNutrientsSectionProps {
  nutrients: Nutrient[];
  title?: string;
  showIcon?: boolean;
  containerWidth?: number;
}

// ── Single nutrient image with fallback emoji ─────────────────────────────────
const NutrientImage = ({ source }: { source: ImageSourcePropType }) => {
  const [failed, setFailed] = useState(false);

  // If source is a { uri } object and uri is empty/null — treat as failed
  const isEmpty =
    typeof source === 'object' &&
    source !== null &&
    !Array.isArray(source) &&
    'uri' in source &&
    !source.uri;

  if (failed || isEmpty) {
    return <Text style={{ fontSize: 22 }}>🍃</Text>;
  }

  return (
    <Image
      source={source}
      style={{ width: '100%', height: '100%', borderRadius: 100 }}
      resizeMode="contain"
      onError={() => setFailed(true)}
    />
  );
};

export const KeyNutrientsSection: React.FC<KeyNutrientsSectionProps> = ({
  nutrients,
  title = 'Key Nutrients for Your Skin',
  showIcon = true,
  containerWidth,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const paddingHorizontal = 32;
  const availableWidth = (containerWidth || screenWidth) - paddingHorizontal;
  const cardWidth = Math.min(availableWidth / 2.3, 155);

  if (!nutrients || nutrients.length === 0) {
    return (
      <View className="mt-6">
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
      <View className="flex-row items-center gap-3">
        {showIcon && <NutritionIcon size={32} />}
        <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
          {title}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{ paddingRight: 16, gap: 12 }}>
        {nutrients.map((nutrient) => (
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
            {/* Nutrient Image with fallback */}
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
              <NutrientImage source={nutrient.imageUrl} />
            </View>

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
        ))}
      </ScrollView>
    </View>
  );
};
