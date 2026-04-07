// components/articles/CategoryFilter.tsx
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { Category } from '@/types/article';

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
        gap: 8,
        paddingVertical: 8,
      }}
      className="mb-4">
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelectCategory(category.name)}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 100,
            backgroundColor: selectedCategory === category.name ? '#977857' : '#F3EBE0',
          }}>
          <Text
            className="font-outfitMedium text-[12px]"
            style={{ color: selectedCategory === category.name ? '#FFFFFF' : '#2E211799' }}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
