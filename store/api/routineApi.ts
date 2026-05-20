// store/api/routineApi.ts
import { baseApi } from './baseApi';

// ── Response types ────────────────────────────────────────────────────────────

export interface RoutineStep {
  id: string;
  step?: number;
  phase: string;
  product_id: string | null;
  product_name: string | null;
  product_url: string | null;
  product_category: string;
  usage_reason: string;
  // Fields present on saved steps
  user_id?: string;
  scan_id?: string;
  time?: string; // 'morning', 'night', 'weekly'
  why?: string;
  created_at?: string;
}

export interface GeneratedRoutine {
  why: string[];
  routine: {
    time: string;
    frequency: string;
    phase: string;
    steps: RoutineStep[];
  };
}

export interface GenerateRoutineResponse {
  cached: boolean;
  duplicate: boolean;
  routine_step_id: string[];
  routine: GeneratedRoutine;
}

export interface SaveRoutineResponse {
  success: boolean;
  saved_count: number;
  routine_step_id: string[];
  data: {
    id: string;
    user_id: string;
    scan_id: string;
    time: string;
    phase: string;
    product_category: string;
    product_name: string | null;
    product_url: string | null;
    why: string;
    created_at: string;
  }[];
}

export interface DeleteStepResponse {
  success: boolean;
  message: string;
  deleted_step_id: string;
}

// ── Request arg types ─────────────────────────────────────────────────────────

export interface GenerateRoutineArg {
  product_scan_id: string;
}

export interface SaveRoutineArg {
  routine_step_id: string[];
}

export interface DeleteStepArg {
  step_id: string;
}

export interface ManualRoutineArg {
  product_name: string;
  instruction: string;
  time: 'morning' | 'night' | 'weekly';
}

// export interface ManualRoutineResponse {
//   saved: boolean;
//   routine_step_id: string[];
//   routine: GeneratedRoutine; // reuses your existing type
// }

export interface ManualRoutineResponse {
  saved: boolean;
  routine_step_id: string;
  routine: {
    id: string;
    user_id: string;
    scan_id: string;
    time: string;
    phase: string;
    product_category: string;
    product_name: string;
    product_url: string | null;
    why: string;
    created_at: string;
  };
}

export interface GetAllRoutinesResponse {
  success: boolean;
  count: number;
  data: RoutineStep[]; // ← Note: data array, not steps
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const routineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /generate/product-routine
     * Generates an AI routine from a product scan ID.
     * The same endpoint will later support face/hair scan IDs —
     * pass the appropriate scan_id and update the url when those ship.
     */
    generateProductRoutine: builder.mutation<GenerateRoutineResponse, GenerateRoutineArg>({
      query: (body) => ({
        url: '/generate/product-routine',
        method: 'POST',
        body,
      }),
    }),

    /**
     * POST /routine/save
     * Saves a list of routine step IDs to the user's profile.
     */
    saveRoutine: builder.mutation<SaveRoutineResponse, SaveRoutineArg>({
      query: (body) => ({
        url: '/routine/save',
        method: 'POST',
        body,
      }),
    }),

    /**
     * DELETE /routine/step/:step_id
     * Removes a single step from the routine on the backend.
     */
    deleteRoutineStep: builder.mutation<DeleteStepResponse, DeleteStepArg>({
      query: ({ step_id }) => ({
        url: `/routine/step/${step_id}`,
        method: 'DELETE',
      }),
    }),

    /**
     * POST /generate/manual-routine/ai
     * Generates an AI routine based on user input without requiring a product scan ID.
     */
    generateManualRoutine: builder.mutation<ManualRoutineResponse, ManualRoutineArg>({
      query: (body) => ({
        url: '/generate/manual-routine/ai',
        method: 'POST',
        body,
      }),
    }),

    manualRoutine: builder.mutation<ManualRoutineResponse, ManualRoutineArg>({
      query: (body) => ({
        url: '/generate/manual-routine',
        method: 'POST',
        body,
      }),
    }),

    /**
     * GET /routine/all
     * GET /routine/all
     */
    getAllRoutines: builder.query<GetAllRoutinesResponse, void>({
      query: () => ({
        url: '/routine/all',
        method: 'GET',
      }),
      providesTags: ['Routine'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGenerateProductRoutineMutation,
  useSaveRoutineMutation,
  useDeleteRoutineStepMutation,
  useGenerateManualRoutineMutation, // by ai routine generation like after scan
  useManualRoutineMutation,
  useGetAllRoutinesQuery,
} = routineApi;
