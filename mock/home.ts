// mock/home.ts
import { HomeData, InsightArticle, MorningRoutine, QuickAction, SkinMetric } from '@/types/home';

export const MOCK_METRICS: SkinMetric[] = [
  {
    id: 'hydration',
    label: 'Hydration',
    value: '72%',
    color: '#60A5FA',
  },
  {
    id: 'acne_risk',
    label: 'Acne Risk',
    value: 'Low',
    color: '#4ADE80',
  },
  {
    id: 'sensitivity',
    label: 'Sensitivity',
    value: '72%',
    color: '#FACC15',
  },
];

export const MOCK_MORNING_ROUTINE: MorningRoutine = {
  id: 'morning_routine_1',
  name: 'Morning Routine',
  steps: [
    { id: 'step_1', name: 'Gentle Oat Cleanser', completed: true },
    { id: 'step_2', name: 'Calm & Restore Serum', completed: false },
    { id: 'step_3', name: 'Mineral SPF 50', completed: false },
  ],
  completedSteps: 1,
  totalSteps: 3,
};

export const MOCK_INSIGHTS: InsightArticle[] = [
  {
    id: 'insight_1',
    type: 'daily_insight',
    title: 'Daily Insight',
    description: 'Humidity is low today (32%). Consider adding a hyaluronic acid serum.',
    icon: 'daily_insight',
    actionText: 'Learn More',
  },
  {
    id: 'insight_2',
    type: 'skin_nutrition',
    title: 'Skin Nutrition',
    description:
      'Vitamin C rich foods like oranges and bell peppers can boost collagen production.',
    icon: 'skin_nutrition',
    actionText: 'Learn More',
  },
];

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  { id: 'scan_skin', title: 'Face Scan', icon: 'scan_skin' },
  { id: 'scan_product', title: 'Product Scan', icon: 'scan_product' },
  { id: 'my_routine', title: 'My Routine', icon: 'routine' },
  { id: 'lymphatic_massage', title: 'Lymphatic Massage', icon: 'lymphatic_massage' },
];

export const MOCK_HOME_DATA: HomeData = {
  user: {
    id: 'user_1',
    name: 'Elena',
    email: 'elena@example.com',
  },
  notificationCount: 5,
  faceScore: 85,
  hairScore: 72,
  metrics: MOCK_METRICS,
  morningRoutine: MOCK_MORNING_ROUTINE,
  insights: MOCK_INSIGHTS,
  quickActions: MOCK_QUICK_ACTIONS,
};
