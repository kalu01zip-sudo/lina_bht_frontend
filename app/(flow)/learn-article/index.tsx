
// app/(flow)/learn-article/index.tsx
import React from 'react';
import { ScrollView, View, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/header/CustomHeader';
import InputField from '@/components/inputs/Input';
import { LAYOUT } from '@/constants/constants';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { CategoryFilter } from '@/components/articles/CategoryFilter';
import { useArticles } from '@/hooks/useArticles';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';

export default function LearnArticleScreen() {
  const {
    articles,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    isFetching,
    isError,
    hasMore,
    refetch,
    handleSearch,
    handleCategorySelect,
    handleLoadMore,
    handleArticlePress,
  } = useArticles();

  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading articles..." />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Learn Articles" height={50} backButton={true} />
        <ErrorScreen message="Failed to load articles." onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const isScrolledToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 80;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

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
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#977857"
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isScrolledToBottom(nativeEvent)) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
        className="flex-1">
        <View className="px-container">
          {/* Search Bar */}
          <View className="mb-1">
            <InputField
              value={searchQuery}
              handler={(_, value) => handleSearch(value)}
              placeHolder="Search topics..."
              showLabel={false}
              height={56}
              gradientColors={['#E8DDD0', '#E8DDD0']}
              withShadow={true}
              borderTopLeftRadius={24}
              borderTopRightRadius={24}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
            />
          </View>

          {/* Categories Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />

          {/* Articles */}
          <View className="mt-3">
            <Text className="mb-4 font-outfitMedium text-[18px]" style={{ color: '#361A0D' }}>
              {selectedCategory === 'All' ? 'Recommended for You' : selectedCategory}
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

            {/* Pagination loader */}
            {isFetching && !isLoading && (
              <View className="items-center py-6">
                <ActivityIndicator size="small" color="#977857" />
              </View>
            )}

            {/* End of list */}
            {!hasMore && articles.length > 0 && !isFetching && (
              <View className="items-center py-6">
                <Text className="font-outfit text-[12px]" style={{ color: '#2E211744' }}>
                  You&apos;ve reached the end
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
