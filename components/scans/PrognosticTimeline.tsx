// components/scans/PrognosticTimeline.tsx
import React from 'react';
import { View, Text, ImageBackground, ImageSourcePropType, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PillowBadge from '@/components/buttons/PillowBadge';
import { CurvedArrowTopRightIcon } from '@/components/icons';

export interface TimelineDay {
  id: string;
  title: string;
  subtitle: string;
  metrics?: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
  imageUri?: string | number; // Allow both string and number (require)
  isFuture?: boolean;
  improvementPercentage?: number;
}

export interface PrognosticTimelineProps {
  days: TimelineDay[];
  duration?: string;
  backgroundImage?: ImageSourcePropType;
  title?: string;
  showIcon?: boolean;
  onDayPress?: (day: TimelineDay) => void;
}

const DEFAULT_BACKGROUND = require('@/assets/images/prognostic_timeline_bg_face.jpg');

export const PrognosticTimeline: React.FC<PrognosticTimelineProps> = ({
  days,
  duration = '14 Days',
  backgroundImage = DEFAULT_BACKGROUND,
  title = 'Prognostic Timeline',
  showIcon = true,
  onDayPress,
}) => {
  if (!days || days.length === 0) {
    return null;
  }

  // Helper to get image source correctly
  const getImageSource = (imageUri?: string | number): ImageSourcePropType | null => {
    if (!imageUri) return null;

    // If it's a number (require result), return as is
    if (typeof imageUri === 'number') {
      return imageUri;
    }

    // If it's a string URL
    if (typeof imageUri === 'string') {
      return { uri: imageUri };
    }

    return null;
  };

  // Helper to get gradient for future days
  const getFutureDayGradient = (improvementPercentage: number = 0) => {
    if (improvementPercentage >= 30) {
      return ['rgba(167, 243, 208, 0.4)', 'rgba(110, 231, 183, 0.2)', 'rgba(110, 231, 183, 0.05)'];
    }
    if (improvementPercentage >= 15) {
      return ['rgba(190, 242, 100, 0.35)', 'rgba(163, 230, 53, 0.15)', 'rgba(163, 230, 53, 0.05)'];
    }
    return ['rgba(251, 191, 36, 0.3)', 'rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.03)'];
  };

  // Helper to get glow color for future days
  const getGlowColor = (improvementPercentage: number = 0) => {
    if (improvementPercentage >= 30) return '#10B981';
    if (improvementPercentage >= 15) return '#84CC16';
    return '#F59E0B';
  };

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="w-full flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {showIcon && <CurvedArrowTopRightIcon size={24} color={'#977857'} />}
          <Text className="text-start font-outfitMedium text-[16px] text-[#2E2117]">{title}</Text>
        </View>
        <PillowBadge
          title={duration}
          style={{ backgroundColor: '#e9e3dc', paddingHorizontal: 12, paddingVertical: 2 }}
          textStyle={{ color: '#7A5D3E', fontSize: 12 }}
        />
      </View>

      {/* Timeline Container */}
      <ImageBackground
        source={backgroundImage}
        imageStyle={{ borderRadius: 24 }}
        className="mt-3 w-full"
        style={{
          minHeight: 244,
          borderWidth: 0.5,
          borderTopWidth: 3,
          borderBottomWidth: 3,
          borderColor: '#FFFFFF99',
          borderTopColor: '#faf7f4',
          borderBottomColor: '#faf7f4',
          borderRadius: 24,
          overflow: 'hidden',
        }}>
        {/* Gradient Overlay */}
        <LinearGradient
          colors={[
            '#F6E7D5',
            'rgba(242, 221, 197, 0.94)',
            'rgba(239, 222, 202, 0.6)',
            'rgba(255, 234, 208, 0.44)',
            'rgba(232, 221, 208, 0)',
          ]}
          locations={[0, 0.52, 0.67, 0.82, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />

        {/* Vertical Timeline Line */}
        <View
          style={{
            position: 'absolute',
            left: 82,
            top: '14%',
            bottom: '18%',
            width: 1.5,
            backgroundColor: '#977857',
            opacity: 0.4,
          }}
        />

        {/* Timeline Items */}
        {days.map((day, index) => {
          const imageSource = getImageSource(day.imageUri);

          return (
            <View key={day.id} style={{ padding: 12 }}>
              <View className="w-full flex-row items-start">
                {/* Left Image Container */}
                <View style={{ position: 'relative' }}>
                  {/* Glow Effect for Future Days */}
                  {day.isFuture && (
                    <View
                      style={{
                        position: 'absolute',
                        top: -4,
                        left: -4,
                        right: -4,
                        bottom: -4,
                        borderRadius: 20,
                        backgroundColor: getGlowColor(day.improvementPercentage),
                        opacity: 0.2,
                      }}
                    />
                  )}

                  {/* Main Image */}
                  <View
                    // className="h-16 w-16 overflow-hidden"
                    className="h-16 w-16 overflow-hidden"
                    style={{
                      borderRadius: 16,
                      borderWidth: 0.5,
                      borderTopWidth: 2,
                      borderBottomWidth: 2,
                      borderColor: '#FFFFFF99',
                      borderTopColor: '#faf7f4',
                      borderBottomColor: '#faf7f4',
                      position: 'relative',
                      backgroundColor: '#D4C5B0',
                    }}>
                    {imageSource ? (
                      <>
                        <Image
                          source={imageSource}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />

                        {/* Future Day Beauty Overlay */}
                        {day.isFuture && (
                          <>
                            {/* Gradient overlay for improvement effect */}
                            <LinearGradient
                              colors={getFutureDayGradient(day.improvementPercentage) as any}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                              }}
                            />

                            {/* Shine effect */}
                            <View
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '0%',
                                backgroundColor: 'rgba(255,255,255,0.25)',
                                transform: [{ skewY: '-10deg' }],
                              }}
                            />

                            {/* Improvement Badge */}
                            {day.improvementPercentage && (
                              <View
                                style={{
                                  position: 'absolute',
                                  bottom: 6,
                                  right: 2,
                                  // backgroundColor: getGlowColor(day.improvementPercentage),
                                  backgroundColor: 'transparent',
                                  borderRadius: 6,
                                  paddingHorizontal: 4,
                                  paddingVertical: 1,
                                  minWidth: 28,
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontSize: 8,
                                    fontFamily: 'Outfit-Bold',
                                  }}>
                                  +{day.improvementPercentage}%
                                </Text>
                              </View>
                            )}

                            {/* Sparkle dots */}
                            <View
                              style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: '#FDE047',
                                opacity: 0.9,
                              }}
                            />
                            <View
                              style={{
                                position: 'absolute',
                                top: 0,
                                right: 12,
                                width: 3,
                                height: 3,
                                borderRadius: 1.5,
                                backgroundColor: '#FEF08A',
                                opacity: 0.7,
                              }}
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <View className="h-full w-full bg-[#D4C5B0]" />
                    )}
                  </View>
                </View>

                {/* Timeline Dot */}
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: day.isFuture
                      ? getGlowColor(day.improvementPercentage)
                      : '#977857',
                    borderRadius: 999,
                    marginRight: 12,
                    marginLeft: 9,
                    marginTop: 26,
                  }}
                />

                {/* Content */}
                <View className="flex-1">
                  <Text className="font-outfitMedium text-[14px] text-[#2E2117]">{day.title}</Text>
                  <Text className="font-outfit text-[12px] text-[#2E211799]">{day.subtitle}</Text>

                  {/* Metrics */}
                  {day.metrics && day.metrics.length > 0 && (
                    <View className="mt-1">
                      {day.metrics.map((metric, idx) => {
                        const isPositive = metric.value.includes('+');
                        return (
                          <View key={idx} className="flex-row items-center gap-1">
                            {isPositive && (
                              <View
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: 2.5,
                                  backgroundColor: getGlowColor(day.improvementPercentage),
                                  marginRight: 4,
                                }}
                              />
                            )}
                            <Text
                              className="font-outfitMedium text-[12px]"
                              style={{ color: metric.color || '#7A8B6A' }}>
                              {metric.label} {metric.value}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ImageBackground>
    </View>
  );
};
