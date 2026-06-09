import { useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Article, Category } from '@/types/article';
import { useGetArticlesQuery, useGetArticleCategoriesQuery } from '@/store/api/articleApi';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 10;

export const useArticles = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [offset, setOffset] = useState(0);
  const loadingMoreRef = useRef(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data: rawCategories = [], isLoading: categoriesLoading } = useGetArticleCategoriesQuery();

  const categories: Category[] = useMemo(
    () => [
      { id: 'all', name: 'All' },
      ...rawCategories.map((name, i) => ({ id: String(i + 1), name })),
    ],
    [rawCategories]
  );

  const {
    data,
    isLoading: articlesLoading,
    isFetching,
    isError,
    refetch,
  } = useGetArticlesQuery(
    { limit: PAGE_SIZE, offset, search: debouncedSearch || undefined },
    { refetchOnMountOrArgChange: true }
  );

  // Unlock load-more guard once fetch settles
  if (!isFetching) {
    loadingMoreRef.current = false;
  }

  const allArticles = data?.articles ?? [];
  const total = data?.total ?? 0;

  // hasMore: true only when there are more items on the server than we have loaded
  const hasMore = total > allArticles.length;

  // Client-side category filter (server handles search, we handle category)
  const articles: Article[] = useMemo(() => {
    if (selectedCategory === 'All') return allArticles;
    return allArticles.filter((a) => a.category === selectedCategory);
  }, [allArticles, selectedCategory]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setOffset(0); // reset to first page on new search
  }, []);

  const handleCategorySelect = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
  }, []);

  const handleLoadMore = useCallback(() => {
    // Guard: don't fire if already loading, no more pages, or locked by ref
    if (loadingMoreRef.current || isFetching || !hasMore) return;
    loadingMoreRef.current = true;
    setOffset((prev) => prev + PAGE_SIZE);
  }, [isFetching, hasMore]);

  const handleRefresh = useCallback(() => {
    setOffset(0);
    refetch();
  }, [refetch]);

  const handleArticlePress = useCallback(
    (article: Article) => {
      router.push({
        pathname: '/(flow)/learn-article/[id]',
        params: { id: article.id },
      });
    },
    [router]
  );

  return {
    articles,
    categories,
    selectedCategory,
    searchQuery,
    isLoading: articlesLoading || categoriesLoading,
    isFetching,
    isError,
    hasMore,
    refetch: handleRefresh,
    handleSearch,
    handleCategorySelect,
    handleLoadMore,
    handleArticlePress,
  };
};
