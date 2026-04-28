// components/scans/RecipesSection.tsx
import React from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { RecipesIcon } from '../icons/RecipesIcon';
import PillowBadge from '../buttons/PillowBadge';

export interface RecommendedRecipe {
  id: string;
  title: string;
  description: string;
  imageUrl: any; // Can be require() result or URL string
  tags: string[]; // Array of tags like "Breakfast", "Quick", etc.
  duration?: string; // Optional cooking time
}

interface RecipesSectionProps {
  recommendedRecipes: RecommendedRecipe[];
  title?: string;
  showIcon?: boolean;
  onRecipePress?: (recipe: RecommendedRecipe) => void;
}

export const RecipesSection: React.FC<RecipesSectionProps> = ({
  recommendedRecipes,
  title = 'Recipes for Your Skin',
  showIcon = true,
  onRecipePress,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const paddingHorizontal = 32;
  const availableWidth = screenWidth - paddingHorizontal;
  const cardWidth = Math.min(availableWidth / 1.2, 280); // Wider cards for recipe content
  const imageHeight = 120; // Fixed height for the image

  if (!recommendedRecipes || recommendedRecipes.length === 0) {
    return (
      <View className="mt-6">
        <View className="flex-row items-center gap-3">
          {showIcon && <RecipesIcon size={32} />}
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
            No recipes available
          </Text>
        </View>
      </View>
    );
  }

  // Helper to check if image is remote URL
  const isRemoteUrl = (source: any): boolean => {
    if (typeof source === 'string') {
      return source.startsWith('http://') || source.startsWith('https://');
    }
    return false;
  };

  // Helper to get image source
  const getImageSource = (source: any) => {
    if (
      typeof source === 'string' &&
      (source.startsWith('http://') || source.startsWith('https://'))
    ) {
      return { uri: source };
    }
    return source;
  };

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row items-center gap-3">
        {showIcon && <RecipesIcon size={32} />}
        <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
          {title}
        </Text>
      </View>

      {/* Horizontal Scrollable Recipes List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerStyle={{
          paddingRight: 16,
          gap: 12,
        }}>
        {recommendedRecipes.map((recipe) => {
          const imageSource = getImageSource(recipe.imageUrl);
          const isRemote = isRemoteUrl(recipe.imageUrl);

          return (
            <TouchableOpacity
              key={recipe.id}
              activeOpacity={1}
              // onPress={() => onRecipePress?.(recipe)}
              style={{
                width: cardWidth,
                borderRadius: 24,
                // backgroundColor: '#f1efec',
                backgroundColor: 'transparent',
                overflow: 'hidden',
                borderWidth: 3,
                borderLeftWidth: 1.5,
                borderRightWidth: 1.5,
                borderColor: '#FFFFFF66',
              }}>
              {/* Top Image */}
              <View
                style={{
                  width: '100%',
                  height: imageHeight,
                  overflow: 'hidden',
                  backgroundColor: '#E8DDD0',
                }}>
                <Image
                  source={imageSource}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                  {...(isRemote && {
                    onError: (e) => console.log('Image load error:', e.nativeEvent.error),
                  })}
                />
              </View>

              {/* Bottom Content - Using flex layout to push tags to bottom */}
              <View
                style={{
                  padding: 12,
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                {/* Title and Description Container */}
                <View style={{ gap: 8 }}>
                  {/* Recipe Title */}
                  <Text
                    className="font-outfitMedium text-[14px]"
                    style={{
                      color: '#2E2117',
                    }}
                    numberOfLines={2}>
                    {recipe.title}
                  </Text>

                  {/* Recipe Description */}
                  <Text
                    className="font-outfit text-[11px]"
                    style={{
                      color: '#666666',
                      lineHeight: 14,
                    }}
                    numberOfLines={2}>
                    {recipe.description}
                  </Text>
                </View>

                {/* Tags Row - Pushed to bottom */}
                <View className="mt-4 flex-row flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#FCEBE1',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderTopWidth: 1.5,
                        borderBottomWidth: 1.5,
                        borderColor: '#FFFFFF66',
                      }}>
                      <Text
                        className="font-outfitMedium text-[10px]"
                        style={{
                          color: '#A65E3A',
                        }}>
                        {tag}
                      </Text>
                    </View>
                  ))}

                  {/* Optional Duration Badge */}
                  {recipe.duration && (
                    <View
                      style={{
                        backgroundColor: '#FCEBE1',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                      <Text
                        className="font-outfitMedium text-[10px]"
                        style={{
                          color: '#A65E3A',
                        }}>
                        🕒 {recipe.duration}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
