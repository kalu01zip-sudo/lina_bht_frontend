// constants/routineData.ts
export interface RoutineStep {
  stepNumber: number;
  title: string;
  description: string;
  completed?: boolean; // Optional completed flag for default state
}

export const routineSteps = {
  morning: [
    {
      stepNumber: 1,
      title: 'Gentle Oat Cleanser',
      description: 'Massage onto damp skin for 60 seconds, rinse with lukewarm water.',
      completed: true, // ✅ Pre-completed
    },
    {
      stepNumber: 2,
      title: 'Calm & Restore Serum',
      description: 'Apply 3-4 drops to slightly damp skin. Pat gently.',
      completed: false, // ⭕ Not completed
    },
    {
      stepNumber: 3,
      title: 'Mineral SPF 50',
      description: 'Apply generously as the final step. Reapply every 2 hours if outdoors.',
      completed: false, // ⭕ Not completed
    },
  ],
  night: [
    {
      stepNumber: 1,
      title: 'Cleansing Balm',
      description: 'Massage onto dry skin to melt makeup/SPF. Emulsify with water and rinse.',
      completed: true, // ✅ Pre-completed
    },
    {
      stepNumber: 2,
      title: 'Barrier Repair Cream',
      description: 'Apply a generous layer to lock in moisture.',
      completed: false, // ⭕ Not completed
    },
  ],
  weekly: [
    {
      stepNumber: 1,
      title: 'AHA/BHA Exfoliant',
      description:
        'Apply a thin layer after cleansing. Leave for 10 minutes, then continue with serum.',
      completed: false, // ⭕ Not completed
    },
  ],
};

export const getCompletedStepsCount = (
  routineType: string,
  completedSteps: Record<string, boolean>
) => {
  const steps = routineSteps[routineType as keyof typeof routineSteps] || [];
  return steps.filter((_, index) => {
    // Check user's completed steps first, fallback to default completed flag
    if (completedSteps[`${routineType}_${index}`] !== undefined) {
      return completedSteps[`${routineType}_${index}`];
    }
    return steps[index].completed || false;
  }).length;
};

export const getRoutineProgress = (
  routineType: string,
  completedSteps: Record<string, boolean>
) => {
  const steps = routineSteps[routineType as keyof typeof routineSteps] || [];
  const completedCount = steps.filter((_, index) => {
    if (completedSteps[`${routineType}_${index}`] !== undefined) {
      return completedSteps[`${routineType}_${index}`];
    }
    return steps[index].completed || false;
  }).length;
  return steps.length > 0 ? (completedCount / steps.length) * 100 : 0;
};

// Helper function to get initial completed steps from data
export const getInitialCompletedSteps = (): Record<string, boolean> => {
  const initial: Record<string, boolean> = {};

  Object.entries(routineSteps).forEach(([routineType, steps]) => {
    steps.forEach((step, index) => {
      if (step.completed) {
        initial[`${routineType}_${index}`] = true;
      }
    });
  });

  return initial;
};
