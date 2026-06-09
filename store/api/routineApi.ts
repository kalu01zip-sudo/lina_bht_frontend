import { baseApi } from './baseApi';

// ── Response types ────────────────────────────────────────────────────────────

export interface RoutineStep {
  id: string;
  step?: number;
  phase: string;
  product_id: string | null;
  product_name: string | null;
  product_url: string | null; // ← already existed; confirm not missing
  product_category: string;
  usage_reason: string;
  // Saved-step fields
  user_id?: string;
  scan_id?: string;
  time?: string;
  why?: string;
  price?: number | null; // ← NEW: per-step price from API
  created_at?: string;
  is_completed?: boolean;
  completed_at?: string | null;
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
  duplicate: boolean;
  message?: string; // present when duplicate: true
  cached?: boolean;
  routine_step_id?: string[];
  routine?: {
    why: string[];
    routine: {
      time: string;
      frequency: string;
      phase: string;
      steps: RoutineStep[];
    };
  };
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

export interface PatchStepResponse {
  success: boolean;
  step_id: string;
  is_completed: boolean;
  completed_at: string | null;
  data: RoutineStep;
}

export interface RoutineStepDetailProduct {
  image_url: string | null;
  category: string | null;
  name: string | null;
  ingredients?: string[];
  price?: number | null;
}

// ── Step details types ────────────────────────────────────────────────────────

export interface RoutineStepDetailNutrition {
  _id: string;
  id: string;
  name: string;
  'main ingredient': string; // space-separated key from API
  'how to improves': string; // space-separated key from API
  'image url': string; // space-separated key from API
  detected_condition: string[];
  // Legacy / alternative field names (kept for backwards compat with old responses)
  icon_url?: string;
  benefit?: string;
  tags?: string[];
  priority?: number;
}

export interface RoutineStepDetailFood {
  _id?: string;
  id: string;
  name: string;
  ingredients?: string[];
  detected_condition?: string[];
  benefits?: string;
  icon_url: string;
  tags: string[];
  score?: number;
  // Legacy
  description?: string;
}

export interface RoutineStepDetailRecipe {
  _id?: string;
  id: string;
  name: string;
  main_ingredients?: string[];
  detected_condition?: string[];
  how_it_improves?: string;
  tags: string[];
  image_url: string;
  score?: number;
  // Legacy
  description?: string;
  meal_type?: string;
}

export interface RoutineStepDetailResponse {
  video_url: string | null;
  video_title: string | null;
  reading_duration: string | null;
  product: RoutineStepDetailProduct;
  text: string | null;
  key_benefits: string[];
  what_you_learn: string[];

  // ── Actual API field names ────────────────────────────────────────────────
  nutritions?: RoutineStepDetailNutrition[];
  foods?: RoutineStepDetailFood[];
  recipes?: RoutineStepDetailRecipe[];

  // ── Legacy / alternative field names (old typed shape) ───────────────────
  key_nutrients?: RoutineStepDetailNutrition[];
  food_recommendation?: RoutineStepDetailFood[];
  recipe_recommendation?: RoutineStepDetailRecipe[];
}
export interface GetRoutineStepDetailArg {
  routine_id: string;
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

export interface PatchStepArg {
  step_id: string;
  is_completed: boolean;
}

export interface ManualRoutineArg {
  product_name: string;
  instruction: string;
  time: 'morning' | 'night' | 'weekly';
}

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

// Update GetAllRoutinesResponse
export interface GetAllRoutinesResponse {
  success: boolean;
  total: number;
  limit: number;
  offset: number;
  count: number;
  total_price?: number; // ← NEW: sum of all step prices
  data: RoutineStep[];
}

export interface GetAllRoutinesArg {
  limit?: number;
  offset?: number;
}

export interface HairRoutineStep {
  id: string;
  phase: string;
  product_category: string;
  product_name: string | null;
  product_url: string | null;
  why: string;
}

export interface HairRoutineResponse {
  scan_id: string;
  routine_step_id: string[];
  routine: {
    why: string[];
    morning: HairRoutineStep[];
    night: HairRoutineStep[];
    weekly_care: HairRoutineStep[];
  };
}

export interface HairRoutineArg {
  scan_id: string;
}

export interface FaceRoutineStep {
  id: string;
  phase: string;
  product_category: string;
  product_name: string | null;
  product_url: string | null;
  why: string;
}

export interface FaceRoutineResponse {
  scan_id: string;
  routine_step_id: string[];
  routine: {
    why: string[];
    morning: FaceRoutineStep[];
    night: FaceRoutineStep[];
    weekly_care: FaceRoutineStep[];
  };
}

export interface FaceRoutineArg {
  scan_id: string;
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const routineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateProductRoutine: builder.mutation<GenerateRoutineResponse, GenerateRoutineArg>({
      query: (body) => ({
        url: '/generate/product-routine',
        method: 'POST',
        body,
      }),
    }),

