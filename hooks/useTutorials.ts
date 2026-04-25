// // hooks/useTutorials.ts
// import { useState, useEffect, useCallback } from 'react';
// import { Tutorial } from '@/types/tutorial';

// // Mock data - replace with API call later
// const MOCK_TUTORIALS: Tutorial[] = [
//   {
//     id: '1',
//     title: 'Morning Depuffing',
//     description: 'Quick 3-minute routine to reduce morning puffiness',
//     videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
//     duration: '3 mins',
//     category: 'face',
//     difficulty: 'beginner',
//     benefits: ['Reduces puffiness', 'Improves circulation', 'Wakes up skin'],
//   },
//   {
//     id: '2',
//     title: 'Jaw Tension Relief',
//     description: 'Release tension in jaw and neck area',
//     videoUrl: 'https://www.youtube.com/watch?v=MYaPfUVjldo',
//     duration: '7 mins',
//     category: 'neck',
//     difficulty: 'beginner',
//     benefits: ['Relieves jaw tension', 'Improves lymphatic flow', 'Reduces headaches'],
//   },
//   {
//     id: '3',
//     title: 'Full Face Lifting Routine',
//     description: 'Complete lymphatic drainage for face and neck',
//     videoUrl: 'https://www.youtube.com/watch?v=vGAuxPUTi5Q',
//     duration: '10 mins',
//     category: 'full_body',
//     difficulty: 'intermediate',
//     benefits: ['Lifts and tones', 'Reduces double chin', 'Improves skin texture'],
//     // isPremium: true,
//   },
// ];

// export const useTutorials = () => {
//   const [tutorials, setTutorials] = useState<Tutorial[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchTutorials = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // TODO: Replace with actual API call
//       // const response = await fetch('https://api.yourdomain.com/tutorials');
//       // const data = await response.json();
//       // setTutorials(data);

//       // Mock API call
//       setTimeout(() => {
//         setTutorials(MOCK_TUTORIALS);
//         setIsLoading(false);
//       }, 500);
//     } catch (err) {
//       console.error('Error fetching tutorials:', err);
//       setError('Failed to load tutorials');
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTutorials();
//   }, [fetchTutorials]);

//   return {
//     tutorials,
//     isLoading,
//     error,
//     refetch: fetchTutorials,
//   };
// };

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
  },
  {
    id: '4',
    title: 'Arm Lymphatic Drainage',
    description: 'Gentle massage to reduce arm swelling and improve circulation',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    duration: '5 mins',
    category: 'arms',
    difficulty: 'beginner',
    benefits: ['Reduces arm swelling', 'Improves lymph flow', 'Relieves tension'],
  },
  {
    id: '5',
    title: 'Abdomen Detox Massage',
    description: 'Support digestive health with abdominal lymphatic massage',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    duration: '8 mins',
    category: 'abdomen',
    difficulty: 'intermediate',
    benefits: ['Supports digestion', 'Reduces bloating', 'Detoxifies organs'],
  },
  {
    id: '6',
    title: 'Underarm Lymph Release',
    description: 'Techniques for clearing underarm lymph nodes',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    duration: '4 mins',
    category: 'arms',
    difficulty: 'beginner',
    benefits: ['Clears lymph nodes', 'Reduces armpit swelling', 'Improves arm mobility'],
  },
  {
    id: '7',
    title: 'Post-Workout Leg Recovery',
    description: 'Lymphatic massage for legs to reduce soreness and swelling',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    duration: '12 mins',
    category: 'full_body',
    difficulty: 'intermediate',
    benefits: ['Reduces muscle soreness', 'Speeds recovery', 'Prevents fluid retention'],
  },
  {
    id: '8',
    title: 'Belly Bloat Relief',
    description: '30-day program for reducing abdominal bloating',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    duration: '30 days',
    category: 'abdomen',
    difficulty: 'beginner',
    benefits: ['Reduces bloating', 'Improves digestion', 'Flattens belly', 'Boosts metabolism'],
    isPremium: true,
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
