// hooks/useArticles.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SAMPLE_ARTICLES, CATEGORIES } from '@/constants/sampleArticles';
import { Article, Category } from '@/types/article';

export const useArticles = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(SAMPLE_ARTICLES);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(SAMPLE_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories] = useState<Category[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedCategory]);

  const filterArticles = () => {
    let filtered = [...articles];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleArticlePress = (article: Article) => {
    // Navigate to article detail with the article ID
    router.push({
      pathname: '/(flow)/learn-article/[id]',
      params: { id: article.id },
    });
  };

  return {
    articles: filteredArticles,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    handleSearch,
    handleCategorySelect,
    handleArticlePress,
  };
};
