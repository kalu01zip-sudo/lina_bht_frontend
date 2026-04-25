// components/articles/ArticleCard.tsx (Alternative with Pressable)
import React, { useRef } from 'react';
import { View, Text, Image, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  return (
    <Pressable
      onPress={() => onPress(article)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 16 }}>
        <BorderlessShadowCard
          b_tl={24}
          b_tr={24}
          b_bl={24}
          b_br={24}
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
          }}>
          <View className="flex-row gap-4">
            {/* Image */}
            <Image
              source={{ uri: article.imageUrl }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 24,
                backgroundColor: '#F0E6D8',
              }}
              resizeMode="cover"
            />

            {/* Content */}
            <View className="flex-1 justify-between">
              <View>
                <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
                  {article.title}
                </Text>
                <Text className="mt-1 font-outfit text-[12px]" style={{ color: '#2E211766' }}>
                  {article.description}
                </Text>
              </View>

              {/* Read Time */}
              <View className="mt-2 flex-row items-center gap-1">
                <Ionicons name="time-outline" size={12} color="#2E211766" />
                <Text className="font-outfit text-[10px]" style={{ color: '#2E211766' }}>
                  {article.readTime}
                </Text>
              </View>
            </View>
          </View>
        </BorderlessShadowCard>
      </Animated.View>
    </Pressable>
  );
};
