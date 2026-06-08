// // utils/routineMapper.ts
// import { RoutineStep } from '@/store/api/routineApi';

// export interface UIRoutineStep {
//   price: number | null | undefined;
//   productUrl: string | null | undefined;
//   id: string;
//   stepNumber: number;
//   title: string;
//   description: string;
//   phase: string;
//   time: string;
//   productName: string | null;
//   productCategory: string;
// }

// export function mapStepToUI(step: RoutineStep, index: number): UIRoutineStep {
//   // Generate a meaningful title from product_category if product_name is null
//   let title = step.product_name || step.product_category;

//   // Capitalize first letter of title
//   if (title && title.length > 0) {
//     title = title.charAt(0).toUpperCase() + title.slice(1);
//   }

//   // If title is empty, use a default
//   if (!title || title.trim() === '') {
//     title = 'Skincare Step';
//   }

//   return {
//     id: step.id,
//     stepNumber: index + 1,
//     title: title,
//     description: step.why || 'No description available',
//     phase: step.phase || 'maintenance',
//     time: step.time || '',
//     productName: step.product_name,
//     productCategory: step.product_category,
//   };
// }

// utils/routineMapper.ts
import { RoutineStep } from '@/store/api/routineApi';

export interface UIRoutineStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  phase: string;
  time: string;
  productName: string | null;
  productCategory: string;
  productUrl: string | null; // ← ADD
  price: number | null; // ← ADD
}

export function mapStepToUI(step: RoutineStep, index: number): UIRoutineStep {
  let title = step.product_name || step.product_category;

  if (title && title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  if (!title || title.trim() === '') {
    title = 'Skincare Step';
  }

  return {
    id: step.id,
    stepNumber: index + 1,
    title,
    description: step.why || 'No description available',
    phase: step.phase || 'maintenance',
    time: step.time || '',
    productName: step.product_name,
    productCategory: step.product_category,
    productUrl: step.product_url ?? null, // ← ADD
    price: step.price ?? null, // ← ADD
  };
}
