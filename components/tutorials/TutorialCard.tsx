// components/tutorials/TutorialCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { Tutorial } from '@/types/tutorial';

interface TutorialCardProps {
  tutorial: Tutorial;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: (tutorial: Tutorial) => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  isFirst = false,
  isLast = false,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(tutorial);
    } else {
      router.push({
        pathname: '/(flow)/tutorial-details',
        params: { id: tutorial.id },
      });
    }
  };

  // Get YouTube thumbnail from video URL
  const getYouTubeThumbnail = (videoUrl: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/,
    ];

    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match) {
        return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
      }
    }
    return null;
  };

  const thumbnailUrl = tutorial.thumbnailUrl || getYouTubeThumbnail(tutorial.videoUrl);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <BorderlessShadowCard
        b_tl={isFirst ? 24 : 0}
        b_tr={isFirst ? 24 : 0}
        b_bl={isLast ? 24 : 0}
        b_br={isLast ? 24 : 0}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 16,
          marginTop: 12,
        }}>
        <View className="flex-row items-start gap-3">
          {/* Thumbnail with Play Button Overlay */}
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <View style={{ position: 'relative' }}>
              {thumbnailUrl ? (
                <>
                  <Image
                    source={{ uri: thumbnailUrl }}
                    style={{
                      width: 90,
                      height: 70,
                      borderRadius: 12,
                      backgroundColor: '#F0E6D8',
                    }}
                    resizeMode="cover"
                  />
                  {/* Play Button Overlay */}
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          backgroundColor: 'transparent',
                          borderStyle: 'solid',
                          borderLeftWidth: 10,
                          borderRightWidth: 0,
                          borderBottomWidth: 6,
                          borderTopWidth: 6,
                          borderLeftColor: '#361A0D',
                          borderRightColor: 'transparent',
                          borderBottomColor: 'transparent',
                          borderTopColor: 'transparent',
                          marginLeft: 3,
                        }}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <View
                  style={{
                    width: 90,
                    height: 70,
                    borderRadius: 12,
                    backgroundColor: '#F0E6D8',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text className="font-outfit text-[10px]" style={{ color: '#2E211780' }}>
                    No preview
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="font-outfitSemi text-[12px]" style={{ color: '#977857' }}>
              {tutorial.category === 'face'
                ? 'Face Massage'
                : tutorial.category === 'neck'
                  ? 'Neck Massage'
                  : 'Full Body Massage'}
            </Text>
            <Text
              className="font-outfitMedium text-[14px]"
              style={{ color: '#2E2117', lineHeight: 24 }}>
              {tutorial.title}
            </Text>
            <Text className="mt-1 font-outfit text-[12px]" style={{ color: '#2E211780' }}>
              {tutorial.duration}
            </Text>
          </View>
        </View>
      </BorderlessShadowCard>
    </TouchableOpacity>
  );
};
