// // types/article.ts
// export interface Article {
//   id: string;
//   title: string;
//   description: string;
//   readTime: string;
//   category: string;
//   imageUrl: string;
//   videoUrl?: string; // YouTube video URL
//   content?: string;
//   isVideo?: boolean;
// }

// export interface Category {
//   id: string;
//   name: string;
//   isActive?: boolean;
// }

// types/article.ts
export interface Article {
  id: string;
  title: string;
  description: string; // Short description for card view
  content: string; // HTML content from admin editor
  readTime: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  // author?: string;
  // publishedDate?: string;
}

export interface Category {
  id: string;
  name: string;
  isActive?: boolean;
}
