// // types/home.ts
// export interface User {
//   id: string;
//   name: string;
//   avatar?: string;
//   email: string;
// }

// export interface SkinHealth {
//   score: number;
//   description: string;
// }

// // Add new interface for Face & Hair scores
// export interface FaceHairScores {
//   faceScore: number;
//   hairScore: number;
//   faceDescription?: string;
//   hairDescription?: string;
// }

// export interface SkinMetric {
//   id: string;
//   label: string;
//   value: string | number;
//   color: string;
//   unit?: string;
// }

// export interface RoutineStep {
//   id: string;
//   name: string;
//   completed: boolean;
// }

// export interface MorningRoutine {
//   id: string;
//   name: string;
//   steps: RoutineStep[];
//   completedSteps: number;
//   totalSteps: number;
// }

// export interface InsightArticle {
//   id: string;
//   type: 'daily_insight' | 'skin_nutrition';
//   title: string;
//   description: string;
//   icon: string;
//   actionText?: string;
// }

// export interface QuickAction {
//   id: string;
//   title: string;
//   icon: string;
//   onPress?: () => void;
// }

// // export interface HomeData {
// //   user: User;
// //   notificationCount: number;
// //   skinHealth: SkinHealth;
// //   metrics: SkinMetric[];
// //   morningRoutine: MorningRoutine;
// //   insights: InsightArticle[];
// //   quickActions: QuickAction[];
// // }

// export interface HomeData {
//   user: User;
//   notificationCount: number;
//   skinHealth: SkinHealth;
//   faceHairScores: FaceHairScores;
//   metrics: SkinMetric[];
//   morningRoutine: MorningRoutine;
//   insights: InsightArticle[];
//   quickActions: QuickAction[];
// }

// types/home.ts
export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface SkinMetric {
  id: string;
  label: string;
  value: string | number;
  color: string;
  unit?: string;
}

export interface RoutineStep {
  id: string;
  name: string;
  completed: boolean;
}

export interface MorningRoutine {
  id: string;
  name: string;
  steps: RoutineStep[];
  completedSteps: number;
  totalSteps: number;
}

export interface InsightArticle {
  id: string;
  type: 'daily_insight' | 'skin_nutrition';
  title: string;
  description: string;
  icon: string;
  actionText?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  onPress?: () => void;
}

export interface HomeData {
  user: User;
  notificationCount: number;
  faceScore: number;
  hairScore: number;
  metrics: SkinMetric[];
  morningRoutine: MorningRoutine;
  insights: InsightArticle[];
  quickActions: QuickAction[];
}