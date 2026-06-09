// store/api/routineCheckApi.ts
import { baseApi } from './baseApi';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RoutineConflict {
  product_a: string;
  product_b: string;
  severity: 'low' | 'medium' | 'high';
  reason: string;
}

export interface RoutineAllergyIssue {
  product: string;
  allergen: string;
  note: string;
}

export interface RoutinePregnancyIssue {
  product: string;
  ingredient: string;
  note: string;
}

export interface RoutineBudgetAnalysis {
  total_estimated_cost: number;
  user_budget_tier: string;
  is_within_budget: boolean;
  feedback: string;
}

export interface RoutineCheckResponse {
  conflicts: RoutineConflict[];
  allergy_issues: RoutineAllergyIssue[];
  pregnancy_issues: RoutinePregnancyIssue[];
  budget_analysis: RoutineBudgetAnalysis;
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const routineCheckApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkRoutine: builder.mutation<RoutineCheckResponse, void>({
      query: () => ({
        url: '/routine/check',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCheckRoutineMutation } = routineCheckApi;
