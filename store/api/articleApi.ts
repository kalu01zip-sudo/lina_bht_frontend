import { baseApi } from './baseApi';
import { ApiArticle, Article, ArticleListResponse, normaliseArticle } from '@/types/article';

export interface GetArticlesArg {
  limit?: number;
  offset?: number;
  search?: string;
}

export const articleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticleCategories: builder.query<string[], void>({
      query: () => '/articles/categories',
      providesTags: [{ type: 'articleApi', id: 'CATEGORIES' }],
    }),

    getArticles: builder.query<{ articles: Article[]; total: number }, GetArticlesArg>({
      query: ({ limit = 10, offset = 0, search } = {}) => {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        params.set('offset', String(offset));
        if (search?.trim()) params.set('search', search.trim());
        return `/articles?${params.toString()}`;
      },
      transformResponse: (raw: any) => {
        // Handle both shapes: plain array (old) or paginated object (new)
        const list: ApiArticle[] = Array.isArray(raw) ? raw : (raw?.articles ?? []);
        const total: number = Array.isArray(raw) ? list.length : (raw?.total ?? list.length);
        return { articles: list.map(normaliseArticle), total };
      },
      // Cache key = search term only (offset is intentionally excluded)
      // This means all pages of the same search share one cache entry
      serializeQueryArgs: ({ queryArgs }) => {
        return { search: queryArgs.search ?? '' };
      },
      merge: (currentCache, newItems, { arg }) => {
        if ((arg.offset ?? 0) === 0) {
          // offset=0 means fresh load or new search → replace, don't append
          currentCache.articles = newItems.articles;
        } else {
          // Append, deduplicating by id
          const existingIds = new Set(currentCache.articles.map((a) => a.id));
          const unique = newItems.articles.filter((a) => !existingIds.has(a.id));
          currentCache.articles.push(...unique);
        }
        currentCache.total = newItems.total;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.offset !== previousArg?.offset || currentArg?.search !== previousArg?.search,
      providesTags: [{ type: 'articleApi', id: 'LIST' }],
    }),

    getArticleById: builder.query<Article, string>({
      query: (id) => `/articles/${id}`,
      transformResponse: (raw: ApiArticle) => normaliseArticle(raw),
      providesTags: (_, __, id) => [{ type: 'articleApi', id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetArticleCategoriesQuery, useGetArticlesQuery, useGetArticleByIdQuery } =
  articleApi;
