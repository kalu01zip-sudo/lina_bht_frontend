// constants/onboarding.ts
export const GRADIENT_CONFIG = {
  colors: [
    'rgba(232, 221, 208, 0)',
    'rgba(232, 221, 208, 0.32)',
    'rgba(232, 221, 208, 0.64)',
    'rgba(232, 221, 208, 0.76)',
    '#E8DDD0',
    '#E8DDD0',
  ] as const,
  locations: [0, 0.1331, 0.2455, 0.3743, 0.4867, 1] as const,
  start: { x: 0.5, y: 0 } as const,
  end: { x: 0.5, y: 1 } as const,
};

export const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Your Skin deserves a routine that makes sense',
    description: 'Learn what to apply, when, and why - with your own products.',
    backgroundImage: require('@/assets/images/onboarding/onboarding_1.png'),
    buttonText: 'Get Started',
  },
  {
    id: '2',
    title: 'Stop guessing. Start understanding your skin. ',
    description: 'Scan your products. Get a routine built for your skin.',
    backgroundImage: require('@/assets/images/onboarding/onboarding_2.jpg'),
    buttonText: 'Next',
  },
  {
    id: '3',
    title: 'Scan any product. We explain how to use it.',
    description: 'No more layering mistakes. No more irritation.',
    backgroundImage: require('@/assets/images/onboarding/onboarding_3.jpg'),
    buttonText: 'Continue',
  },
];

export const SCREEN_MAP = {
  '/(onboarding)/screen1': 0,
  '/(onboarding)/screen2': 1,
  '/(onboarding)/screen3': 2,
};
