// components/articles/CategoryFilter.tsx
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { Category } from '@/types/article';
import PrimaryButton from '../buttons/PrimaryButton';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: 'row',
      }}
      className="mb-0">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.name;

        return (
          <PrimaryButton
            key={category.id}
            onPress={() => onSelectCategory(category.name)}
            height={32}
            title={category.name}
            withShadow={true}
            gradientColors={isSelected ? ['#e2d2c1', '#e2d2c1'] : ['#e8dbcf', '#e8dbcf']}
            textStyle={{
              color: isSelected ? '#361A0D' : '#FFFFFF',
              fontFamily: 'Outfit-Medium',
              fontSize: 14,
              marginLeft: -20,
              marginRight: -20,
              // Add text shadow for white text to improve visibility
              ...(!isSelected && {
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }),
            }}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 6,
            }}
          />
        );
      })}
    </ScrollView>
  );
};
