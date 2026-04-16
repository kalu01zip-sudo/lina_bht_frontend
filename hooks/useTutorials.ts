// // services/tutorialService.ts
// export const tutorialService = {
//   async getTutorials(): Promise<Tutorial[]> {
//     const response = await fetch(`${API_BASE_URL}/tutorials`);
//     const data = await response.json();
//     return data;
//   },

//   async getTutorialById(id: string): Promise<Tutorial> {
//     const response = await fetch(`${API_BASE_URL}/tutorials/${id}`);
//     const data = await response.json();
//     return data;
//   },
// };

// hooks/useTutorials.ts
import { useState, useEffect, useCallback } from 'react';
import { Tutorial } from '@/types/tutorial';

// Mock data - replace with API call later
const MOCK_TUTORIALS: Tutorial[] = [
  {
    id: '1',
    title: 'Morning Depuffing',
    description: 'Quick 3-minute routine to reduce morning puffiness',
    videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
    duration: '3 mins',
    category: 'face',
    difficulty: 'beginner',
    benefits: ['Reduces puffiness', 'Improves circulation', 'Wakes up skin'],
  },
  {
    id: '2',
    title: 'Jaw Tension Relief',
    description: 'Release tension in jaw and neck area',
    videoUrl: 'https://www.youtube.com/watch?v=MYaPfUVjldo',
    duration: '7 mins',
    category: 'neck',
    difficulty: 'beginner',
    benefits: ['Relieves jaw tension', 'Improves lymphatic flow', 'Reduces headaches'],
  },
  {
    id: '3',
    title: 'Full Face Lifting Routine',
    description: 'Complete lymphatic drainage for face and neck',
    videoUrl: 'https://www.youtube.com/watch?v=vGAuxPUTi5Q',
    duration: '10 mins',
    category: 'full_body',
    difficulty: 'intermediate',
    benefits: ['Lifts and tones', 'Reduces double chin', 'Improves skin texture'],
    // isPremium: true,
  },
];

export const useTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTutorials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('https://api.yourdomain.com/tutorials');
      // const data = await response.json();
      // setTutorials(data);

      // Mock API call
      setTimeout(() => {
        setTutorials(MOCK_TUTORIALS);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError('Failed to load tutorials');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutorials();
  }, [fetchTutorials]);

  return {
    tutorials,
    isLoading,
    error,
    refetch: fetchTutorials,
  };
};
