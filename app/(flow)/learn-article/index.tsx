// app/(flow)/learn-article/index.tsx
import React from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/header/CustomHeader';
import InputField from '@/components/inputs/Input';
import { LAYOUT } from '@/constants/constants';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { CategoryFilter } from '@/components/articles/CategoryFilter';
import { useArticles } from '@/hooks/useArticles';

export default function LearnArticleScreen() {
  const {
    articles,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    handleSearch,
    handleCategorySelect,
    handleArticlePress,
  } = useArticles();

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Learn Articles" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 10,
          flexGrow: 1,
        }}
        className="flex-1">
        <View className="px-container">
          {/* Search Bar */}
          <View className="mb-4">
            <InputField
              value={searchQuery}
              handler={(_, value) => handleSearch(value)}
              placeHolder="Search topics..."
              showLabel={false}
              height={56}
              withShadow={true}
              borderTopLeftRadius={24}
              borderTopRightRadius={24}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              //   inputStyle={{ backgroundColor: '#FFFFFF' }}
            />
          </View>

          {/* Categories Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />

          {/* Recommended For You Section */}
          <View className="mt-2">
            <Text className="mb-4 font-outfitMedium text-[18px]" style={{ color: '#361A0D' }}>
              Recommended for You
            </Text>

            {articles.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Ionicons name="search-outline" size={48} color="#2E211733" />
                <Text className="mt-3 font-outfit text-[14px]" style={{ color: '#2E211766' }}>
                  No articles found
                </Text>
                <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
                  Try adjusting your search or filter
                </Text>
              </View>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} onPress={handleArticlePress} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
