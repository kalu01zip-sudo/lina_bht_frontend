// // constants/routineData.ts
// export interface RoutineStep {
//   stepNumber: number;
//   title: string;
//   description: string;
//   completed?: boolean; // Optional completed flag for default state
// }

// export const routineSteps = {
//   morning: [
//     {
//       stepNumber: 1,
//       title: 'Gentle Oat Cleanser',
//       description: 'Massage onto damp skin for 60 seconds, rinse with lukewarm water.',
//       completed: true, // ✅ Pre-completed
//     },
//     {
//       stepNumber: 2,
//       title: 'Calm & Restore Serum',
//       description: 'Apply 3-4 drops to slightly damp skin. Pat gently.',
//       completed: false, // ⭕ Not completed
//     },
//     {
//       stepNumber: 3,
//       title: 'Mineral SPF 50',
//       description: 'Apply generously as the final step. Reapply every 2 hours if outdoors.',
//       completed: false, // ⭕ Not completed
//     },
//   ],
//   night: [
//     {
//       stepNumber: 1,
//       title: 'Cleansing Balm',
//       description: 'Massage onto dry skin to melt makeup/SPF. Emulsify with water and rinse.',
//       completed: true, // ✅ Pre-completed
//     },
//     {
//       stepNumber: 2,
//       title: 'Barrier Repair Cream',
//       description: 'Apply a generous layer to lock in moisture.',
//       completed: false, // ⭕ Not completed
//     },
//   ],
//   weekly: [
//     {
//       stepNumber: 1,
//       title: 'AHA/BHA Exfoliant',
//       description:
//         'Apply a thin layer after cleansing. Leave for 10 minutes, then continue with serum.',
//       completed: false, // ⭕ Not completed
//     },
//   ],
// };

// export const getCompletedStepsCount = (
//   routineType: string,
//   completedSteps: Record<string, boolean>
// ) => {
//   const steps = routineSteps[routineType as keyof typeof routineSteps] || [];
//   return steps.filter((_, index) => {
//     // Check user's completed steps first, fallback to default completed flag
//     if (completedSteps[`${routineType}_${index}`] !== undefined) {
//       return completedSteps[`${routineType}_${index}`];
//     }
//     return steps[index].completed || false;
//   }).length;
// };

// export const getRoutineProgress = (
//   routineType: string,
//   completedSteps: Record<string, boolean>
// ) => {
//   const steps = routineSteps[routineType as keyof typeof routineSteps] || [];
//   const completedCount = steps.filter((_, index) => {
//     if (completedSteps[`${routineType}_${index}`] !== undefined) {
//       return completedSteps[`${routineType}_${index}`];
//     }
//     return steps[index].completed || false;
//   }).length;
//   return steps.length > 0 ? (completedCount / steps.length) * 100 : 0;
// };

// // Helper function to get initial completed steps from data
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

// constants/routineData.ts
export interface RoutineStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  completed?: boolean;
  detailedContent?: string; // HTML content for details page
  type?: 'product' | 'wellness' | 'custom';
  duration?: string;
  frequency?: string;
  tips?: string[];
}

