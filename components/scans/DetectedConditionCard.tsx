// components/scans/DetectedConditionCard.tsx
import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import PillowBadge from '@/components/buttons/PillowBadge';
import { GradientProgressBar } from '@/components/GradientProgressBar';

export interface DetectedCondition {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  progressValue: number;
  progressColor?: string[];
  imageUri?: string;
  imageSource?: ImageSourcePropType;
  ImageUri?: string; // Added: for showing face area
  faceArea?: { x: number; y: number; width: number; height: number }; // Added: for highlighting specific area
}

interface DetectedConditionCardProps {
  condition: DetectedCondition;
  isLast?: boolean;
  showFaceImage?: boolean; // Added: toggle face image visibility
  onImagePress?: (condition: DetectedCondition) => void; // Added: handle image press
}

export const DetectedConditionCard: React.FC<DetectedConditionCardProps> = ({
  condition,
  isLast = false,
  showFaceImage = false,
  onImagePress,
}) => {
  // Get severity color for progress bar
  const getProgressColors = (): [string, string] => {
    if (condition.progressColor) return condition.progressColor as [string, string];

    switch (condition.severity) {
      case 'High':
        return ['#F87171', '#DC2626']; // Red
      case 'Medium':
        return ['#FBBF24', '#D97706']; // Yellow/Orange
      case 'Low':
        return ['#60A5FA', '#2563EB']; // Blue
      default:
        return ['#60A5FA', '#2563EB'];
    }
  };

  // Get severity badge style
  const getSeverityBadgeStyle = () => {
    switch (condition.severity) {
      case 'High':
        return { backgroundColor: '#FFFFFF', textColor: '#2E2117B2' };
      case 'Medium':
        return { backgroundColor: '#FFFFFF', textColor: '#2E2117B2' };
      case 'Low':
        return { backgroundColor: '#FFFFFF', textColor: '#2E2117B2' };
      default:
        return { backgroundColor: '#FFFFFF', textColor: '#2E2117B2' };
    }
  };

  const badgeStyle = getSeverityBadgeStyle();

  // Determine which image to show
  const imageToShow =
    showFaceImage && condition.ImageUri
      ? condition.ImageUri
      : condition.imageUri || condition.imageSource;

  return (
    <View
      className="w-full flex-row items-start gap-3 bg-[#E8DDD0] p-3"
      style={{
        borderWidth: 1,
        borderRadius: 24,
        borderColor: '#FFFFFF99',
        marginBottom: isLast ? 0 : 12,
      }}>
      {/* Left Side: Image/Thumbnail */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onImagePress?.(condition)}
        disabled={!onImagePress}
        className="h-[90px] w-[64px] overflow-hidden rounded-xl"
        style={{
          borderWidth: 1,
          borderColor: '#FFFFFF99',
        }}>
        {imageToShow ? (
          typeof imageToShow === 'string' ? (
            <Image
              source={{ uri: imageToShow }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={imageToShow}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          )
        ) : (
          <View className="h-full w-full items-center justify-center bg-[#D4C5B0]">
            <Text className="font-outfit text-[10px] text-[#2E211799]">No image</Text>
          </View>
        )}

        {/* Optional: Show area highlight indicator */}
        {condition.faceArea && (
          <View className="absolute bottom-1 right-1 rounded-full bg-[#361A0DCC] px-1.5 py-0.5">
            <Text className="font-outfit text-[8px] text-white">Area</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Right Side: Content Container */}
      <View className="flex-1" style={{ minHeight: 90, justifyContent: 'space-between' }}>
        <View>
          {/* Title and Badge Row */}
          <View className="w-full flex-row items-center justify-between">
            <Text
              className="font-outfitMedium text-[13px]"
              style={{
                color: '#2E2117',
                textShadowColor: '#FFFFFF',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}>
              {condition.title}
            </Text>
            <PillowBadge
              title={condition.severity}
              textStyle={{ color: badgeStyle.textColor, fontSize: 10 }}
              style={{
                backgroundColor: badgeStyle.backgroundColor,
                paddingVertical: 2,
                paddingHorizontal: 10,
              }}
            />
          </View>

          {/* Description Text */}
          <Text
            className="mt-2 font-outfit text-[12px] leading-4"
            style={{
              color: '#2E211799',
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            {condition.description}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={{ height: 10, width: '100%', marginTop: 12 }}>
          <GradientProgressBar
            height={10}
            progress={condition.progressValue}
            gradientColors={getProgressColors()}
            backgroundColor="#ddd9d6"
            style={{
              height: 10,
              borderRadius: 10,
              overflow: 'hidden',
              borderWidth: 1,
              borderTopColor: '#c9beb177',
              borderLeftColor: '#c9beb177',
              borderBottomColor: '#FFFFFF99',
              borderRightColor: '#FFFFFF99',
            }}
          />
        </View>
      </View>
    </View>
  );
};

// Add TouchableOpacity import
import { TouchableOpacity } from 'react-native';
