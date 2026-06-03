// ── API response shapes ───────────────────────────────────────────────────────

/** Single article as returned by GET /articles/:id */
export interface ApiArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  read_time: string;
  image_url: string;
  video_url: string | null;
  content: string | null; // only present on detail endpoint
  views: number;
  created_at: string;
}

/** GET /articles?limit=&offset=&search= */
export interface ArticleListResponse {
  articles: ApiArticle[];
  total: number;
  limit: number;
  offset: number;
}

// ── Normalised client-side shape ──────────────────────────────────────────────

/** Camel-cased shape used throughout the UI */
export interface Article {
  id: string;
  title: string;
  description: string;
  content: string; // empty string when not yet loaded
  readTime: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  views: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  isActive?: boolean;
}

// ── Normaliser ────────────────────────────────────────────────────────────────

export const normaliseArticle = (a: ApiArticle): Article => ({
  id: a.id,
  title: a.title,
  description: a.description,
  content: a.content ?? '',
  readTime: a.read_time,
  category: a.category,
  imageUrl: a.image_url,
  videoUrl: a.video_url ?? undefined,
  views: a.views,
  createdAt: a.created_at,
});