    saveRoutine: builder.mutation<SaveRoutineResponse, SaveRoutineArg>({
      query: (body) => ({
        url: '/routine/save',
        method: 'POST',
        body,
      }),
    }),

    deleteRoutineStep: builder.mutation<DeleteStepResponse, DeleteStepArg>({
      query: ({ step_id }) => ({
        url: `/routine/step/${step_id}`,
        method: 'DELETE',
      }),
    }),

    /**
     * PATCH /routine/step/:step_id/complete
     * Toggles the is_completed flag for a routine step.
     * Body { is_completed } will be re-added once backend supports it.
     */
    // patchRoutineStep: builder.mutation<PatchStepResponse, PatchStepArg>({
    //   query: ({ step_id }) => ({
    //     url: `/routine/step/${step_id}/complete`,
    //     method: 'PATCH',
    //   }),
    // }),

    patchRoutineStep: builder.mutation<PatchStepResponse, PatchStepArg>({
      query: ({ step_id }) => ({
        url: `/routine/step/${step_id}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),

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

    getAllRoutines: builder.query<GetAllRoutinesResponse, GetAllRoutinesArg>({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: `/routine/all?limit=${limit}&offset=${offset}`,
        method: 'GET',
      }),
      // All pages share one cache entry
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems, { arg }) => {
        if ((arg.offset ?? 0) === 0) {
          // Fresh load or refresh — replace
          currentCache.data = newItems.data;
        } else {
          // Append, deduplicating by id
          const existingIds = new Set(currentCache.data.map((s) => s.id));
          const unique = newItems.data.filter((s) => !existingIds.has(s.id));
          currentCache.data.push(...unique);
        }
        currentCache.total = newItems.total;
        currentCache.count = newItems.count;
        currentCache.success = newItems.success;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.offset !== previousArg?.offset,
      providesTags: ['Routine'],
    }),

    /**
     * GET /routine/details/:routine_id
     * Fetches rich details for a single routine step.
     */
    getRoutineStepDetails: builder.query<RoutineStepDetailResponse, GetRoutineStepDetailArg>({
      query: ({ routine_id }) => ({
        url: `/routine/details/${routine_id}`,
        method: 'GET',
      }),
    }),

    generateHairRoutine: builder.mutation<HairRoutineResponse, HairRoutineArg>({
      query: (body) => ({
        url: '/generate/scalp_hair',
        method: 'POST',
        body,
      }),
    }),

    generateFaceRoutine: builder.mutation<FaceRoutineResponse, FaceRoutineArg>({
      query: (body) => ({
        url: '/generate/face',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGenerateProductRoutineMutation,
  useSaveRoutineMutation,
  useDeleteRoutineStepMutation,
  usePatchRoutineStepMutation,
  useGenerateManualRoutineMutation,
  useManualRoutineMutation,
  useGetAllRoutinesQuery,
  useGetRoutineStepDetailsQuery,
  useGenerateHairRoutineMutation,
  useGenerateFaceRoutineMutation,
} = routineApi;