export const routineSteps = {
  morning: [
    {
      id: 'morning_cleanser',
      stepNumber: 1,
      title: 'Gentle Oat Cleanser',
      description: 'Massage onto damp skin for 60 seconds, rinse with lukewarm water.',
      completed: true,
      type: 'product',
      duration: '60 seconds',
      frequency: 'Twice daily',
      detailedContent: `
        <h2>Why This Step Matters</h2>
        <p>Cleansing is the foundation of any skincare routine. It removes dirt, oil, and impurities that accumulate on your skin overnight.</p>
        
        <h2>How to Apply</h2>
        <ol>
          <li>Wet your face with lukewarm water</li>
          <li>Squeeze a small amount into your palms</li>
          <li>Gently massage onto damp skin in circular motions for 60 seconds</li>
          <li>Focus on areas with excess oil (T-zone)</li>
          <li>Rinse thoroughly with cool water</li>
          <li>Pat dry with a clean towel - don't rub!</li>
        </ol>
        
        <h2>Key Ingredients</h2>
        <ul>
          <li><strong>Colloidal Oatmeal</strong> - Soothes and calms irritation</li>
          <li><strong>Glycerin</strong> - Hydrates without stripping</li>
          <li><strong>Aloe Vera</strong> - Provides anti-inflammatory benefits</li>
        </ul>
        
        <h2>Pro Tips</h2>
        <blockquote>
          Use lukewarm water - hot water strips natural oils, cold water doesn't cleanse effectively.
        </blockquote>
        
        <h2>Common Mistakes to Avoid</h2>
        <ul>
          <li>Using too hot or too cold water</li>
          <li>Rushing the cleansing process</li>
          <li>Using a dirty washcloth</li>
        </ul>
      `,
    },
    {
      id: 'morning_serum',
      stepNumber: 2,
      title: 'Calm & Restore Serum',
      description: 'Apply 3-4 drops to slightly damp skin. Pat gently.',
      completed: false,
      type: 'product',
      duration: '30 seconds',
      frequency: 'Daily (morning)',
      detailedContent: `
        <h2>Why This Step Matters</h2>
        <p>Serums deliver concentrated active ingredients deep into your skin. This vitamin C serum brightens, protects, and boosts collagen.</p>
        
        <h2>How to Apply</h2>
        <ol>
          <li>Dispense 3-4 drops onto fingertips</li>
          <li>Apply to slightly damp skin (helps absorption)</li>
          <li>Gently pat and press into skin - don't rub</li>
          <li>Extend down to neck and décolletage</li>
          <li>Wait 1-2 minutes before applying moisturizer</li>
        </ol>
        
        <h2>Benefits</h2>
        <ul>
          <li>Brightens complexion</li>
          <li>Reduces hyperpigmentation</li>
          <li>Protects from free radical damage</li>
          <li>Boosts collagen production</li>
        </ul>
        
        <h2>Pro Tips</h2>
        <blockquote>
          Store vitamin C serums in a cool, dark place to prevent oxidation. They should be light yellow - if dark orange, it's expired.
        </blockquote>
      `,
    },
    {
      id: 'morning_spf',
      stepNumber: 3,
      title: 'Mineral SPF 50',
      description: 'Apply generously as the final step. Reapply every 2 hours if outdoors.',
      completed: false,
      type: 'product',
      duration: '1 minute',
      frequency: 'Daily (morning)',
      detailedContent: `
        <h2>Why This Step Matters</h2>
        <p>Sunscreen is the most important step in your morning routine. It protects against UV damage, premature aging, and skin cancer.</p>
        
        <h2>How to Apply</h2>
        <ol>
          <li>Use 2 finger-lengths of sunscreen for face and neck</li>
          <li>Apply as the final step in your routine</li>
          <li>Don't forget ears, neck, and back of hands</li>
          <li>Wait 15 minutes before sun exposure</li>
          <li>Reapply every 2 hours when outdoors</li>
        </ol>
        
        <h2>Why Mineral Sunscreen?</h2>
        <ul>
          <li>Gentle on sensitive skin</li>
          <li>Provides immediate protection</li>
          <li>Environmentally friendly (reef-safe)</li>
          <li>Less likely to cause irritation</li>
        </ul>
        
        <h2>Pro Tips</h2>
        <blockquote>
          Most people don't apply enough sunscreen. Use two finger-lengths for your face and neck to get the labeled SPF protection.
        </blockquote>
      `,
    },
  ],
  night: [
    {
      id: 'night_cleanser',
      stepNumber: 1,
      title: 'Cleansing Balm',
      description: 'Massage onto dry skin to melt makeup/SPF. Emulsify with water and rinse.',
      completed: true,
      type: 'product',
      duration: '2 minutes',
      frequency: 'Nightly',
      detailedContent: `
        <h2>Why Double Cleanse at Night</h2>
        <p>Oil-based cleansing removes makeup, sunscreen, and excess sebum that water-based cleansers can't touch.</p>
        
        <h2>How to Apply</h2>
        <ol>
          <li>Apply balm to dry hands and face</li>
          <li>Massage gently to dissolve makeup and SPF</li>
          <li>Add water to emulsify (turns milky)</li>
          <li>Continue massaging for 30 seconds</li>
          <li>Rinse thoroughly with lukewarm water</li>
          <li>Follow with water-based cleanser</li>
        </ol>
        
        <h2>Benefits</h2>
        <ul>
          <li>Removes all traces of makeup and sunscreen</li>
          <li>Doesn't strip natural oils</li>
          <li>Prepares skin for treatment products</li>
        </ul>
      `,
    },
  ],
  weekly: [
    {
      id: 'weekly_exfoliant',
      stepNumber: 1,
      title: 'AHA/BHA Exfoliant',
      description:
        'Apply a thin layer after cleansing. Leave for 10 minutes, then continue with serum.',
      completed: false,
      type: 'product',
      duration: '10 minutes',
      frequency: '1-2 times per week',
      detailedContent: `
        <h2>Why Exfoliate Weekly</h2>
        <p>Chemical exfoliation removes dead skin cells, unclogs pores, and improves skin texture and radiance.</p>
        
        <h2>How to Apply</h2>
        <ol>
          <li>Apply to clean, dry skin</li>
          <li>Use a thin, even layer</li>
          <li>Leave for 10-15 minutes</li>
          <li>Rinse with lukewarm water</li>
          <li>Follow with hydrating serum and moisturizer</li>
        </ol>
        
        <h2>Important Precautions</h2>
        <ul>
          <li>Don't use with other actives (retinol, vitamin C)</li>
          <li>Wear SPF the next day</li>
          <li>Start with once per week</li>
          <li>Don't leave on longer than recommended</li>
        </ul>
        
        <blockquote>
          Over-exfoliation can damage your skin barrier. Listen to your skin - if it feels tight or irritated, take a break.
        </blockquote>
      `,
    },
  ],
};
