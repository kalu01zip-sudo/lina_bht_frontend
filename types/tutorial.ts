// types/tutorial.ts
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube URL from admin dashboard
  thumbnailUrl?: string;
  duration: string; // e.g., "3 mins"
  category: 'face' | 'neck' | 'full_body';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  steps?: string[];
  isPremium?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TutorialResponse {
  success: boolean;
  data: Tutorial[];
  message?: string;
}
