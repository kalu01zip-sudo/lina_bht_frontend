// components/scans/faceScan/SkinAnalysisCards.tsx
import React from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { GradientProgressBar } from '@/components/GradientProgressBar';
import CircularProgressStroke from '../CircularProgressStroke';

interface SkinAnalysisCardsProps {
  imageUri?: string;
  hydrationLevel: number;
  rednessScore: number;
  rednessProgress: number;
  rednessLabel?: string;
}

export const SkinAnalysisCards: React.FC<SkinAnalysisCardsProps> = ({
  imageUri,
  hydrationLevel,
  rednessScore,
  rednessProgress,
  rednessLabel = 'Visible Redness (Cheeks)',
}) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;
  const chartSize = isSmallScreen ? 140 : 160;

  if (isSmallScreen) {
    // Stack vertically on small screens
    return (
      <View className="gap-5">
        {/* Left Card - Face Image & Redness */}
        <View
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#FFFFFF99',
            borderRadius: 24,
            padding: 12,
          }}>
          {/* Face Image */}
          <View className="w-full overflow-hidden rounded-xl">
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 200 }}
                resizeMode="cover"
              />
            ) : (
              <View className="h-[200px] w-full items-center justify-center rounded-xl bg-[#F0E6D8]">
                <Text className="font-outfit text-[12px] text-[#2E211799]">Face Image</Text>
              </View>
            )}
          </View>

          {/* Redness Info */}
          <Text
            className="mt-3 font-OutfitBold text-[12px] text-[#2E211799]"
            style={{
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}>
            {rednessLabel}
          </Text>

          <Text
            className="mt-3 font-OutfitBold text-[12px] text-[#2E2117]"
            style={{
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}>
            Score :{' '}
            <Text
              className="font-outfit text-[12px]"
              style={{
                textShadowColor: '#FFFFFF',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}>
              {rednessScore}/100
            </Text>
          </Text>

          <GradientProgressBar
            style={{
              marginTop: 6,
              height: 10,
              borderWidth: 1,
              borderTopColor: '#c9beb177',
              borderLeftColor: '#c9beb177',
              borderBottomColor: '#FFFFFF99',
              borderRightColor: '#FFFFFF99',
            }}
            progress={rednessProgress}
            gradientColors={['#F87171', '#DC2626']}
            backgroundColor="#ddd9d6"
          />
        </View>

        {/* Right Card - Hydration Chart */}
        <View
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#FFFFFF99',
            borderRadius: 24,
            padding: 16,
            alignItems: 'center',
          }}>
          <Text
            className="font-outfitBold w-full text-start text-[24px] text-[#2E2117]"
            style={{
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            {hydrationLevel}%
          </Text>
          <Text
            className="mb-4 mt-1 w-full text-start font-outfitMedium text-[14px] text-[#2E211799] "
            style={{
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            Hydration Level
          </Text>
          <CircularProgressStroke
            progress={hydrationLevel}
            size={chartSize}
            strokeWidth={22}
            progressColor="#60A5FA"
            trackColor="#E8DDD0"
            gradientColors={['#CAA789A3', '#CAA789A3']}
            showPercentage={true}
          />
        </View>
      </View>
    );
  }
};
